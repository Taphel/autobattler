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
                const { animation, transform, unitInfo, unitStats, unitSkill, mouseDrag, mouseOver } = components;
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

                    const startComponents = {
                        animation: animation.has(mouseDragId) ? animation.get(mouseDragId) : null,
                        transform: transform.has(mouseDragId) ? transform.get(mouseDragId) : null,
                        unitInfo: unitInfo.has(mouseDragId) ? unitInfo.get(mouseDragId) : null,
                        unitStats: unitStats.has(mouseDragId) ? unitStats.get(mouseDragId) : null,
                        unitSkill: unitSkill.has(mouseDragId) ? unitSkill.get(mouseDragId) : null,
                    }

                    const endComponents = {
                        animation: animation.has(mouseOverId) ? animation.get(mouseOverId) : null,
                        transform: transform.has(mouseOverId) ? transform.get(mouseOverId) : null,
                        unitInfo: unitInfo.has(mouseOverId) ? unitInfo.get(mouseOverId) : null,
                        unitStats: unitStats.has(mouseOverId) ? unitStats.get(mouseOverId) : null,
                        unitSkill: unitSkill.has(mouseOverId) ? unitSkill.get(mouseOverId) : null,
                        
                    }

                    // Cleanup component set references
                    animation.remove(mouseDragId)
                    animation.remove(mouseOverId)
                    transform.remove(mouseDragId)
                    transform.remove(mouseOverId)
                    unitInfo.remove(mouseDragId)
                    unitInfo.remove(mouseOverId)
                    unitStats.remove(mouseDragId)
                    unitStats.remove(mouseOverId)
                    unitSkill.remove(mouseDragId)
                    unitSkill.remove(mouseOverId)

                    // swap components
                    if (startComponents.animation) animation.add(mouseOverId, startComponents.animation);
                    if (endComponents.animation) animation.add(mouseDragId, endComponents.animation);
                    if (startComponents.transform) transform.add(mouseOverId, startComponents.transform);
                    if (endComponents.transform) transform.add(mouseDragId, endComponents.transform);
                    if (startComponents.unitInfo) unitInfo.add(mouseOverId, startComponents.unitInfo);
                    if (endComponents.unitInfo) unitInfo.add(mouseDragId, endComponents.unitInfo);
                    if (startComponents.unitStats) unitStats.add(mouseOverId, startComponents.unitStats);
                    if (endComponents.unitStats) unitStats.add(mouseDragId, endComponents.unitStats);
                    if (startComponents.unitSkill) unitSkill.add(mouseOverId, startComponents.unitSkill);
                    if (endComponents.unitSkill) unitSkill.add(mouseDragId, endComponents.unitSkill);
                }
                return GameState.idle;
        }
    }
}