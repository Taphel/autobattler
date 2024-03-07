import constants from "../data/constants.js";

function log(value, base) {
    return (Math.log(value) / Math.log(base))
}

export const calcPrice = (basePrice, startLevel, targetLevel) => {
    const price = (basePrice * (Math.pow(constants.upgradePriceScaling, targetLevel) - Math.pow(constants.upgradePriceScaling, startLevel))) / (constants.upgradePriceScaling - 1);
    return price;
}

export const calcMaxPurchaseableAmount = (currentMoney, basePrice, startLevel) => {
    const scaling = constants.upgradePriceScaling

    const startLevelScaling = Math.pow(scaling, startLevel);
    const maxLevelPriceBonus = (currentMoney * (scaling - 1));
    const maxLevelScalingBonus = maxLevelPriceBonus / basePrice;
    const maxLevelScaling = maxLevelScalingBonus + startLevelScaling
    const maxLevel = (Math.floor(log(maxLevelScaling, scaling)));
    const maxPurchases = maxLevel - startLevel;
    return maxPurchases;
}