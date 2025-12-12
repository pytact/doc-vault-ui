/**
 * Profile Response Types
 * Based on API Spec: F01DEF-api_spec.md (Section E)
 */

import { PasswordRules } from "./common.responses";

/**
 * Profile Response Data
 * GET /v1/users/me
 * PATCH /v1/users/me
 */
export interface ProfileResponseData {
  id: string;
  email: string;
  name: string;
  status: "Active" | "PendingActivation" | "SoftDeleted";
  family_id: string | null;
  family_name: string | null;
  can_edit_profile: boolean;
  password_rules: PasswordRules;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
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

