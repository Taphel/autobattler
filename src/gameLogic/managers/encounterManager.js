// Redux imports
import store from "../../store/store.js";
import { updateEncounter } from "../../store/slices/encounterSlice.js";

// Static data imports
import constants from "../../data/constants.js"
import { dungeonList } from "../../data/dungeonData.js";
import { enemyList, bossList } from "../../data/enemyData.js"

// State import
import { encounterState } from "../gameState.js";

export function generateEnemy(dungeonId, level, maxLevel, enemyRoll, hpVariance) {
    // Determine if next level is a boss, and set up timer if it is
    const isBoss = (level / 10 === Math.floor(level / 10)) && level === maxLevel;
    const timer = isBoss ? 30 : 0;

    // Pull the enemy name from static data
    const enemyPool = isBoss ? dungeonList[dungeonId].bosses : dungeonList[dungeonId].enemies;
    const enemyId = enemyPool[Math.floor(enemyRoll * enemyPool.length)];
    const enemyName = isBoss ? bossList[enemyId].name : enemyList[enemyId].name;

    // Generate the enemy hp and reward
    const bossHpMultiplier = isBoss ? 10 : 1;
    const generatedHp = Math.round(constants.baseHP * level * Math.pow(constants.enemyLevelHpScaling, level - 1) * bossHpMultiplier * hpVariance);
    const generatedReward = constants.baseReward + generatedHp / 15;

    return {
        isBoss: isBoss,
        id: enemyId,
        enemyName: enemyName,
        currentHp: generatedHp,
        maxHp: generatedHp,
        timer: timer,
        reward: generatedReward
    }
}

export function initializeEncounter() {
    return {
        dungeonId: 0,
        dungeonName: dungeonList[0].name,
        level: 1,
        maxLevel: 10,
        queuedLevelChange: null,
        killCount: 0,
        enemy: generateEnemy(0, 1, 1, 0, 1),
        outcome: undefined
    }
}

export function generateEncounter(direction = null) {
    switch (encounterState.outcome) {
        case "win": {
            // Advance to next level and reset killCount if needed
            if ((encounterState.killCount >= 10) || encounterState.enemy.isBoss) {
                encounterState.maxLevel ++;
                if (encounterState.queuedLevelChange === "previous") {
                    encounterState.level --;
                } else {
                    // PLAYTEST PURPOSES - REMOVE AFTER ADDING AUTOADVANCE
                    encounterState.level ++;
                }
                encounterState.killCount = 0;
            } else {
                switch (encounterState.queuedLevelChange) {
                    case "previous": {
                        encounterState.level --;
                        break;
                    }
                    case "next": {
                        encounterState.level ++;
                        break;
                    }
                }
            }
            break;
        }
        case "loss": {
            // Go back to the previous level
            console.log("loss");
            encounterState.level --;
            break;
        }
        case undefined: {
            switch (direction) {
                case "previous": {
                    encounterState.level --;
                    break;
                }
                case "next": {
                    encounterState.level ++;
                    break;
                }
            }
            break;
        }
    }

    // Reset encounterState outcome & queuedLevelChange
    encounterState.queuedLevelChange = null;
    encounterState.outcome = undefined;

    // Generate new enemy
    const enemyRoll = Math.random();
    const hpVariance = Math.random() * (constants.hpVarianceMax - constants.hpVarianceMin) + constants.hpVarianceMin;
    encounterState.enemy = generateEnemy(encounterState.dungeonId, encounterState.level, encounterState.maxLevel, enemyRoll, hpVariance);
    
    // Dispatch the updated data to the encounter store
    const updateAction = {
        ...pickProperties(encounterState, "dungeonName", "level", "maxLevel", "killCount", "outcome"),
        ...pickProperties(encounterState.enemy, "isBoss", "enemyName", "currentHp", "maxHp", "timer")
    }
    store.dispatch(updateEncounter(updateAction));
}

export function changeEncounterLevel(direction) {
    switch (direction) {
        case "previous": {
            if (encounterState.level > 1) {
                if (encounterState.outcome) {
                    encounterState.queuedLevelChange = direction;
                } else {
                    generateEncounter("previous");
                }   
            }
            break;
        }
        case "next": {
            if (encounterState.level < encounterState.maxLevel) {
                if (encounterState.outcome) {
                    encounterState.queuedLevelChange = direction;
                } else {
                    generateEncounter("next");
                }  
            }
            break;
        }
    }
}