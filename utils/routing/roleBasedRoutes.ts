/**
 * Role-Based Route Helpers
 * Returns appropriate routes based on user role
 * Based on R11 routing rules
 */

import { UserRole } from "@/types/responses/auth.responses";
import { dashboardRoutes } from "./routes";

/**
 * Get role-based dashboard route
 * @param role - User role
 * @returns Dashboard route for the role
 */
export function getRoleBasedDashboardRoute(
  role: UserRole | "superadmin" | "familyadmin" | "member"
): string {
  switch (role) {
    case "superadmin":
      return "/superadmin/dashboard";
    case "familyadmin":
      return "/dashboard";
    case "member":
      return "/dashboard";
    default:
      return dashboardRoutes.home;
  }
}

/**
 * Get role-based home route (used after login)
 * @param role - User role
 * @returns Home route for the role
 */
export function getRoleBasedHomeRoute(
  role: UserRole | "superadmin" | "familyadmin" | "member"
): string {
  return getRoleBasedDashboardRoute(role);
}

