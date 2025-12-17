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
  listAll: "/superadmin/users", // SuperAdmin view all users
  listForFamily: (familyId: string) => `/families/${familyId}/users`,
  detail: (userId: string) => `/family/users/${userId}`,
  detailForFamily: (familyId: string, userId: string) => `/families/${familyId}/users/${userId}`,
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
  settings: "/settings/profile",
};

/**
 * Dashboard routes
 */
export const dashboardRoutes = {
  home: "/dashboard",
  superAdmin: "/superadmin/dashboard",
};

/**
 * Taxonomy (Categories & Subcategories) routes
 * F-002: Read-only taxonomy routes
 * All authenticated users can view taxonomy
 */
export const taxonomyRoutes = {
  list: "/categories",
  create: "/categories/create",
  detail: (categoryId: string) => `/categories/${categoryId}`,
  edit: (categoryId: string) => `/categories/${categoryId}/edit`,
};

/**
 * Document management routes
 * F-003: Document management routes
 * F-004: Document sharing routes
 */
export const documentRoutes = {
  list: "/documents",
  upload: "/documents/upload",
  detail: (documentId: string) => `/documents/${documentId}`,
  edit: (documentId: string) => `/documents/${documentId}/edit`,
  preview: (documentId: string) => `/documents/${documentId}/preview`,
  sharing: (documentId: string) => `/documents/${documentId}/sharing`,
  notAccessible: (documentId: string) => `/documents/${documentId}/not-accessible`,
};

/**
 * Notification routes
 * F-005: Expiry Notification System routes
 * Access: Owner (Member) and FamilyAdmin only
 */
export const notificationRoutes = {
  list: "/notifications",
  detail: (notificationId: string) => `/notifications/${notificationId}`,
  // Note: Notifications are auto-generated, so no create/edit routes
};

/**
 * Error routes
 */
export const errorRoutes = {
  forbidden: "/403",
  notFound: "/404",
  serverError: "/500",
};

