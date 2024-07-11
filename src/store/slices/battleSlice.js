import { createSlice } from '@reduxjs/toolkit'

// libraries

export const battleSlice = createSlice({
    name: 'battle',
    initialState: {
        tiles: [],
        entities:[],
        screenWidth: 0,
        screenHeight: 0,
        spriteSize: 0,
    },
    reducers: {
        initializeBattleTiles: (state, action) => {
            const { tiles, screenWidth, screenHeight, spriteSize } = action.payload;
            state.tiles = tiles;
            state.screenWidth = screenWidth;
            state.screenHeight = screenHeight;
            state.spriteSize = spriteSize;
        },
        setEntitySprites: (state, action) => {
            state.entities = action.payload
        },
        updateTileSize: (state, action) => {
            state.spriteSize = action.payload;
        }
    }
})


// // Action creators are generated for each case reducer function
export const { initializeBattleTiles, setEntitySprites, updateTileSize } = battleSlice.actions
export default battleSlice.reducer