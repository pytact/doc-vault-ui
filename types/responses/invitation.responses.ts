/**
 * Invitation Response Types
 * Based on API Spec: F01DEF-api_spec.md (Section D)
 */

import { PasswordRules } from "./common.responses";

/**
 * Invitation Create Response Data
 * POST /v1/invite/families/{family_id}/users/
 */
export interface InvitationCreateResponseData {
  id: string;
  email: string;
  family_id: string;
  status: "PendingActivation";
  invite_token: string;
  invite_sent_at: string;
  invite_expire_at: string;
  invited_by: string;
  created_at: string;
}

/**
 * Invitation Create Response
 * POST /v1/invite/families/{family_id}/users/
 */
export interface InvitationCreateResponse {
  data: InvitationCreateResponseData;
  message: string;
}

/**
 * Invitation Validation Response Data (Valid Token)
 * GET /v1/invitations/validate
 */
export interface InvitationValidationResponseData {
  is_token_valid: boolean;
  is_token_expired: boolean;
  redirect_target: "account_setup" | "invite_expired";
  user_id: string | null;
  email: string | null;
  family_id: string | null;
  status: string | null;
  invite_expire_at: string | null;
  password_rules: PasswordRules | null;
  expired_reason?: string | null;
}

/**
 * Invitation Validation Response
 * GET /v1/invitations/validate
 */
export interface InvitationValidationResponse {
  data: InvitationValidationResponseData;
  message: string;
}

/**
 * User Info in Activation Response
 */
export interface ActivationUserInfo {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "familyadmin" | "member";
  family_id: string;
  family_name: string;
}

/**
 * Invitation Activate Response Data
 * POST /v1/invitations/activate
 */
export interface InvitationActivateResponseData {
  token: string;
  expires_in: number;
  user: ActivationUserInfo;
  password_rules: PasswordRules;
}

/**
 * Invitation Activate Response
 * POST /v1/invitations/activate
 */
export interface InvitationActivateResponse {
  data: InvitationActivateResponseData;
  message: string;
}

