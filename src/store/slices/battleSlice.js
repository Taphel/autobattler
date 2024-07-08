import { createSlice } from '@reduxjs/toolkit'

// libraries

export const battleSlice = createSlice({
    name: 'battle',
    initialState: {
        tiles: [],
        entities:[],
        screenWidth: 0,
        screenHeight: 0,
        xOffset: 0,
        yOffset: 0,
        spriteSize: 0,
    },
    reducers: {
        initializeBattleTiles: (state, action) => {
            const { tiles, screenWidth, screenHeight, xOffset, yOffset, spriteSize } = action.payload;

            state.tiles = tiles;
            state.screenWidth = screenWidth;
            state.screenHeight = screenHeight;
            state.xOffset = xOffset,
            state.yOffset = yOffset,
            state.spriteSize = spriteSize;
        },
        setEntitySprites: (state, action) => {
            state.entities = action.payload
        }
    }
})


// // Action creators are generated for each case reducer function
export const { initializeBattleTiles, setEntitySprites } = battleSlice.actions
export default battleSlice.reducer