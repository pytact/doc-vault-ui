/**
 * Profile Response Types
 * Based on API Spec: F01DEF-api_spec.md (Section E)
 */

import { PasswordRules } from "@/types/responses/common";
import { UserRole } from "./auth";

/**
 * User Permissions Type
 */
export interface UserPermissions {
  [key: string]: boolean;
}

/**
 * Role Object from API
 */
export interface RoleObject {
  id: string;
  name: UserRole;
  permissions: UserPermissions;
}

/**
 * Family Object from API (can be null for SuperAdmin)
 */
export interface FamilyObject {
  id: string;
  name: string;
}

/**
 * Profile Response Data
 * GET /v1/users/me
 * PATCH /v1/users/me
 * 
 * Note: Actual API returns role as object and family as object or null
 */
export interface ProfileResponseData {
  id: string;
  email: string;
  name: string;
  status: "Active" | "PendingActivation" | "SoftDeleted";
  family: FamilyObject | null; // API returns family object or null
  role: RoleObject; // API returns role as object with id, name, and permissions
  activated_at: string | null;
  invite_sent_at: string | null;
  invite_expire_at: string | null;
  invited_by: string | null;
  is_del: boolean;
  password_rules: PasswordRules;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  updated_by: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

/**
 * Profile Get Response
 * GET /v1/users/me
 */
export interface ProfileGetResponse {
  data: ProfileResponseData;
  message: string;
}

/**
 * Profile Update Response
 * PATCH /v1/users/me
 */
export interface ProfileUpdateResponse {
  data: ProfileResponseData;
  message: string;
}

/**
 * Password Change Response Data
 * POST /v1/users/me/password/change
 */
export interface PasswordChangeResponseData {
  data: null;
  message: string;
}

/**
 * Password Change Response
 * POST /v1/users/me/password/change
 */
export interface PasswordChangeResponse {
  data: null;
  message: string;
}

