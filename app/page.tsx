/**
 * Root Page
 * Redirects to login if not authenticated, or to role-based dashboard if authenticated
 * Based on R11 routing rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { authRoutes } from "@/utils/routing";
import { getRoleBasedDashboardRoute } from "@/utils/routing/roleBasedRoutes";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthContext();

  useEffect(() => {
    if (isLoading) {
      return; // Still loading, wait
    }

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      router.replace(authRoutes.login);
    } else if (user) {
      // Authenticated, redirect to role-based dashboard
      const dashboardRoute = getRoleBasedDashboardRoute(user.role);
      router.replace(dashboardRoute);
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

