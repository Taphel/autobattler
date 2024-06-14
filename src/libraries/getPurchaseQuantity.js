export function getPurchaseQuantity(currentGold, purchaseMode, basePrice, startLevel) {
    switch(purchaseMode) {
        case 1: {
            return 1;
        }
        case 10: {
            return 10;
        }
        case 100: {
            return 100;
        }
        case "SMART": {
            const nextThousand = Math.floor((startLevel / 1000) + 1) * 1000;
            const nextHundred = Math.floor((startLevel / 100) + 1) * 100;
            const nextTen = Math.floor((startLevel / 10) + 1) * 10;
            const maxPurchases = calcMaxPurchaseableAmount(currentGold, basePrice, startLevel);

            if (maxPurchases >= (nextThousand - startLevel)) {
                return nextThousand - startLevel;
            }

            if (maxPurchases >= (nextHundred - startLevel)) {
                return nextHundred - startLevel;
            }

            if (maxPurchases >= (nextTen - startLevel)) {
                return nextTen - startLevel;
            }

            return 1;
        }
        case "MAX": {
            console.log(currentGold, purchaseMode, basePrice, startLevel);
            const maxPurchases = calcMaxPurchaseableAmount(currentGold, basePrice, startLevel);
            if (maxPurchases === 0) {
                return 1;
            } else {
                return maxPurchases;
            }
        }
    }
}