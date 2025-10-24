import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../types";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    expiresAt: number | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null, 
    isAuthenticated: false,
    expiresAt: null,
};

interface AuthPalLoadAction {
    user?: User;
    accessToken?: string;
    expiresAt?: number;
}

// Load from localStorage (if exists)
if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("user");
    if (storedAuth) Object.assign(initialState, JSON.parse(storedAuth));
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<AuthPalLoadAction>) {
            state.user = action.payload.user ?? null
            state.accessToken = action.payload.accessToken ?? "";
            state.expiresAt = action.payload.expiresAt!;
            state.isAuthenticated = true;
        },
        setUser(state, action: PayloadAction<AuthPalLoadAction>) {
            state.user = action.payload.user!
        },
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.expiresAt = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export const authSelector = (s: { auth: AuthState }) => s.auth
export default authSlice.reducer;
