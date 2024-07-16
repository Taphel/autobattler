// Class imports
import Unit from "../../components/Unit.js";
import Tile from "../../components/Tile.js";

// Libraries import
import shuffleArray from "../../../libraries/shuffleArray.js";

export default class UnitPool {
    #unitData;
    #shopUnits = [];
    #playerUnits = [];
    #playerBoard = [];
    #encounterUnits = [];
    constructor(entities, components, unitData, unitCount, boardSize, sideBoardSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY, startPlayerUnits) {
        this.#unitData = unitData;
        // Generate unit pool for player rewards;
        unitData.forEach(unit => {
            for (let i = 0; i < unitCount; i++) {
                this.#shopUnits.push(new Unit(unit, 1));
            }
        })

        this.#shopUnits = shuffleArray(this.#shopUnits);

        // Allocate player unit entity IDs
        const { tile } = components;
        for (let i = 0; i < boardSize + sideBoardSize; i++) {
            const playerUnitId = entities.length;
            this.#playerUnits.push(playerUnitId);
            entities.push(playerUnitId);

            // Determine default position and scale for tile component
            const position = {
                x: i < boardSize ? playerStartX - i : sideBoardX + (i - boardSize),
                y: i < boardSize ? boardY : sideBoardY,
                z: 4
            }
            const scale = { x: -1, y: 1 }

            tile.add(playerUnitId, new Tile(position.x, position.y, scale.x, scale.y));
        }

        // Allocate player battle units entity IDs
        for (let i = 0; i < boardSize; i++) {
            const playerBoardUnitId = entities.length;
            this.#playerBoard.push(playerBoardUnitId);
            entities.push(playerBoardUnitId);

            // Determine default position and scale for tile component
            const position = {
                x: i < boardSize ? playerStartX - i : sideBoardX + (i - boardSize),
                y: i < boardSize ? boardY : sideBoardY,
                z: 4
            }
            const scale = { x: -1, y: 1 }

            tile.add(playerBoardUnitId, new Tile(position.x, position.y, scale.x, scale.y));
        }

        // Initialize player starter units
        const { unit } = components;
        for (let i = 0; i < startPlayerUnits; i++) {
            const playerUnit = this.#shopUnits.shift();
            unit.add(this.#playerUnits[i], playerUnit);
        }

        // Allocate enemy unit entity IDs
        for (let i = 0; i < boardSize; i++) {
            const encounterUnitId = entities.length;
            this.#encounterUnits.push(encounterUnitId);
            entities.push(encounterUnitId);

            // Determine default position and scale for tile component
            const position = {
                x: i + enemyStartX,
                y: boardY,
                z: 4
            }
            const scale = { x: 1, y: 1 }

            tile.add(encounterUnitId, new Tile(position.x, position.y, scale.x, scale.y));
        }

        for (let i = 0; i < 3; i++) {
            const enemyUnit = this.#shopUnits.shift();
            unit.add(this.#encounterUnits[i], enemyUnit);
        }
    }

    get shopUnits() {
        return this.#shopUnits;
    }

    get playerUnits() {
        return this.#playerUnits;
    }

    get playerBoard() {
        return this.#playerBoard;
    }

    get encounterUnits() {
        return this.#encounterUnits;
    }
}