"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authSelector } from "../feature/authSlice"
import { useSelector } from "react-redux";

export function useRoleGuard(allowedRoles?: string[]) {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector(authSelector);
    const [canRender, setCanRender] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!user || allowedRoles && !allowedRoles.includes(user.userRole)) {
            router.push("/403"); // Forbidden page
        }

        setCanRender(true)
    }, [isAuthenticated, user, router, allowedRoles]);

    return canRender;
}
