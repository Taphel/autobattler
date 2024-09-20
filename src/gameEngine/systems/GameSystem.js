// Class imports
import System from "../System.js";

// Components import

// data import
import { GameState } from "../../data/enums.js";

export default class GameSystem extends System {

    constructor() {
        super();
    }

    update(gameState, dungeonLevel, unitPool, pointerInput, entities, components, boardSize, deltaTime) {
        let newState = gameState;
        const { over, down, up, pointerPosition } = pointerInput;
        const { tile, mouseDrag, mouseOver, unitInfo, unitStats, unitSkill, unitAI, transform } = components;
        switch (gameState) {
            case GameState.mapStart:
                return GameState.mapStart;
            case GameState.map:
                if (down && 'x' in down && 'y' in down) {
                    if (dungeonLevel.currentRoom?.children.find(child => child.position.x === pointerInput.down.x && child.position.y === pointerInput.down.y) || (!dungeonLevel.currentRoom && pointerInput.down.y === 0)) {
                        // Valid room selected, transition to roomStart state
                        console.log(pointerInput.down);
                        dungeonLevel.setCurrentRoom(pointerInput.down);
                        console.log(dungeonLevel.currentRoom);
                        newState = GameState.roomStart;
                    }
                }
                return newState;
            case GameState.roomStart:
                return GameState.roomStart;
            case GameState.idle:
                let mouseOverId, mouseDragId
                entities.forEach(entity => {
                    // Update mouseOver targetId
                    if (mouseOver.has(entity)) {
                        const mouseOverComponent = mouseOver.get(entity);
                        if (over && 'id' in over) {
                            mouseOverId = over.id;
                            mouseOverComponent.setTargetId(over.id);
                        } else {
                            mouseOverComponent.setTargetId(null);
                        }
                    }

                    // Update mouseDrag targetId
                    if (mouseDrag.has(entity)) {
                        const entityMouseDrag = mouseDrag.get(entity);
                        if (pointerPosition) entityMouseDrag.setMousePosition(pointerPosition?.x, pointerPosition?.y);
                        if (down && 'id' in down && unitPool.playerUnits.includes(down.id) && unitInfo.has(down.id)) {
                            mouseDragId = down.id;
                            entityMouseDrag.setTargetId(down.id);
                        } else {
                            entityMouseDrag.setTargetId(null);
                        }
                    }
                })

                // Switch player units on mouse up
                if (up && mouseDragId !== undefined && mouseOverId !== undefined && unitPool.playerUnits.includes(mouseOverId)) {

                    const startTile = tile.has(mouseDragId) ? tile.get(mouseDragId) : null
                    const endTile = tile.has(mouseOverId) ? tile.get(mouseOverId) : null


                    // Cleanup component set references
                    tile.remove(mouseDragId)
                    tile.remove(mouseOverId)

                    // swap components
                    if (startTile) tile.add(mouseOverId, startTile);
                    if (endTile) tile.add(mouseDragId, endTile);
                }

                // Refresh unit position
                entities.forEach((entity) => {
                    if (tile.has(entity) && transform.has(entity)) {
                        const { position } = tile.get(entity).value;
                        const entityTransform = transform.get(entity);
                        entityTransform.setTarget(position.x, position.y);
                    }
                })

                return pointerInput.start ? GameState.battleStart : GameState.idle
            case GameState.battleStart:
                this.#orderBoardUnits(unitPool.playerUnits, unitPool.encounterUnits, components, boardSize);
                entities.forEach((entity) => {
                    if (tile.has(entity) && transform.has(entity)) {
                        const { position } = tile.get(entity).value;
                        const entityTransform = transform.get(entity);
                        entityTransform.setTarget(position.x, position.y);
                    }
                })
                return GameState.battle;
            case GameState.battle:
                // Check for any occuring movement before handling more actions
                let pendingMovements = 0;
                entities.forEach(entity => {
                    if (tile.has(entity)) {
                        if (transform.has(entity)) {
                            if (transform.get(entity).target) pendingMovements++;
                        }
                    }
                })

                if (!pendingMovements) {
                    // Sort active units by index
                    const playerBoard = unitPool.playerUnits.toSorted((a, b) => {
                        const aIndex = tile.get(a).value.index;
                        const bIndex = tile.get(b).value.index;

                        return aIndex - bIndex;
                    }).slice(0, 6);

                    const encounterBoard = unitPool.encounterUnits.toSorted((a, b) => {
                        const aIndex = tile.get(a).value.index;
                        const bIndex = tile.get(b).value.index;

                        return aIndex - bIndex;
                    })

                    // Check for any remaining actions in queue
                    const playerActions = [];
                    playerBoard.forEach(unit => {
                        if (unitAI.has(unit)) {
                            const { actionQueue } = unitAI.get(unit);
                            if (actionQueue.length > 0) playerActions.push({ id: unit, queue: actionQueue });
                        }
                    })

                    const encounterActions = [];
                    encounterBoard.forEach(unit => {
                        if (unitAI.has(unit)) {
                            const { actionQueue } = unitAI.get(unit);
                            if (actionQueue.length > 0) encounterActions.push({ id: unit, queue: actionQueue });
                        }
                    })

                    if (playerActions.length > 0 || encounterActions.length > 0) {
                        let deathCount = 0;
                        // Handle actions
                        /// Movement
                        for (let i = 0; i < playerActions.length; i++) {
                            const unit = playerActions[i];
                            if (unit.queue.length > 0) {
                                // Check for movement          
                                const pendingAction = unit.queue[0]
                                if (pendingAction.type === 'move') {
                                    const { target } = pendingAction;
                                    const unitTransform = transform.get(unit.id);
                                    unitTransform.setTarget(target.x, target.y);
                                    unit.queue.shift();
                                }

                                if (pendingAction.type === 'attack') {
                                    const userStats = unitStats.get(unit.id);
                                    console.log(userStats);
                                    const targetStats = unitStats.get(pendingAction.target);

                                    if (targetStats.update(userStats.attack)) {
                                        deathCount++;
                                        unitAI.get(pendingAction.target).clearActions()
                                    }
                                    unit.queue.shift();
                                }

                                if (pendingAction.type === 'wait') {
                                    pendingAction.duration -= deltaTime;
                                    if (pendingAction.duration <= 0) unit.queue.shift();
                                }
                            }
                        }

                        for (let i = 0; i < encounterActions.length; i++) {
                            const unit = encounterActions[i];
                            if (unit.queue.length > 0) {
                                // Check for movement          
                                const pendingAction = unit.queue[0]
                                if (pendingAction.type === 'move') {
                                    const { target } = pendingAction;
                                    const unitTransform = transform.get(unit.id);
                                    unitTransform.setTarget(target.x, target.y);
                                    unit.queue.shift();
                                }

                                if (pendingAction.type === 'attack') {
                                    const userStats = unitStats.get(unit.id);
                                    console.log(userStats);
                                    const targetStats = unitStats.get(pendingAction.target);

                                    if (targetStats.update(userStats.attack)) {
                                        deathCount++;
                                        unitAI.get(pendingAction.target).clearActions()
                                    }
                                    unit.queue.shift();
                                }

                                if (pendingAction.type === 'wait') {
                                    pendingAction.duration -= deltaTime;
                                    if (pendingAction.duration <= 0) unit.queue.shift();
                                }
                            }
                        }

                        // Death cleanup
                        if (deathCount) {
                            this.#orderBoardUnits(playerBoard, encounterBoard, components, boardSize)

                            entities.forEach((entity) => {
                                if (tile.has(entity) && transform.has(entity)) {
                                    const { position } = tile.get(entity).value;
                                    const entityTransform = transform.get(entity);
                                    entityTransform.setTarget(position.x, position.y);
                                }
                            })
                        }

                        
                    } else {
                        // Give actions
                        /// Procs

                        /// Skills

                        /// Leader attack
                        const playerLeader = {
                            ai: unitAI.get(playerBoard[0]),
                            tile: tile.get(playerBoard[0]),
                            transform: transform.get(playerBoard[0])
                        }
                        const encounterLeader = {
                            ai: unitAI.get(encounterBoard[0]),
                            tile: tile.get(encounterBoard[0]),
                            transform: transform.get(encounterBoard[0])
                        }

                        const playerTarget = {
                            x: playerLeader.tile.value.position.x + .5,
                            y: playerLeader.tile.value.position.y
                        }

                        playerLeader.ai.actionQueue.push(
                            {
                                type: 'move',
                                target: playerTarget
                            },
                            {
                                type: 'attack',
                                target: encounterBoard[0]
                            },
                            {
                                type: 'move',
                                target: tile.get(playerBoard[0]).value.position
                            },
                            { 
                                type: 'wait',
                                duration: 500
                            }
                        )

                        const encounterTarget = {
                            x: encounterLeader.tile.value.position.x - .5,
                            y: encounterLeader.tile.value.position.y
                        }

                        encounterLeader.ai.actionQueue.push(
                            {
                                type: 'move',
                                target: encounterTarget
                            },
                            {
                                type: 'attack',
                                target: playerBoard[0]
                            },
                            {
                                type: 'move',
                                target: tile.get(encounterBoard[0]).value.position
                            },
                            { 
                                type: 'wait',
                                duration: 500
                            }
                        )
                    }
                }

                return GameState.battle;
        }
    }

