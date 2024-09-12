// Class imports
import UnitInfo from "../../components/UnitInfo.js";
import UnitStats from "../../components/UnitStats.js";
import UnitSkill from "../../components/UnitSkill.js";
import Tile from "../../components/Tile.js";

// Libraries import
import shuffleArray from "../../../libraries/shuffleArray.js";

// Enums import
import { SpriteLayer } from "../../../data/enums.js";

export default class UnitPool {
    #unitData;
    #shopUnits = [];
    #playerUnits = [];
    #encounterUnits = [];
    constructor(entities, components, unitData, unitCount, boardSize, sideBoardSize, playerStartX, enemyStartX, boardY, sideBoardX, sideBoardY, startPlayerUnits) {
        this.#unitData = unitData;
        // Generate unitInfo pool for player rewards;
        unitData.forEach(unit => {
            for (let i = 0; i < unitCount; i++) {
                this.#shopUnits.push(unit);
            }
        })

        this.#shopUnits = shuffleArray(this.#shopUnits);

        // Allocate player unitInfo entity IDs
        const { tile } = components;
        for (let i = 0; i < boardSize + sideBoardSize; i++) {
            const playerUnitId = entities.length;
            this.#playerUnits.push(playerUnitId);
            entities.push(playerUnitId);

            // Determine default position and scale for tile component
            const position = {
                x: i < boardSize ? playerStartX - i : sideBoardX + (i - boardSize),
                y: i < boardSize ? boardY : sideBoardY,
                z: SpriteLayer.unit
            }
            const scale = { x: -1, y: 1 };
            const speed = 0.015;

            tile.add(playerUnitId, new Tile(position.x, position.y, position.z, scale.x, scale.y, speed, i));
        }

        // Initialize player starter units
        const { unitInfo, unitStats, unitSkill } = components;
        for (let i = 0; i < startPlayerUnits; i++) {
            const unitData = this.#shopUnits.shift();
            const unitComponents = {
                info: new UnitInfo(unitData),
                stats: new UnitStats(unitData),
                skill: new UnitSkill(unitData)
            }

            unitInfo.add(this.#playerUnits[i], unitComponents.info);
            unitStats.add(this.#playerUnits[i], unitComponents.stats);
            unitSkill.add(this.#playerUnits[i], unitComponents.skill);
        }

        // Allocate enemy unitInfo entity IDs
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
            const speed = 0.015;

            tile.add(encounterUnitId, new Tile(position.x, position.y, position.z, scale.x, scale.y, speed, i));
        }

        for (let i = 0; i < 3; i++) {
            const unitData = this.#shopUnits.shift();
            const unitComponents = {
                info: new UnitInfo(unitData),
                stats: new UnitStats(unitData),
                skill: new UnitSkill(unitData)
            }
            
            unitInfo.add(this.#encounterUnits[i], unitComponents.info);
            unitStats.add(this.#encounterUnits[i], unitComponents.stats);
            unitSkill.add(this.#encounterUnits[i], unitComponents.skill);
        }
    }

    get shopUnits() {
        return this.#shopUnits;
    }

    get playerUnits() {
        return this.#playerUnits;
    }

    get encounterUnits() {
        return this.#encounterUnits;
    }

    sortUnits(components) {
        const { tile } = components
        this.#playerUnits.sort((a, b) => {
            const aTile = tile.get(a);
            const bTile = tile.get(b);
            return aTile.value.index - bTile.value.index;
        })

        this.#encounterUnits.sort((a, b) => {
            const aTile = tile.get(a);
            const bTile = tile.get(b);
            return aTile.value.index - bTile.value.index;
        })
    }
}