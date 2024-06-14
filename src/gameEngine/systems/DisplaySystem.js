// Redux imports
import store from "../../store/store.js";
import { updateCameraSize, setGridTiles, setEntitySprites } from "../../store/slices/cameraSlice.js";

/// ECS
import System from "../System.js";
import Entity from "../Entity.js";
// Component
import Camera from "../components/Camera.js";
import Transform from "../components/Transform.js"
import Animation from "../components/Animation.js";

/// Other files
// Enums
import { TileType } from "../../data/enums.js";
import { EntityFlag, GameState } from "../../data/enums.js";
// Data
import constants from "../../data/constants.js";



export default class DisplaySystem extends System {
    #playerId;
    #cameraId;

    #displayQueue = [];
    #pendingAnimations = 0;

    constructor() {
        super();
    }

    get pendingAnimations() {
        return this.#pendingAnimations;
    }

    initializeDisplay(dungeonLevel, entities, components) {
        // get the player position
        entities.forEach(entity => {
            if (components.entityFlags.has(entity)) {
                const isPlayer = components.entityFlags.get(entity).hasFlag(EntityFlag.item);
                if (isPlayer) {
                    this.#playerId = entity;
                    const { x, y } = components.transform.get(entity).tilePosition;
                    const cameraX = Math.max(x - Math.floor(constants.cameraWidth / 2), 0);
                    const cameraY = Math.max(y - Math.floor(constants.cameraHeight / 2), 0);

                    // Create camera entity
                    this.#cameraId = entities.length;
                    entities.push(this.#cameraId);
                    components.camera.add(this.#cameraId, new Camera(constants.cameraWidth, constants.cameraHeight));
                    components.transform.add(this.#cameraId, new Transform(0, 0, 0, 0.2))
                }
            }
        })

        // Initialise sprites for each tile;
        const { grid, width, height } = dungeonLevel;
        const tilesDispatchData = [];

        grid.forEach(tile => {
            switch (tile.type) {
                case TileType.floor:
                    tile.setSprite("111111111");
                    break;
                case TileType.wall:
                    const bitmaskArray = []
                    for (let y = tile.position.y - 1; y <= tile.position.y + 1; y++) {
                        for (let x = tile.position.x - 1; x <= tile.position.x + 1; x++) {
                            const tile = dungeonLevel.findTile(x, y);
                            if (tile && tile?.type === TileType.floor) {
                                bitmaskArray.push(1);
                            } else {
                                bitmaskArray.push(0);
                            }
                        }
                    }

                    let bitmaskString = "";
                    bitmaskArray.forEach(bit => {
                        bitmaskString += bit.toString();
                    });
                    tile.setSprite(bitmaskString);
                    break;
            }

            tilesDispatchData.push({
                id: tile.id,
                sprite: `/sprites/tilesets/${dungeonLevel.tileset}/${tile.sprite}.png`,
                display: "visible",
                position: { x: tile.position.x, y: tile.position.y }
            })
        })

        // Initialize entity display store
        const entitiesDispatchData = []
        entities.forEach(entity => {
            const { animation, transform } = components;
            if (animation.has(entity) && transform.has(entity)) {
                const { sprites, currentFrame } = animation.get(entity);
                const { x, y, z } = transform.get(entity).position;

                entitiesDispatchData.push({
                    id: entity,
                    sprites: sprites,
                    currentFrame: currentFrame,
                    x: x,
                    y: y,
                    z: z,
                })
            }
        })

        store.dispatch(updateCameraSize({ width: constants.cameraWidth, height: constants.cameraHeight }));
    }

    update(dungeonLevel, entities, components, deltaTime, newDisplayQueue) {
        // Initialize variables
        this.#pendingAnimations = 0;
        const tileUpdateData = [];
        const entityUpdateData = [];
        const { animation, camera, transform, entityFlags, vision } = components;
        let playerFov = vision.has(this.#playerId) ? vision.get(this.#playerId).fieldOfView : null;

        // update and manage display queue
        if (newDisplayQueue) newDisplayQueue.forEach(element => this.#displayQueue.push(element))

        const updatedDisplayQueue = [];

        this.#displayQueue.forEach(element => {
            if (element.animation) {
                const { position, sprite, frames } = element.animation;
                const animationId = entities.length;
                entities.push(animationId);
                transform.add(animationId, new Transform(position.x, position.y, 3, 0));
                animation.add(animationId, new Animation(sprite, frames, true));
            }

            if (element.transform) {
                const { id, position } = element.transform;
                if (transform.get(id).target) {
                    updatedDisplayQueue.push(element);
                } else {
                    transform.get(id).setTarget(position);
                }
            }

            if (element.death) {
                console.log("DEATH", element.death);
                const { id } = element.death;
                // Check for pending movement
                if (transform.get(id)?.target) {
                    updatedDisplayQueue.push(element);
                } else {
                    // TBD - death fade
                    console.log(id);
                    console.log(id, "DYING")
                    transform.remove(id);
                    animation.remove(id);
                }
            }  
        })

        // Update display queue
        this.#displayQueue = updatedDisplayQueue;

        entities.forEach(entity => {
            if (transform.has(entity)) {
                // Update camera target position
                // if (camera.has(entity)) {
                //     if (transform.has(this.#playerId)) {
                //         const { width, height } = camera.get(entity);
                //         const { x, y } = transform.get(this.#playerId).tilePosition;

                //         const cameraX = Math.min(Math.max(x - Math.floor(width / 2), 0), dungeonLevel.width - width);
                //         const cameraY = Math.min(Math.max(y - Math.floor(height / 2), 0), dungeonLevel.height - height);

                //         transform.get(entity).setTarget({ x: cameraX, y: cameraY });
                //     }
                // }

                // Update world position
                const transformUpdate = transform.get(entity).update(deltaTime);
                const { x, y, z } = transformUpdate.position
                if (transformUpdate.target) this.#pendingAnimations++;

                // Update sprite frame 
                if (animation.has(entity)) {
                    let clearDisplayComponents = false;
                    const animationUpdate = animation.get(entity).update(deltaTime);
                    if (animationUpdate.playOnce) {
                        if (animationUpdate.lastFrame) {
                            clearDisplayComponents = true;
                        } else {
                            this.#pendingAnimations++;
                        }
                    }

                    if (!clearDisplayComponents) {
                        // Look for camera and create store data
                        const cameraPosition = transform.has(this.#cameraId) ? transform.get(this.#cameraId).position : null;
                        
                        if (cameraPosition) {
                            const entityDisplayX = x - cameraPosition.x;
                            const entityDisplayY = y - cameraPosition.y;
                            const { currentFrame, sprites } = animation.get(entity);

                            let display = true; // Test
                            let entityInFov;

                            // if (playerFov) {
                            //     const { tilePosition } = transform.get(entity);
                            //     entityInFov = playerFov.find(coordinates => {
                            //         return coordinates.x === tilePosition.x && coordinates.y === tilePosition.y
                            //     })

                            //     display = entityInFov ? true : false;
                            // }

                            entityUpdateData.push(
                                {
                                    id: entity,
                                    sprites: sprites,
                                    currentFrame: currentFrame,
                                    x: entityDisplayX,
                                    y: entityDisplayY,
                                    z: z,
                                    display: true
                                })
                        }
                    } else {
                        animation.remove(entity);
                        transform.remove(entity);
                    }
                }
            }
        })

        dungeonLevel.grid.forEach(tile => {
            // Look for camera and create store data
            const cameraPosition = transform.has(this.#cameraId) ? transform.get(this.#cameraId).position : null;

            const tileDisplayX = tile.position.x * 16;
                const tileDisplayY = tile.position.y * 16;
                let display = "visible";

                // const { isExplored } = tile;
                // if (isExplored) {
                //     let tileInFov;
                //     if (playerFov) {
                //         tileInFov = playerFov.find(coordinates => coordinates.x === tile.position.x && coordinates.y === tile.position.y);
                //     }
                //     display = tileInFov ? "visible" : "fog";
                // } else {
                //     display = "hidden";
                // }
                tileUpdateData.push({
                    id: tile.id,
                    position: tile.position,
                    x: tileDisplayX,
                    y: tileDisplayY,
                    display: display,
                    sprite: `/sprites/tilesets/${dungeonLevel.tileset}/${tile.sprite}.png`
                })
        })

        store.dispatch(setGridTiles(tileUpdateData));
        store.dispatch(setEntitySprites(entityUpdateData));
    }
}