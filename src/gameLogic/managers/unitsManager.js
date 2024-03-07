// Static data import
import { baseUnits, fighterUnits } from "../../data/unitData.js";

export function initializeUnits() {
    const units = [];

    baseUnits.forEach(unit => units.push({
        ...unit,
        level: 0
    }))

    return units;
}