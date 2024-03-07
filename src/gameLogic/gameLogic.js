// Redux imports
import store from "../store/store.js";
import { damageEnemy, incrementKillcount, endEncounter } from "../store/slices/encounterSlice.js";

// game state imports
import { encounterState, unitsState } from "./gameState.js"

// game manager imports
import { generateEncounter } from "./managers/encounterManager.js";

// Game variables
const currencies = {
    gold: {
        gained: 0,
        current: 0
    }
};

// Systems and entities
const systems = [];
const entities = [];

let previousTickTime = 0;
function gameLoop() {
    console.log("game loop occuring !");
    const currentTickTime = performance.now();
    const deltaTime = (currentTickTime - previousTickTime) / 1000;
    console.log("deltaTime:", deltaTime);
    previousTickTime = currentTickTime;
    systems.forEach(system => system.update(deltaTime));
}

const combatSystem = {
    update(deltaTime) {
        // No combat loop if in the win/loss outcome state.
        if (!encounterState.outcome) {
            let totalDamage = 0;
            unitsState
                .filter(unit => Object.hasOwn(unit, "baseDamage"))
                .forEach(unit => {
                    // Add up all units damage
                    totalDamage += unit.baseDamage * unit.level * deltaTime
                });

                console.log("totalDamage:", totalDamage);

            // TURBO MODE ! FOR PLAYTEST PURPOSES !
            if (!encounterState.enemy.isBoss) {
                totalDamage *= 100;
            }

            // Kill Check
            if (totalDamage >= encounterState.enemy.currentHp) {
                console.log("Enemy killed.");
                // Add reward gold to currencies
                currencies.gold.gained += encounterState.enemy.reward;
                currencies.gold.current += encounterState.enemy.reward;
                // Increment killCount if needed
                if (!encounterState.enemy.isBoss && (encounterState.level === encounterState.maxLevel)) {
                    encounterState.killCount += 1;
                    store.dispatch(incrementKillcount());
                }
                
                // Set up the win outcome and launch the next encounter generation
                encounterState.outcome = "win";
                encounterState.enemy.timer = 0;
                encounterState.enemy.currentHp = 0;
                setTimeout(generateEncounter, 500);

                store.dispatch(endEncounter({outcome: "win"}));
            } else {
                // Timeout Check 
                if ((encounterState.enemy.timer) > 0 && (encounterState.enemy.timer - deltaTime <= 0)) {
                    encounterState.outcome = "loss";
                    encounterState.enemy.timer = 0;
                    setTimeout(generateEncounter, 1000);

                    store.dispatch(endEncounter({outcome: "loss"}));
                } else {
                    encounterState.enemy.currentHp -= totalDamage;
                    if (encounterState.enemy.isBoss) {
                        encounterState.enemy.timer -= deltaTime;
                    }

                    console.log("updated Timer:", encounterState.enemy.timer);
                    
                    store.dispatch(damageEnemy({currentHp: encounterState.enemy.currentHp, newTimer: encounterState.enemy.timer}));
                }
            }
        }
    }
}

setInterval(gameLoop, 100);