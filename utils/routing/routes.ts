/**
 * Route Helper Constants
 * Centralized route definitions following R11 rules
 */

/**
 * Authentication routes
 */
export const authRoutes = {
  login: "/auth/login",
  logout: "/auth/logout",
};

/**
 * Invitation routes
 */
export const invitationRoutes = {
  validate: (token: string) => `/invite/${token}/validate`,
  setup: (token: string) => `/invite/${token}/setup`,
  expired: (token: string) => `/invite/${token}/expired`,
};

/**
 * User management routes
 */
export const userRoutes = {
  list: "/family/users",
  detail: (userId: string) => `/family/users/${userId}`,
};

/**
 * Family management routes
 */
export const familyRoutes = {
  list: "/families",
  create: "/families/create",
  detail: (familyId: string) => `/families/${familyId}`,
  edit: (familyId: string) => `/families/${familyId}/edit`,
  notAccessible: (familyId: string) => `/families/${familyId}/not-accessible`,
};

/**
 * Profile routes
 */
export const profileRoutes = {
  settings: "/profile/settings",
};

/**
 * Dashboard routes
 */
export const dashboardRoutes = {
  home: "/dashboard",
  superAdmin: "/superadmin/dashboard",
};

/**
 * Error routes
 */
export const errorRoutes = {
  forbidden: "/403",
  notFound: "/404",
  serverError: "/500",
};

