// Redux imports
import store from "../../store/store.js";
import { initializeMapNodes, updateMapAlpha, updateMapCursors, updateNodeSize } from "../../store/slices/mapSlice.js";
import { initializeBattleTiles, setEntitySprites, updateTileSize } from "../../store/slices/battleSlice.js";
import { setGameState } from "../../store/slices/gameStateSlice.js";

/// ECS
import System from "../System.js";

// Component
import Transform from "../components/Transform.js"
import Animation from "../components/Animation.js";

// enum
import { GameState, RoomType, UnitFaction } from "../../data/enums.js";


export default class DisplaySystem extends System {
    // Display data
    #screenWidth;
    #screenHeight;
    #spriteSize;
    // Constant data
    #playerStartX;
    #enemyStartX;
    #boardY;
    #sideBoardX;
    #sideBoardY;
    // Dynamic data
    #mapCursorIds = [];
    #selectId;
    #dragEntityId;
    #mapAlpha = 0;
    #displayQueue = [];
    #pendingAnimations = 0;

    constructor() {
        super();
    }

    get pendingAnimations() {
        return this.#pendingAnimations;
    }

    initializeDisplay(dungeonLevel, entities, screenWidth, screenHeight, xMapOffset, yMapOffset, spriteSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY) {
        // Initialize display system constants
        this.#screenWidth = screenWidth;
        this.#screenHeight = screenHeight;
        this.#spriteSize = spriteSize;
        this.#playerStartX = playerStartX;
        this.#enemyStartX = enemyStartX;
        this.#boardY = boardY;
        this.#sideBoardX = sideBoardX;
        this.#sideBoardY = sideBoardY;

        // Create the map store slice
        const nodeDispatchData = [];
        const pathDispatchData = [];
        const { rooms } = dungeonLevel;
        rooms.forEach(room => {
            const { x, y } = room.position;
            let nodeSprite;
            switch (room.type) {
                case RoomType.combat:
                    nodeSprite = "combat";
                    break;
                case RoomType.elite:
                    nodeSprite = "elite";
                    break;
                case RoomType.shop:
                    nodeSprite = "shop";
                    break;
                case RoomType.altar:
                    nodeSprite = "altar";
                    break;
                case RoomType.treasure:
                    nodeSprite = y === 4 ? "treasure" : "event";
                    break;
                case RoomType.event:
                    nodeSprite = "event";
                    break;
                case RoomType.boss:
                    nodeSprite = "exit";
                    break;
            }

            if (nodeSprite) {
                nodeDispatchData.push(
                    {
                        id: `MAPNODE_(${x};${y})`,
                        gridPosition: room.position,
                        sprite: `${nodeSprite}`,
                        alpha: 0,
                        x: y,
                        y: x
                    }
                )
            }


            if (room.children) {
                room.children.forEach(child => {
                    if (child.position.x < x) {
                        pathDispatchData.push({
                            id: `MAPPATH_(${x};${y};${child.position.x};${child.position.y})`,
                            sprite: `pathtop`,
                            alpha: 0,
                            x: y + 0.5,
                            y: x - 0.5
                        })
                    }

                    if (child.position.x > x) {
                        pathDispatchData.push({
                            id: `MAPPATH_(${x};${y};${child.position.x};${child.position.y})`,
                            sprite: `pathbottom`,
                            alpha: 0,
                            x: y + 0.5,
                            y: x + 0.5
                        })
                    }

                    if (child.position.x === x) {
                        pathDispatchData.push({
                            id: `MAPPATH_(${x};${y};${child.position.x};${child.position.y})`,
                            sprite: `pathright`,
                            alpha: 0,
                            x: y + 0.5,
                            y: x
                        })
                    }
                })
            }
        })

        store.dispatch(initializeMapNodes({
            nodes: nodeDispatchData,
            paths: pathDispatchData,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            xOffset: xMapOffset,
            yOffset: yMapOffset,
            spriteSize: spriteSize
        }));

        // Create the map store slice
        const tileDispatchData = [];
        for (let i = 0; i < screenWidth * 7; i++) {
            const x = i % screenWidth;
            const y = Math.floor(i / screenWidth);
            let tileSprite;
            if (y === 1) {
                tileSprite = `wall`;
            }

            if (y === 2) {
                tileSprite = `ground`;
            }

            if (y === 3) {
                tileSprite = `border`;
            }

            if (y === 4) {
                if (x === 3) {
                    tileSprite = `sidecornerleft`;
                }

                if (x > 3) {
                    if (x < 12) {
                        tileSprite = `sideground`;
                    } else if (x === 12) {
                        tileSprite = `sidecornerright`;
                    }
                }
            }

            if (y === 5) {
                if (x === 3) {
                    tileSprite = `sidecornerborderleft`;
                }

                if (x > 3) {
                    if (x < 12) {
                        tileSprite = `sideborder`;
                    } else if (x === 12) {
                        tileSprite = `sidecornerborderright`;
                    }
                }
            }

            tileDispatchData.push({
                id: `TILE(${x};${y})`,
                sprite: tileSprite,
                alpha: 1,
                x: x,
                y: y
            })
        }

        store.dispatch(initializeBattleTiles({
            tiles: tileDispatchData,
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            spriteSize: spriteSize
        }));

        // Allocate memory for map cursors and map select
        for (let i = 0; i < screenHeight; i++) {
            const mapCursorId = entities.length;
            this.#mapCursorIds.push(mapCursorId);
            entities.push(mapCursorId);
        }

        const selectCursorId = entities.length;
        this.#selectId = selectCursorId;
        entities.push(selectCursorId);

        // Allocate memory for drag and drop entity
        const dragEntityId = entities.length;
        this.#dragEntityId = dragEntityId;
        entities.push(dragEntityId);
    }

