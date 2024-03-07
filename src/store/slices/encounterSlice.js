import { createSlice } from '@reduxjs/toolkit'
import { initializeEncounter } from '../../gameLogic/managers/encounterManager.js';
import { pickProperties } from '../../libraries/pickProperties.js';

const initialEncounter = initializeEncounter();
const initialState = {
    ...pickProperties(initialEncounter, "dungeonName", "level", "maxLevel", "killCount", "outcome"),
    ...pickProperties(initialEncounter.enemy, "isBoss", "enemyName", "currentHp", "maxHp", "timer")
}

export const encounterSlice = createSlice({
    name: 'encounter',
    initialState: initialState,
    reducers: {
        damageEnemy: (state, action) => {
            state.currentHp = action.payload.currentHp;
            state.timer = action.payload.newTimer;
        },
        incrementKillcount: state => {
            state.killCount += 1;
        },
        endEncounter: (state, action) => {
            state.outcome = action.payload.outcome;
            if (action.payload.outcome === "win") {
                state.currentHp = 0;
            }
            state.timer = 0;
        },
        updateEncounter: (state, action) => {
            for (const property in state) {
                state[property] = action.payload[property];
            }
        },
    }
})

// Action creators are generated for each case reducer function
export const { damageEnemy, incrementKillcount, endEncounter, updateEncounter } = encounterSlice.actions

export default encounterSlice.reducer