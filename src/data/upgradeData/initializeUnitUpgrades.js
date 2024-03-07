// Static data imports
import constants from "../constants.js";
import { getUnits } from "../unitData.js";

// export function initializeUnitUpgrades() {
//     const units = getUnits("all");
//     const levelBreakpoints = [25, 50, 100];
//     const unitUpgrades = [];

//     units.forEach((unit) => {
//         levelBreakpoints.forEach((breakpoint) => {
//             const addedUpgrade = {
//                 id: `${unit.id}LU${breakpoint}`,
//                 requirement: {
//                     type: "unit_level",
//                     id: unit.id,
//                     value: breakpoint
//                 },
//                 cost: {
//                     currency: "gold",
//                     value: Math.floor(unit.baseCost * Math.pow(constants.upgradeCostScaling, breakpoint-1) * 2)
//                 },
//                 damageMultiplier: 2
//             }

//             unitUpgrades.push(addedUpgrade);
//         })
//     })

//     return unitUpgrades;
// }