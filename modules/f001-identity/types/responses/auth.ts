/**
 * Authentication Response Types
 * Based on API Spec: F01ABC-api_spec.md (Section A)
 */

/**
 * User Role Type
 */
export type UserRole = "superadmin" | "familyadmin" | "member";

/**
 * User Role Constants
 * Use these constants for role comparisons and checks
 */
export const UserRole = {
  SuperAdmin: "superadmin" as const,
  FamilyAdmin: "familyadmin" as const,
  Member: "member" as const,
} as const;

/**
 * User Permissions Type
 */
export interface UserPermissions {
  [key: string]: boolean;
}

/**
 * User Info in Login Response
 */
export interface LoginUserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  family_id: string | null;
  family_name: string | null;
  permissions?: UserPermissions;
}

/**
 * Login Response Data
 * POST /v1/auth/login
 */
export interface AuthLoginResponseData {
  token: string;
  expires_in: number;
  user: LoginUserInfo;
}

/**
 * Login Response
 * POST /v1/auth/login
 */
export interface AuthLoginResponse {
  data: AuthLoginResponseData;
  message: string;
}

/**
 * Logout Response Data
 * POST /v1/auth/logout
 */
export interface AuthLogoutResponseData {
  data: null;
  message: string;
}

/**
 * Logout Response
 * POST /v1/auth/logout
 */
export interface AuthLogoutResponse {
  data: null;
  message: string;
}

