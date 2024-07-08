// Class imports
import Unit from "../../components/Unit.js";
import { UnitFaction } from "../../../data/enums.js";

// Libraries import
import shuffleArray from "../../../libraries/shuffleArray.js";

export default class UnitPool {
    #boardSize = 1;
    #sideBoardSize = 1;
    #shopUnits = [];
    #playerUnits = [];
    #enemyUnits = [];
    constructor(entities, components, unitData, unitCount, boardSize, sideBoardSize, startPlayerUnits) {
        this.#boardSize = boardSize;
        this.#sideBoardSize = sideBoardSize;
        // Generate unit pool for player rewards;
        unitData.forEach(unit => {
            for (let i = 0; i < unitCount; i++) {
                this.#shopUnits.push(new Unit(unit, 1));
            }
        })

        this.#shopUnits = shuffleArray(this.#shopUnits);

        // Allocate player unit entity IDs
        for (let i = 0; i < boardSize + sideBoardSize; i++) {
            const playerUnitId = entities.length;
            this.#playerUnits.push(playerUnitId);
            entities.push(playerUnitId);
        }

        // Initialize player starter units
        const { unit } = components;
        for (let i = 0; i < startPlayerUnits; i++) {
            const playerUnit = this.#shopUnits.shift();
            unit.add(this.#playerUnits[i], playerUnit);
        }

        // Allocate enemy unit entity IDs
        for (let i = 0; i < boardSize; i++) {
            const enemyUnitId = entities.length;
            this.#enemyUnits.push(enemyUnitId);
            entities.push(enemyUnitId);
        }

        for (let i = 0; i < 3; i++) {
            const enemyUnit = this.#shopUnits.shift();
            unit.add(this.#enemyUnits[i], enemyUnit);
        }
    }

    get shopUnits() {
        return this.#shopUnits;
    }

    get playerUnits() {
        return this.#playerUnits;
    }

    get enemyUnits() {
        return this.#enemyUnits;
    }

    get boardSize() {
        return this.#boardSize;
    }

    get sideBoardSize() {
        return this.#sideBoardSize;
    }
}