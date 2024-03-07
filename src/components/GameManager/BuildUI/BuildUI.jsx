// Modules imports
import { useState } from 'react';

// CSS & subcomponents import
import "./buildUI.css";

// static data & libraries import
import { calcPrice, calcMaxPurchaseableAmount } from "../../../libraries/priceCalculation.js";
import formatNumberString from "../../../libraries/formatNumberString.js";

function getPurchaseQuantity(currentGold, purchaseMode, basePrice, startLevel) {
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

function getPurchaseableUpgrade(unit) {
    const levelBreakpoints = [25, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000];
    for (let i = 0; i < levelBreakpoints.length; i++) {
        if (unit.level >= levelBreakpoints[i]) {
            if (unit.multipliers[levelBreakpoints[i]].unlocked === false) {
                // Calculate upgrade price - 10x the price of required level
                const upgradePrice = calcPrice(unit.basePrice, levelBreakpoints[i] - 1, levelBreakpoints[i]) * 2;

                return {
                    upgradeLevel: levelBreakpoints[i],
                    upgradePrice: upgradePrice,
                    multiplier: unit.multipliers[levelBreakpoints[i]].value
                }
            }
        }
    }
    return undefined;
}

function getHighestPurchasedUpgrade(unit) {
    const levelBreakpoints = [25, 50, 100, 200, 300, 400, 500, 750, 1000, 1500, 2000];
    let highestUpgradeLevel = undefined;

    for (let i = 0; i < levelBreakpoints.length; i++) {
        if (unit.multipliers[levelBreakpoints[i]].unlocked === true) {
            highestUpgradeLevel = levelBreakpoints[i];
        } else break;
    }

    if (highestUpgradeLevel) {
        return {
            upgradeLevel: highestUpgradeLevel,
            multiplier: unit.multipliers[highestUpgradeLevel].value
        } 
    } else return undefined;
}


export default function BuildUI({ props }) {
    const [purchaseTab, setPurchaseTab] = useState("UNIT");
    const [purchaseMode, setPurchaseMode] = useState(1);

    // Event handlers
    function handlePurchaseTabButtonClick(newTab) {
        console.log(newTab);
        if ((newTab !== "UNIT") && (newTab !== "UPGRADE")) return;
        console.log("new tab is valid", newTab);
        setPurchaseTab(newTab);
    }

    function handlePurchaseModeButtonClick(event) {
        const purchaseModes = [1, 10, 100, "SMART", "MAX"];
        switch(event.button) {
            case 0: {
                // left click
                setPurchaseMode((currentValue) => {
                    const currentIndex = purchaseModes.indexOf(currentValue);
                    console.log("Current value: ", currentValue, " | Index : ", currentIndex);
                    
                    // Increment Index
                    if (currentIndex === purchaseModes.length - 1) {
                        return purchaseModes[0];
                    } else {
                        return purchaseModes[currentIndex + 1];
                    }  
                })
                break;
            }
            case 2: {
                // right click
                setPurchaseMode((currentValue) => {
                    const currentIndex = purchaseModes.indexOf(currentValue);
                    console.log("Current value: ", currentValue, " | Index : ", currentIndex);
                    
                    // Decrement Index
                    if (currentIndex === 0) {
                        return purchaseModes[purchaseModes.length - 1];
                    } else {
                        return purchaseModes[currentIndex - 1];
                    }  
                })
                break;
            }
        }
    }

    function handleLevelButtonClick(unitTier, purchaseQuantity, purchaseCost) {
        if (props.gold >= purchaseCost) {
            props.currenciesDispatch({type: "remove", currency: "gold", value: purchaseCost});
            props.upgradesDispatch({type: "level_up", unitTier: unitTier, value: purchaseQuantity});
        }
    }

    function handleUpgradeButtonClick(unitTier, upgradeLevel, upgradeCost) {
        if (props.gold >= upgradeCost) {
            props.currenciesDispatch({type: "remove", currency: "gold", value: upgradeCost});
            props.upgradesDispatch({type: "unlock_upgrade", unitTier: unitTier, value: upgradeLevel});
        }
    }
    
    // Compute Render data
    let renderData = undefined;
    switch (purchaseTab) {
        case "UNIT": {
            // Generate data for each unit tier block and purchase button
            const purchaseListItems = [];
            for (let i = 0; i < 10; i++) {
                // Retrieve unit data
                const unitData = props.units[i];
                // Calculate type, quantity and cost of level up
                let purchaseQuantity = getPurchaseQuantity(props.gold, purchaseMode, unitData.basePrice, unitData.level);
                let purchaseCost = calcPrice(unitData.basePrice, unitData.level, unitData.level + purchaseQuantity);
                // Set up button styling classes and onClick event listener
                const canPurchase = props.gold >= purchaseCost;
                let blockClass = "unitBlock";
                let buttonClass = undefined;
                let onClickCallback = undefined;

                if (canPurchase) {
                    buttonClass = "purchaseButton levelButton active"
                    onClickCallback = () => { handleLevelButtonClick(i, purchaseQuantity, purchaseCost) };
                } else {
                    if (unitData.level === 0) {
                        blockClass = "unitBlock locked";
                    }
                    buttonClass = "purchaseButton levelButton inactive"
                }

                purchaseListItems.push(
                    <div className={blockClass} key={`T${i}`}>
                            <div className="unitIcon" style={{backgroundImage: `url("/sprites/player.png")`}}></div>
                            <div className="unitData">
                                <h4>{unitData.level > 0 && formatNumberString(unitData.level)} {unitData.name}</h4>
                                {unitData.level > 0 ?
                                    <p>{formatNumberString(unitData.currentDamage)} DPS ({formatNumberString(Math.round(unitData.currentDamage / props.totalDamage * 100))}%)</p> :
                                    <p>{formatNumberString(unitData.baseDamage)} DPS</p>
                                }
                            </div>
                            <button className={buttonClass} onClick={onClickCallback}>
                                <h4>{formatNumberString(purchaseQuantity)}</h4>                               
                                <p>{formatNumberString(purchaseCost)}</p>
                            </button>
                    </div>
                )
            }

            renderData = {
                headerText: "Units",
                listContainerClass: "unitList",
                purchaseListItems: purchaseListItems
            }
            break;
        }
        case "UPGRADE": {
            // Generate data for each unit tier upgrades
            const purchaseListItems = [];
            for (let i = 0; i < 10; i++) {
                // Retrieve unit data
                const unitData = props.units[i];
                // Retrieve next unpurchased upgrade
                const upgradeData = getPurchaseableUpgrade(unitData);

                if (upgradeData) {
                    const { upgradeLevel, upgradePrice, multiplier } = upgradeData;
                    const canPurchase = props.gold >= upgradePrice;
                    let buttonClass = undefined;
                    let onClickCallback = undefined;

                    if (canPurchase) {
                        buttonClass = "purchaseButton upgradeButton active"
                        onClickCallback = () => { handleUpgradeButtonClick(i, upgradeLevel, upgradePrice) };
                    } else {
                        buttonClass = "purchaseButton upgradeButton inactive"
                    }

                    purchaseListItems.push(
                        <button className={buttonClass} onClick={onClickCallback} key={`T${i}U${upgradeLevel}`}>
                            <h4>{`T${i+1} x${formatNumberString(multiplier)}`}</h4>                               
                            <p>{formatNumberString(upgradePrice)}</p>
                        </button>
                    )
                }  
            }

            // Add already bought upgrades
            for (let i = 0; i < 10; i++) {
                // Retrieve unit data
                const unitData = props.units[i];
                const boughtUpgradeData = getHighestPurchasedUpgrade(unitData);

                if (boughtUpgradeData) {
                    const { multiplier, upgradeLevel } = boughtUpgradeData;

                    purchaseListItems.push(
                        <button className="purchaseButton upgradeButton purchased" key={`T${i}U${upgradeLevel}`}>
                            <h4>{`T${i+1} x${formatNumberString(multiplier)}`}</h4>   
                            <p className="purchased">{upgradeLevel} ✔</p>                            
                        </button>
                    )
                }
            }

            renderData = {
                headerText: "Upgrades",
                listContainerClass: "upgradeList",
                purchaseListItems: purchaseListItems
            }
            break;
        }
    }

    return (
        <div className="component buildUI">
            <aside>
                <button id="unitTabButton"className="buildTabButton" onClick={() => handlePurchaseTabButtonClick("UNIT")} style={{backgroundImage: `url("/icons/buildUI/units.png")`}}></button>
                <button id="upgradeTabButton" className="buildTabButton" onClick={() => handlePurchaseTabButtonClick("UPGRADE")} style={{backgroundImage: `url("/icons/buildUI/upgrades.png")`}}></button>
            </aside>
            <div className="purchaseTab">
                <header>
                    <h3>{renderData.headerText}</h3>
                    {purchaseTab === "UNIT" && <button className="purchaseModeButton" onPointerUp={handlePurchaseModeButtonClick}>{purchaseMode}</button>}
                </header>
                <div className={renderData.listContainerClass}>
                    {renderData.purchaseListItems.map((item) => {
                        return item
                    })}
                </div>
            </div>
        </div>
    )
}