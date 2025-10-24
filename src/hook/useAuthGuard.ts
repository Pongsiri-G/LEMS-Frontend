"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../store";
// import { useAppSelector } from "@/hooks/useAppSelector";
import { authSelector, logout, setCredentials } from "../feature/authSlice";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useHandleRefreshToken } from "../services/authService/handlers";

type Jwt = { exp: number;[k: string]: any };

export default function useAuthGuard(tryRefresh = true) {
    const dispatch = useAppDispatch();
    const { accessToken, expiresAt, user } = useSelector(authSelector);

    useEffect(() => {
        // no token -> nothing to do
        if (!accessToken || !expiresAt) return;

        const now = Date.now();
        console.log(now)

        if (expiresAt <= now) {
            if (tryRefresh) attemptRefresh();
            else dispatch(logout());
            return;
        }

        // proactive refresh ~30s before expiry
        const msLeft = expiresAt - now;
        const id = setTimeout(() => (tryRefresh ? attemptRefresh() : dispatch(logout())), Math.max(msLeft - 30_000, 0));
        return () => clearTimeout(id);
    }, [accessToken, expiresAt, dispatch, tryRefresh, user]);

    const attemptRefresh = async () => {
        try {
            const { user, accessToken, expiresAt } = await useHandleRefreshToken()
            console.log(user)
            dispatch(setCredentials({ user, accessToken, expiresAt }));
        } catch {
            dispatch(logout());
        }
    };
}
