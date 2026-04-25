import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "@/types/auth";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const getInitialUser = () => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("auth_user");
    return stored ? JSON.parse(stored) : null;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            if (typeof window !== "undefined") {
                localStorage.setItem("access_token", action.payload.accessToken);
                localStorage.setItem("auth_user", JSON.stringify(action.payload.user)); // ADD THIS
            }
        },
        clearCredentials(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            if (typeof window !== "undefined") {
                localStorage.removeItem("access_token");
                localStorage.removeItem("auth_user"); // ADD THIS
            }
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;