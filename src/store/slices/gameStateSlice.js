import { createSlice } from '@reduxjs/toolkit'
import { GameState } from "../../data/enums.js";
// libraries

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState: {
        gameState: GameState.map
    },
    reducers: {
        setGameState: (state, action) => {
            state.gameState = action.payload;
        }
    }
})

// // Action creators are generated for each case reducer function
export const { setGameState } = gameStateSlice.actions
export default gameStateSlice.reducer