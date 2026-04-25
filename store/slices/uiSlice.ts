import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    sidebarOpen: boolean;
    applyModalJobId: number | null;
}

const initialState: UiState = {
    sidebarOpen: false,
    applyModalJobId: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        openApplyModal(state, action: PayloadAction<number>) {
            state.applyModalJobId = action.payload;
        },
        closeApplyModal(state) {
            state.applyModalJobId = null;
        },
    },
});

export const { toggleSidebar, openApplyModal, closeApplyModal } = uiSlice.actions;
export default uiSlice.reducer;