/**
 * Role Response Types
 * Based on API Spec: F01DEF-api_spec.md (Section F)
 */

/**
 * Permissions Object (JSON blob)
 */
export interface RolePermissions {
  [key: string]: boolean;
}

/**
 * Role Entity Response
 */
export interface RoleResponse {
  id: string;
  name: "superadmin" | "familyadmin" | "member";
  permissions: RolePermissions;
}

/**
 * Role List Items
 */
export interface RoleListItems {
  items: RoleResponse[];
}

/**
 * Role List Response
 * GET /v1/roles
 */
export interface RoleListResponse {
  data: RoleListItems;
  message: string;
}

