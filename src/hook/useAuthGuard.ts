"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { authSelector, logout, setCredentials, setUser } from "../feature/authSlice";
import { useSelector } from "react-redux";
import { useHandleRefreshToken } from "../services/authService/handlers";
import { useHandleGetMe } from "../services/userService/handlers";

export default function useAuthGuard(tryRefresh = true) {
    const dispatch = useAppDispatch();
    const { accessToken, expiresAt, user } = useSelector(authSelector);
    const handleRefreshToken = useHandleRefreshToken();
    // const handleGetMe = useHandleGetMe()

    useEffect(() => {
        // no token -> nothing to do
        if (!accessToken || !expiresAt) return;

        getUser();

        const now = Date.now();

        if (expiresAt <= now) {
            if (tryRefresh) attemptRefresh();
            else dispatch(logout());
            return;
        }

        // proactive refresh ~30s before expiry
        const msLeft = expiresAt - now;
        const id = setTimeout(() => (tryRefresh ? attemptRefresh() : dispatch(logout())), Math.max(msLeft - 30_000, 0));
        return () => clearTimeout(id);
    }, [accessToken, expiresAt, dispatch, tryRefresh]);

    const attemptRefresh = async () => {
        try {
            const { user, accessToken, expiresAt } = await handleRefreshToken
            
            dispatch(setCredentials({ user, accessToken, expiresAt }));
        } catch {
            dispatch(logout());
        }
    };

    const getUser = async () => {
        const result = await useHandleGetMe()
        const { user: newUser } = result ?? {}
        if (!newUser || (user && user?.userRole !== newUser.userRole)) {
            dispatch(logout())
            return;
        }
    }
}
