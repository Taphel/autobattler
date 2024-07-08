// Class imports
import System from "../System.js";

// Components import

// data import
import { GameState, UnitFaction, AbilityCost, AbilityTarget, AbilityEffect } from "../../data/enums.js";
import Unit from "../components/Unit.js";

export default class GameSystem extends System {
    #playerEntities = [];
    #enemyEntities = [];

    constructor() {
        super();
    }

    update(gameState, dungeonLevel, unitPool, pointerInput, entities, components) {
        let newState = gameState;
        const { over, down, position } = pointerInput;
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

                return GameState.idle;
        }
    }
}