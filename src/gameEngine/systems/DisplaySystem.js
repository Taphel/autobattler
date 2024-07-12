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
        const { transform, animation, unit } = components;
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
                        const { position } = cursorTransform;
                        const { sprites, currentFrame } = cursorAnimation;
                        cursorDispatchData.push({
                            id: id,
                            x: position.x,
                            y: position.y,
                            z: position.z,
                            sprite: `${sprites[currentFrame]}`,
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
                    const { sprites, currentFrame } = selectAnimation;
                    cursorDispatchData.push({
                        id: this.#selectId,
                        x: x,
                        y: y,
                        z: z,
                        sprite: `${sprites[currentFrame]}`,
                        alpha: this.#mapAlpha,
                    })
                }

                store.dispatch(updateMapCursors(cursorDispatchData));
                store.dispatch(setGameState(newState));
                return newState;
            case GameState.idle:
                const entityDispatchData = [];
                // Read pointer input
                const { over, down, position } = pointerInput;
                const clickedUnit = down && 'id' in down && unitPool.playerUnits.includes(down?.id) && unit.has(down?.id);

                entities.forEach(entity => {
                    let entityTransform, entityAnimation, entityPosition, entitySpeed = 0.015, scale = { x: 1, y: 1 }, interactable = false;
                    // Determine unit X and Y based on faction and index in unit arrays;
                    const playerUnit = unitPool.playerUnits.includes(entity);
                    const enemyUnit = unitPool.enemyUnits.includes(entity);
                    const dragEntity = entity === this.#dragEntityId;
                    const select = entity === this.#selectId;

                    if (playerUnit || enemyUnit) {
                        interactable = true;
                        if (playerUnit) {
                            scale = { x: 1, y: 1 }
                            const unitIndex = entity - unitPool.playerUnits[0];
                            entityPosition = {
                                x: unitIndex < unitPool.playerUnits[0] + unitPool.boardSize ?
                                    this.#playerStartX - unitIndex :
                                    this.#sideBoardX + (unitIndex - unitPool.boardSize),
                                y: unitIndex < unitPool.playerUnits[0] + unitPool.boardSize ?
                                    this.#boardY : this.#sideBoardY,
                                z: 4
                            }
                        }

                        if (enemyUnit) {
                            const unitIndex = entity - unitPool.enemyUnits[0];
                            entityPosition = {
                                x: unitIndex + this.#enemyStartX,
                                y: this.#boardY,
                                z: 4
                            }
                        }
                    }

                    if (dragEntity) {
                        scale = { x: -1, y: 1 };
                        if (clickedUnit) {
                            // Set drag entity position based on mouse cursor
                            if (position && 'x' in position && 'y' in position) {
                                entityPosition = {
                                    x: position.x / this.#spriteSize,
                                    y: position.y / this.#spriteSize,
                                    z: 5
                                }
                                entitySpeed = 0;
                            }

                            entityAnimation = animation.has(entity) ? animation.get(entity) : null;
                            if (entityAnimation) {
                                entityAnimation.update(deltaTime);
                            } else {
                                entityAnimation = animation.has(down.id) ? animation.get(down.id) : null;
                                if (entityAnimation) {
                                    animation.add(entity, entityAnimation);
                                }
                            }
                        } else {
                            transform.remove(entity);
                            animation.remove(entity);
                        }
                    }

                    if (select && clickedUnit) {
                        if (over) {
                            if ('id' in over && unitPool.playerUnits.includes(over?.id)) {
                                const unitIndex = over.id - unitPool.playerUnits[0];
                                entityPosition = {
                                    x: unitIndex < unitPool.playerUnits[0] + unitPool.boardSize ?
                                        this.#playerStartX - unitIndex:
                                        this.#sideBoardX + (unitIndex - unitPool.boardSize),
                                    y: unitIndex < unitPool.playerUnits[0] + unitPool.boardSize ?
                                        this.#boardY + 0.5 : this.#sideBoardY + 0.5,
                                    z: 3
                                }

                                entityAnimation = animation.has(entity) ? animation.get(entity) : null;
                                if (entityAnimation) {
                                    entityAnimation.update(deltaTime);
                                } else {
                                    entityAnimation = new Animation(`tilecursor`, 1, 0);
                                    animation.add(entity, entityAnimation);
                                }
                            }
                        }
                    }


                    // Update or create the transform component based on the new position;
                    if (entityPosition) {
                        if (transform.has(entity)) {
                            entityTransform = transform.get(entity);
                            entityTransform.setTarget(entityPosition.x, entityPosition.y);
                            entityTransform.update(deltaTime);
                        } else {
                            entityTransform = new Transform(entityPosition.x, entityPosition.y, entityPosition.z, entitySpeed);
                            transform.add(entity, entityTransform);
                        }
                    } else {
                        transform.remove(entity);
                    }
                    
                    // Update or create animation component if a unit is on this spot
                    if (unit.has(entity)) {
                        entityAnimation = animation.has(entity) ? animation.get(entity) : null;
                        if (entityAnimation) {
                            entityAnimation.update(deltaTime);
                        } else {
                            const unitData = unit.get(entity);
                            const { path, frames, speed } = unitData.sprite;
                            entityAnimation = new Animation(`${path}`, frames, speed);
                            animation.add(entity, entityAnimation);
                        }
                    } else {
                        animation.remove(entity);
                    }

                    // Create dispatch data for this entity
                    if (entityTransform) {
                        const { x, y, z } = entityTransform.position;
                        let entitySprite;
                        if (entityAnimation) {
                            const { sprites, currentFrame } = entityAnimation;
                            entitySprite = sprites[currentFrame];
                        } else entitySprite = `empty`;

                        entityDispatchData.push({
                            id: entity,
                            x: x,
                            y: y,
                            z: z,
                            sprite: entitySprite,
                            alpha: clickedUnit && entity === down?.id ? 0.5 : 1,
                            scale: scale,
                            anchor: dragEntity ? { x: 0.5, y: 0.5 } : { x: 0, y: 0 },
                            interactable: interactable
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