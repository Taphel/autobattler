import { AbilityTarget, AbilityCost, AbilityEffect } from "./enums.js";

const unitData = [
    {
        id: "TestUnit",
        name: "Fabrice",
        sprite: { path: "orc", frames: 2, speed: 240 },
        tier: 1,
        attack: 1,
        hp: 3,
        effects: [],
        ability: {
            cost: { type: AbilityCost.rage, max: 1 },
            target: { faction: AbilityTarget.ally, scope: AbilityTarget.self },
            hits: { base: 0, flat: 1, cast: 0 },
            effect: {
                type: AbilityEffect.attackBonus,
                base: 1,
                castScaling: 0,
                attackScaling: 0,
                hpScaling: 0
            }
        }
    },
]
export default unitData;