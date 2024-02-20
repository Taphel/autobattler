// Modules imports
import { useState, useReducer, useEffect } from 'react';

// CSS & sub components imports
import "./gameManager.css";
import CurrencyUI from "./CurrencyUI/CurrencyUI.jsx";
import BuildUI from "./BuildUI/BuildUI.jsx";
import CombatUI from "./CombatUI/CombatUI.jsx";
import MapManager from "./MapManager/MapManager.jsx";

// Static data imports
import constants from "../../data/constants.js"
import dungeonList from "../../data/dungeonData.js";
import { enemyList, bossList } from "../../data/enemyData.js"

// Gen function
function generateEnemy(dungeonId, level) {
    const enemyPool = dungeonList[dungeonId].enemies;
    const enemyId = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const enemyName = enemyList[enemyId].name;

    const generatedHp = constants.baseHP * level * Math.pow(constants.enemyLevelHpScaling, level) * (Math.random() * (constants.hpVarianceMax - constants.hpVarianceMin) + constants.hpVarianceMin);
    const generatedReward = (generatedHp / 10) * (Math.random() * (constants.rewardVarianceMax - constants.rewardVarianceMin) + constants.rewardVarianceMin);

    return {
        id: enemyId,
        name: enemyName,
        currentHp: generatedHp,
        maxHp: generatedHp,
        reward: generatedReward
    }
}

// Init functions
function initializeEncounter(level) {
    return {
        dungeonId: 0,
        dungeonName: dungeonList[0].name,
        level: level,
        enemy: generateEnemy(0, level),
        killCount: 0,
        defeated: false
    }
}
// Reducer functions
function encounterReducer (state, action) {
    switch (action.type) {
        case "damage_enemy": {
            if (action.value >= state.enemy.currentHp) {
                return {
                    ...state,
                    enemy: {
                        ...state.enemy,
                        currentHp: 0
                    },
                    defeated: true
                }
            } else {
                return {
                    ...state,
                    enemy: {
                        ...state.enemy,
                        currentHp: state.enemy.currentHp - action.value
                    }
                }
            }
        } case "generate_encounter": {
            return {
                ...state,
                enemy: generateEnemy(state.dungeonId, state.level),
                killCount: state.killCount + 1,
                defeated: false
            }
        }
    }
}

function currenciesReducer(state, action) {
    switch (action.type) {
        case "add": {
            const newState = {...state};
            newState[action.currency] = {
                current: state.gold.current + action.value,
                gained: state.gold.gained + action.value
            };
            return newState;
            };
        case "remove": {
            const newState = {...state};
            newState[action.currency] = {
                current: state.gold.current - action.value,
                gained: state.gold.gained
            };
            return newState;
        };
    }
}

export default function GameManager() {
    const [currenciesState, currenciesDispatch] = useReducer(currenciesReducer, {gold: {current: 0, gained: 0}});
    const [encounterState, encounterDispatch] = useReducer(encounterReducer, 1, initializeEncounter);

    return (
        <div className="gameManager">
            <div className="mainCol">
                <CurrencyUI props={{gold: currenciesState.gold.current}} />
                <CombatUI props={{currenciesDispatch: currenciesDispatch, encounterDispatch: encounterDispatch, encounter: encounterState}}/>
            </div>
            <div className="sideCol">
                <MapManager />
            </div>
            <div className="subCol">
                <BuildUI />
            </div>    
        </div>
    );
}