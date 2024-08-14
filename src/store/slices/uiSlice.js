import { createSlice } from '@reduxjs/toolkit'

// libraries

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        unitOverlays: []
    },
    reducers: {
        updateUnitOverlays (state, action) {
            this.state = action.payload;
        }
    }
})


// // Action creators are generated for each case reducer function
export const { updateUnitOverlays } = uiSlice.actions
export default uiSlice.reducer