import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './slices/cameraSlice.js'
import uiReducer from './slices/uiSlice.js';

export default configureStore({
    reducer: {
        camera: cameraReducer,
        ui: uiReducer
    }
})