export function getUnitCurrentDamage(unit) {
    // Get the total unit upgrade multiplier
    let unitUpgradeMultiplier = 1;
    const levelBreakpoints = [25, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000];
    for (let breakpointIndex = 0; breakpointIndex < levelBreakpoints.length; breakpointIndex++) {
        const multiplierUpgrade = unit.multipliers[levelBreakpoints[breakpointIndex]];
        if (multiplierUpgrade.unlocked) {
            unitUpgradeMultiplier *= multiplierUpgrade.value;
        } else break;
    }

    // Return the unit current Damage
    return unit.baseDamage * unit.level * unitUpgradeMultiplier;
}

export function getTotalDamage(units) {
        const totalDamage = units.reduce((accumulator, currentUnit) => accumulator + getUnitCurrentDamage(currentUnit), 0);
        return totalDamage;
}