    resize(width, height) {
        let spriteSize = 32;
        let maxWidth = width / spriteSize;
        let maxHeight = height / spriteSize;

        if (maxWidth >= this.#screenWidth && maxHeight >= this.#screenHeight) {
            while (maxWidth >= this.#screenWidth && maxHeight >= this.#screenHeight) {
                spriteSize *= 2;
                maxWidth = width / spriteSize;
                maxHeight = height / spriteSize;
            }
            spriteSize /= 2;
        }
        this.#spriteSize = spriteSize;
        store.dispatch(updateNodeSize(spriteSize));
        store.dispatch(updateTileSize(spriteSize));
    }

    update(gameState, dungeonLevel, entities, components, unitPool, pointerInput, deltaTime) {
        const { tile, transform, animation, unit } = components;
        const cursorDispatchData = [];
        let newState = gameState;
        switch (gameState) {
            case GameState.mapStart:
                if (this.#mapAlpha < 1) {
                    this.#mapAlpha += 0.05;
                } else {
                    newState = GameState.map;
                }

                store.dispatch(updateMapAlpha(this.#mapAlpha));
                store.dispatch(setGameState(newState));
                return newState;
            case GameState.map:
                let displayedCursors = 0;
                this.#mapCursorIds.forEach(id => {
                    if (transform.has(id) && animation.has(id)) displayedCursors++;
                })

                if (!displayedCursors) {
                    // Create unit cursor components
                    const highlightedNodes = dungeonLevel.currentRoom ? dungeonLevel.currentRoom.children : dungeonLevel.rooms.filter(room => room.position.y === 0 && room.children.length);

                    for (let i = 0; i < highlightedNodes.length; i++) {
                        const cursorId = this.#mapCursorIds[i];
                        const { x, y } = highlightedNodes[i].position;
                        const cursorTransform = new Transform(y, x, 3, 0);
                        const cursorAnimation = new Animation(`cursor`, 10, 60);
                        transform.add(cursorId, cursorTransform);
                        animation.add(cursorId, cursorAnimation)
                    }
                } else {
                    this.#mapCursorIds.forEach(id => {
                        // update cursor animation
                        const cursorAnimation = animation.has(id) ? animation.get(id) : null;
                        if (cursorAnimation) cursorAnimation.update(deltaTime);
                    })
                }

                this.#mapCursorIds.forEach(id => {
                    const cursorTransform = transform.has(id) ? transform.get(id) : null;
                    const cursorAnimation = animation.has(id) ? animation.get(id) : null;

