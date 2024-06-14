import { createSlice } from '@reduxjs/toolkit'

// libraries

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedEntity: null
    },
    reducers: {
        setSelectedEntity: (state, action) => {
            state.selectedEntity = action.payload;
        }
    }
})


// // Action creators are generated for each case reducer function
export const { setSelectedEntity } = uiSlice.actions
export default uiSlice.reducer