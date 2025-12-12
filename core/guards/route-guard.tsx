/**
 * Route Guard Component
 * Centralized route protection for authentication and role-based access
 * Based on R11 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { UserRole } from "@/types/responses/auth.responses";
import { authRoutes } from "@/utils/routing";

interface RouteGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * RouteGuard component
 * Protects routes based on authentication and role requirements
 */
export function RouteGuard({
  children,
  roles,
  requireAuth = true,
  redirectTo,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) {
      return;
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      const redirect = redirectTo || `${authRoutes.login}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirect);
      return;
    }

    // Check role requirements
    if (roles && roles.length > 0 && user) {
      if (!roles.includes(user.role)) {
        router.push(redirectTo || "/403");
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, roles, requireAuth, router, pathname, redirectTo]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If roles are required but user doesn't have required role, don't render children
  if (roles && roles.length > 0 && user) {
    if (!roles.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}