                    if (cursorTransform && cursorAnimation) {
                        const { position, anchor } = cursorTransform;
                        const { sprite } = cursorAnimation;
                        cursorDispatchData.push({
                            id: id,
                            x: position.x,
                            y: position.y,
                            z: position.z,
                            sprite: sprite,
                            anchor: anchor,
                            alpha: 1,
                        })
                    }
                })

                store.dispatch(updateMapCursors(cursorDispatchData));
                return GameState.map;
            case GameState.roomStart:
                let selectTransform, selectAnimation;
                if (transform.has(this.#selectId) && animation.has(this.#selectId)) {
                    selectTransform = transform.get(this.#selectId);
                    selectAnimation = animation.get(this.#selectId);
                    const animationUpdate = selectAnimation.update(deltaTime);
                    if (animationUpdate.lastFrame) {
                        this.#mapAlpha -= 0.05;
                        store.dispatch(updateMapAlpha(this.#mapAlpha));
                    }
                } else {
                    // Clear out map cursors
                    this.#clearMapCursors(components);
                    const { x, y } = dungeonLevel.currentRoom.position;
                    selectTransform = new Transform(y, x, 3, 0);
                    transform.add(this.#selectId, selectTransform);
                    selectAnimation = new Animation(`selected`, 10, 45, true);
                    animation.add(this.#selectId, selectAnimation);
                }

                // if fade is finished, switch gameState and clear out components
                if (this.#mapAlpha <= 0) {
                    this.#clearMapSelect(components);
                    newState = GameState.idle;
                } else {
                    const { x, y, z } = selectTransform.position;
                    const { anchor } = selectTransform;
                    const { sprite } = selectAnimation;
                    cursorDispatchData.push({
                        id: this.#selectId,
                        x: x,
                        y: y,
                        z: z,
                        sprite: sprite,
                        alpha: this.#mapAlpha,
                        anchor: anchor
                    })
                }

                store.dispatch(updateMapCursors(cursorDispatchData));
                store.dispatch(setGameState(newState));
                return newState;
            case GameState.idle:
                const entityDispatchData = [];
                entities.forEach(entity => {
                    let entityTransform, entityAnimation;
                    if (tile.has(entity)) {
                        // update or set transform component based on tile data
                        const { position, scale, speed } = tile.get(entity).value;
                        if (transform.has(entity)) {
                            entityTransform = transform.get(entity);
                            entityTransform.setTarget(position.x, position.y);
                            entityTransform.update(deltaTime);
                        } else {
                            entityTransform = new Transform(position.x, position.y, position.z, speed, scale.x, scale.y);
                            transform.add(entity, entityTransform);
                        }

                        // update or set animation component based on unit data
                        if (unit.has(entity)) {
                            console.log(entity, unit.get(entity))
                            if (animation.has(entity)) {
                                entityAnimation = animation.get(entity);
                                entityAnimation.update(deltaTime);
                            } else {
                                const unitData = unit.get(entity);
                                const { path, frames, speed } = unitData.sprite;
                                entityAnimation = new Animation(`${path}`, frames, speed);
                                animation.add(entity, entityAnimation);
                            }
                        } else animation.remove(entity);
                    }

                    // Create dispatch data for this entity
                    if (entityTransform) {
                        const { x, y, z } = entityTransform.position;
                        const { anchor, scale } = entityTransform;
                        let entitySprite;
                        if (entityAnimation) {
                            entitySprite = entityAnimation.sprite;
                        } else entitySprite = `empty`;

                        entityDispatchData.push({
                            id: entity,
                            x: x,
                            y: y,
                            z: z,
                            sprite: entitySprite,
                            alpha: 1,
                            scale: scale,
                            anchor: anchor
                        })
                    }
                })

                store.dispatch(setEntitySprites(entityDispatchData));
                return GameState.idle;
        }
    }

    #clearMapCursors(components) {
        if (!this.#mapCursorIds.length) return;
        const { transform, animation } = components;
        // Clear cursor display components
        this.#mapCursorIds.forEach(id => {
            transform.remove(id);
            animation.remove(id);
        })
    }

    #clearMapSelect(components) {
        if (!this.#selectId) return;
        const { transform, animation } = components;
        // Clear cursor display components
        transform.remove(this.#selectId);
        animation.remove(this.#selectId);
    }
}