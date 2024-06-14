import { createSlice } from '@reduxjs/toolkit'

// libraries

export const cameraSlice = createSlice({
    name: 'camera',
    initialState: {
        tiles: [],
        entities:[],
        cameraWidth: 0,
        cameraHeight: 0
    },
    reducers: {
        updateCameraSize: (state, action) => {
            const { width, height } = action.payload
            state.cameraWidth = width;
            state.cameraHeight = height;
        },
        setGridTiles: (state, action) => {
            state.tiles = action.payload;
        },
        setEntitySprites: (state, action) => {
            state.entities = action.payload
        },
    }
})


// // Action creators are generated for each case reducer function
export const { updateCameraSize, setGridTiles, setEntitySprites } = cameraSlice.actions
export default cameraSlice.reducer