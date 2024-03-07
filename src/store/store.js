import { configureStore } from '@reduxjs/toolkit';
import encounterReducer from './slices/encounterSlice.js'

export default configureStore({
    reducer: {
        encounter: encounterReducer
    }
})