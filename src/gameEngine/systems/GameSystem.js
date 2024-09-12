// Class imports
import System from "../System.js";

// Components import

// data import
import { GameState } from "../../data/enums.js";

export default class GameSystem extends System {

    constructor() {
        super();
    }

    update(gameState, dungeonLevel, unitPool, pointerInput, entities, components) {
        let newState = gameState;
        const { over, down, up, pointerPosition } = pointerInput;
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
                const { tile, mouseDrag, mouseOver, unitInfo } = components;
                let mouseOverId, mouseDragId
                entities.forEach(entity => {
                    if (mouseOver.has(entity)) {
                        const mouseOverComponent = mouseOver.get(entity);
                        if (over && 'id' in over) {
                            mouseOverId = over.id;
                            mouseOverComponent.setTargetId(over.id);
                        } else {
                            mouseOverComponent.setTargetId(null);
                        }
                    }

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
                console.log(pointerInput.start)
                return pointerInput.start ? GameState.battle : GameState.idle
            case GameState.battle:
                return GameState.battle;
        }
    }
}