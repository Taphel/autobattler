import { createSlice } from '@reduxjs/toolkit'

// libraries

export const mapSlice = createSlice({
    name: 'map',
    initialState: {
        nodes: [],
        paths: [],
        cursors: [],
        screenWidth: 0,
        screenHeight: 0,
        xOffset: 0,
        yOffset: 0,
        spriteSize: 0
    },
    reducers: {
        initializeMapNodes: (state, action) => {
            const { nodes, screenWidth, screenHeight, paths, xOffset, yOffset, spriteSize } = action.payload
            state.nodes = nodes;
            state.paths = paths;
            state.screenWidth = screenWidth;
            state.screenHeight = screenHeight;
            state.xOffset = xOffset;
            state.yOffset = yOffset;
            state.spriteSize = spriteSize;
        },
        updateMapAlpha: (state, action) => {
            state.nodes.forEach(node => node.alpha = action.payload);
            state.paths.forEach(path => path.alpha = action.payload);
        },
        updateMapCursors: (state, action) => {
            state.cursors = action.payload;
        },
        updateNodeSize: (state, action) => {
            state.spriteSize = action.payload;
        }
    }
})


// // Action creators are generated for each case reducer function
export const { initializeMapNodes, updateMapAlpha, updateMapCursors, updateNodeSize } = mapSlice.actions
export default mapSlice.reducer