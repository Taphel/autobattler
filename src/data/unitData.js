import { EntityFlag, SkillFlag } from "./enums.js";

const unitData = [
    {
        id: "TestAttack",
        name: "Test Attack",
        tier: 1,
        level: 0,
        uses: 5,
        range: { min: 1, max: 1 },
        effect: {
            target: {
                hits: {
                    base: 1,
                    scaling: 0
                },
                damage: {
                    base: 5,
                    scaling: 1
                },
                animation: {
                    sprite: "effects/slash",
                    frames: 9
                }
            }
        },
        flags: [SkillFlag.harm]
    }
]

export default unitData;