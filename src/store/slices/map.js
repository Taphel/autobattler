import { createSlice } from '@reduxjs/toolkit'

// libraries

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        nodes: [],
        floors: 0,
        floorWidth: 0
    },
    reducers: {
        initializeMapNodes: (state, action) => {
            const { nodes, floors, floorWidth } = action.payload
            state.nodes = nodes;
            state.floors = floors;
            state.floorWidth = floorWidth;
        },
        updateMapNodes: (state, action) => {
            state.tiles = action.payload;
        },
    }
})


// // Action creators are generated for each case reducer function
export const { nodes, setGridTiles, setEntitySprites } = cameraSlice.actions
export default cameraSlice.reducer