// Redux imports
import store from "../../store/store.js";
import { initializeMapNodes, updateMapAlpha, updateMapCursors, updateNodeSize } from "../../store/slices/mapSlice.js";
import { initializeBattleTiles, setEntitySprites, updateTileSize, toggleBattleUI } from "../../store/slices/battleSlice.js";
import { setGameState } from "../../store/slices/gameStateSlice.js";

/// ECS
import System from "../System.js";

// Component
import Transform from "../components/Transform.js"
import Animation from "../components/Animation.js";

// enum
import { GameState, RoomType, SpriteLayer } from "../../data/enums.js";


export default class DisplaySystem extends System {
    // Display data
    #screenWidth;
    #screenHeight;
    #spriteSize;
    // Dynamic data
    #mapCursorIds = [];
    #selectId;
    #mapAlpha = 0;

    constructor() {
        super();
    }

    get spriteSize() {
        return this.#spriteSize;
    }

    initializeDisplay(dungeonLevel, entities, screenWidth, screenHeight, xMapOffset, yMapOffset, spriteSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY) {
        // Initialize display system constants
        this.#screenWidth = screenWidth;
        this.#screenHeight = screenHeight;
        this.#spriteSize = spriteSize;

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
                        y: x,
                        z: SpriteLayer.mapNode
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
                            y: x - 0.5,
                            z: SpriteLayer.mapPath
                        })
                    }

                    if (child.position.x > x) {
                        pathDispatchData.push({
                            id: `MAPPATH_(${x};${y};${child.position.x};${child.position.y})`,
                            sprite: `pathbottom`,
                            alpha: 0,
                            x: y + 0.5,
                            y: x + 0.5,
                            z: SpriteLayer.mapPath
                        })
                    }

                    if (child.position.x === x) {
                        pathDispatchData.push({
                            id: `MAPPATH_(${x};${y};${child.position.x};${child.position.y})`,
                            sprite: `pathright`,
                            alpha: 0,
                            x: y + 0.5,
                            y: x,
                            z: SpriteLayer.mapPath
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
                y: y,
                z: SpriteLayer.tile
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

    update(gameState, dungeonLevel, entities, components, deltaTime) {
        const {transform, animation} = components;
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
                    // Create unitInfo cursor components
                    const highlightedNodes = dungeonLevel.currentRoom ? dungeonLevel.currentRoom.children : dungeonLevel.rooms.filter(room => room.position.y === 0 && room.children.length);

                    for (let i = 0; i < highlightedNodes.length; i++) {
                        const cursorId = this.#mapCursorIds[i];
                        const { x, y } = highlightedNodes[i].position;
                        const cursorTransform = new Transform(y, x, SpriteLayer.mapCursor, 0);
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
                    selectTransform = new Transform(y, x, SpriteLayer.mapCursor, 0);
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
                store.dispatch(toggleBattleUI(true));
                this.#battleSpriteUpdate(entities, components, deltaTime);
                return GameState.idle;
            case GameState.battleStart:
                store.dispatch(toggleBattleUI(false));
                return GameState.battleStart;
            case GameState.battle:
                this.#battleSpriteUpdate(entities, components, deltaTime);
                return GameState.battle;
        }
    }

    #battleSpriteUpdate(entities, components, deltaTime) {
        const entityDispatchData = [];
        const { mouseDrag, tile, transform, animation, unitInfo, unitStats } = components;
        let mouseDragId;
        entities.forEach(entity => {
            if (mouseDrag.has(entity)) {
                mouseDragId = mouseDrag.get(entity).targetId;
            }

            let entityTransform, entityAnimation;
            if (tile.has(entity)) {
                // update or set transform component based on tile data
                if (transform.has(entity)) {
                    entityTransform = transform.get(entity);
                    if (entityTransform.target) {
                        entityTransform.update(deltaTime);
                    }   
                } else {
                    const { position, scale, speed } = tile.get(entity).value;
                    entityTransform = new Transform(position.x, position.y, position.z, speed, scale.x, scale.y);
                    transform.add(entity, entityTransform);
                }

                // update or set animation component based on unitInfo data
                if (unitInfo.has(entity) && unitStats.has(entity)) {
                    const entityStats = unitStats.get(entity);
                    if (entityStats.hp.current > 0) {
                        if (animation.has(entity)) {
                            entityAnimation = animation.get(entity);
                            entityAnimation.update(deltaTime);
                        } else {
                            const unitData = unitInfo.get(entity);
                            const { path, frames, speed } = unitData.sprite;
                            entityAnimation = new Animation(`${path}`, frames, speed);
                            animation.add(entity, entityAnimation);
                        }
                    } else animation.remove(entity);
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

        // Modify alpha of the dragged entity
        const selectedEntity = entityDispatchData.find(entity => entity.id === mouseDragId);
        if (selectedEntity) selectedEntity.alpha = 0.5;
        store.dispatch(setEntitySprites(entityDispatchData));
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