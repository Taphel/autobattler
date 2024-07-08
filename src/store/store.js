import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer from './slices/gameStateSlice.js';
import battleReducer from './slices/battleSlice.js'
import mapReducer from './slices/mapSlice.js';
import uiReducer from './slices/uiSlice.js';

export default configureStore({
    reducer: {
        gameState: gameStateReducer,
        battle: battleReducer,
        map: mapReducer,
        ui: uiReducer
    }
})