/// Classes
import System from "../System.js";
import CellularAutomata from "./Physics/CellularAutomata.js";
import PathFinder from "./Physics/PathFinder.js";
import FieldOfView from "./Physics/FieldOfView.js";
import Tile from "./Physics/Tile.js";

import Entity from "../Entity.js";

/// Components
import EntityFlags from "../components/EntityFlags.js";
import UnitStats from "../components/UnitStats.js";
import UnitSkills from "../components/UnitSkills.js";
import Transform from "../components/Transform.js";
import Vision from "../components/Vision.js";
import AI from "../components/AI.js";
import Animation from "../components/Animation.js";

/// Other files
// enums
import { TileType, EntityFlag } from "../../data/enums.js";

// data

export default class PhysicsSystem extends System {

    constructor() {
        super();
    }

    update(dungeonLevel, entities, components) {
        let battleSwitch = false;

        const { transform, entityFlags, vision } = components;

        entities.forEach(entity => {
            if (transform.has(entity) && vision.has(entity)) {
                const { x, y } = transform.get(entity).tilePosition;
                const { visionRange } = vision.get(entity);
                const fieldOfView = FieldOfView.scan({ x: x, y: y }, dungeonLevel.grid, visionRange);

                // explore tiles if they're seen by a player unit
                if (entityFlags.has(entity)) {
                    if (entityFlags.get(entity).hasFlag(EntityFlag.player)) {
                        fieldOfView.forEach(coordinates => {
                            const { x, y } = coordinates;
                            // explore tiles seen by player units
                            const tile = dungeonLevel.findTile(x, y);
                            if (!tile.isExplored) {
                                tile.explore();
                            }
                        })
                    }
                }
                // update entity field of view
                vision.get(entity).update(fieldOfView);
            }
        })
        return battleSwitch;
    }
}