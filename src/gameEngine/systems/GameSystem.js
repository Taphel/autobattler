// Class imports
import System from "../System.js";

// Components import

// data import
import { GameState, UnitFaction, AbilityCost, AbilityTarget, AbilityEffect } from "../../data/enums.js";
import Unit from "../components/Unit.js";

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
                const { animation, transform, unit, mouseDrag, mouseOver } = components;
                let mouseOverId, mouseDragId
                entities.forEach(entity => {
                    if (mouseOver.has(entity)) {
                        const entityMouseOver = mouseOver.get(entity);
                        if (over && 'id' in over) {
                            mouseOverId = over.id;
                            entityMouseOver.setTargetId(over.id);
                        } else {
                            entityMouseOver.setTargetId(null);
                        }
                    }

                    if (mouseDrag.has(entity)) {
                        const entityMouseDrag = mouseDrag.get(entity);
                        if (pointerPosition) entityMouseDrag.setMousePosition(pointerPosition?.x, pointerPosition?.y);
                        if (down && 'id' in down && unitPool.playerUnits.includes(down.id) && unit.has(down.id)) {
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
                        unit: unit.has(mouseDragId) ? unit.get(mouseDragId) : null,
                    }

                    const endComponents = {
                        animation: animation.has(mouseOverId) ? animation.get(mouseOverId) : null,
                        transform: transform.has(mouseOverId) ? transform.get(mouseOverId) : null,
                        unit: unit.has(mouseOverId) ? unit.get(mouseOverId) : null,
                    }

                    // Cleanup component set references
                    animation.remove(mouseDragId)
                    animation.remove(mouseOverId)
                    transform.remove(mouseDragId)
                    transform.remove(mouseOverId)
                    unit.remove(mouseDragId)
                    unit.remove(mouseOverId)

                    // swap components
                    if (startComponents.animation) animation.add(mouseOverId, startComponents.animation);
                    if (endComponents.animation) animation.add(mouseDragId, endComponents.animation);
                    if (startComponents.transform) transform.add(mouseOverId, startComponents.transform);
                    if (endComponents.transform) transform.add(mouseDragId, endComponents.transform);
                    if (startComponents.unit) unit.add(mouseOverId, startComponents.unit);
                    if (endComponents.unit) unit.add(mouseDragId, endComponents.unit);

                }
                return GameState.idle;
        }
    }
}