    #orderBoardUnits(playerUnits, encounterUnits, components, boardSize) {
        function retrieveTileComponents(idArray, tile) {
            return idArray.map(id => {
                const tileComponent = tile.get(id);
                tile.remove(id);
                return tileComponent;
            })
        }

        function orderUnits(idArray, unitStats) {
            const orderedUnits = [];
            for (let i = idArray.length - 1; i >= 0; i--) {
                const unit = idArray[i];
                if (unitStats.has(unit)) {
                    const statComponent = unitStats.get(unit);
                    console.log(unit, statComponent)
                    if (statComponent.hp.current > 0) {
                        orderedUnits.unshift(unit);
                    } else {
                        orderedUnits.push(unit);
                    }
                } else orderedUnits.push(unit);
            }

            return orderedUnits;
        }


        const { tile, unitStats } = components;
        const playerBoard = playerUnits.filter(unit => {
            const unitTile = tile.get(unit);
            return unitTile.value.index < boardSize;
        })
        .toSorted((a, b) => {
            const aTile = tile.get(a);
            const bTile = tile.get(b);
            return aTile.value.index - bTile.value.index;
        })

        // Retrieve tile components from all units
        const playerTiles = retrieveTileComponents(playerBoard, tile);
        const enemyTiles = retrieveTileComponents(encounterUnits, tile);

        // Order unit ids by pushing dead / empty unit tiles back;
        const orderedPlayers = orderUnits(playerBoard, unitStats);
        const orderedEncounterUnits = orderUnits(encounterUnits, unitStats);

        orderedPlayers.forEach((player, index) => {
            tile.add(player, playerTiles[index]);
        })

        orderedEncounterUnits.forEach((encounterUnit, index) => {
            tile.add(encounterUnit, enemyTiles[index]);
        })
    }
}