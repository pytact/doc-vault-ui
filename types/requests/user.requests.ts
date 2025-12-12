/**
 * User Request Types
 * Based on API Spec: F01ABC-api_spec.md (Section C) and F01DEF-api_spec.md (Sections D, E, F)
 */

/**
 * User Invite Request
 * POST /v1/invite/families/{family_id}/users/
 */
export interface UserInviteRequest {
  email: string;
}

/**
 * User Activate Request
 * POST /v1/invitations/activate
 */
export interface UserActivateRequest {
  invite_token: string;
  name: string;
  password: string;
}

/**
 * User Profile Update Request
 * PATCH /v1/users/me
 */
export interface UserProfileUpdateRequest {
  name: string;
}

/**
 * User Password Change Request
 * POST /v1/users/me/password/change
 */
export interface UserPasswordChangeRequest {
  current_password: string;
  new_password: string;
}

/**
 * User List Query Parameters
 * GET /v1/families/{family_id}/users
 */
export interface UserListParams {
  page?: number;
  page_size?: number;
  status?: string | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * User Role Update Request
 * PATCH /v1/roles/families/{family_id}/users/{user_id}/
 */
export interface UserRoleUpdateRequest {
  role_ids: string[];
}

/**
 * User Soft Delete Request
 * PATCH /v1/families/{family_id}/users/{user_id}/soft-delete
 * No request body required
 */
// No interface needed - empty body

