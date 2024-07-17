/// Classes
import System from "../System.js";
import DungeonLevel from "./Generation/DungeonLevel.js";
import UnitPool from "./Generation/UnitPool.js";

/// Components
import Unit from "../components/Unit.js";

// libraries
import shuffleArray from "../../libraries/shuffleArray.js";

export default class GenerationSystem extends System {
    constructor() {
        super();
    }

    generateLevel(floors, floorWidth, pathCount, tier) {
        return new DungeonLevel(floors, floorWidth, pathCount, tier);
    }
    
    generateUnitPool(entities, components, unitData, unitCount, boardSize, sideBoardSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY, startPlayerUnits) {
        return new UnitPool(entities, components, unitData, unitCount, boardSize, sideBoardSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY, startPlayerUnits);
    }
}