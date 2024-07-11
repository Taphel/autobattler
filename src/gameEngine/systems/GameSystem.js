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
        const { over, down, up, position } = pointerInput;
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
                if (over && 'id' in over && down && 'id' in down && up) {
                    // Check both units are player units
                    if (unitPool.playerUnits.includes(down.id) && unitPool.playerUnits.includes(over.id)) {
                        const { animation, transform, unit } = components;
                        const startId = down.id;
                        const endId = over.id;

                        const startComponents = {
                            animation: animation.has(startId) ? animation.get(startId) : null,
                            transform: transform.has(startId) ? transform.get(startId) : null,
                            unit: unit.has(startId) ? unit.get(startId) : null,
                        }

                        const endComponents = {
                            animation: animation.has(endId) ? animation.get(endId) : null,
                            transform: transform.has(endId) ? transform.get(endId) : null,
                            unit: unit.has(endId) ? unit.get(endId) : null,
                        }

                        // Cleanup component set references
                        animation.remove(startId)
                        animation.remove(endId)
                        transform.remove(startId)
                        transform.remove(endId)
                        unit.remove(startId)
                        unit.remove(endId)

                        // swap components
                        if (startComponents.animation) animation.add(endId, startComponents.animation);
                        if (endComponents.animation) animation.add(startId, endComponents.animation);
                        if (startComponents.transform) transform.add(endId, startComponents.transform);
                        if (endComponents.transform) transform.add(startId, endComponents.transform);
                        if (startComponents.unit) unit.add(endId, startComponents.unit);
                        if (endComponents.unit) unit.add(startId, endComponents.unit);
                    }
                }
                return GameState.idle;
        }
    }
}