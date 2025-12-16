/**
 * Logout Redirect Component
 * SCR_LOGOUT_REDIRECT - Handles logout and redirect
 * Based on R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "../hooks/useAuth";
import { useAuthContext } from "@/contexts/auth.context";
import { InviteActivationValidate } from "./InviteActivationValidate";
import { authRoutes } from "@/utils/routing";

/**
 * Logout redirect component
 * Handles logout and redirects to login
 */
export function LogoutRedirect() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const logoutMutation = useLogout();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Use replace to avoid adding redirect parameter, and use window.location for hard redirect
        if (typeof window !== "undefined") {
          window.location.href = authRoutes.login;
        } else {
          router.replace(authRoutes.login);
        }
      } catch (error) {
        // Even if logout fails, redirect to login without redirect parameter
        if (typeof window !== "undefined") {
          window.location.href = authRoutes.login;
        } else {
          router.replace(authRoutes.login);
        }
      }
    };

    performLogout();
  }, [logout, router]);

  return <InviteActivationValidate />;
}

