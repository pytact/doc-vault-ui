/**
 * User Request Types
 * Based on API Spec: F01ABC-api_spec.md (Section C) and F01DEF-api_spec.md (Sections D, E, F)
 */

/**
 * User Invite Request
 * POST /v1/invite
 */
export interface UserInviteRequest {
  email: string;
  family_id: string;
  role_id: string;
  frontend_url: string; // Frontend URL for invitation email link (backend will append /invite/{token}/validate)
}

/**
 * User Activate Request
 * POST /v1/invitation/activate/{token}
 */
export interface UserActivateRequest {
  token: string;
  name: string;
  password: string;
  frontend_url?: string; // Optional frontend URL for backend
}

/**
 * User Profile Update Request
 * PATCH /v1/users/{user_id}
 * ETag is sent in the If-Match header, not in payload
 */
export interface UserProfileUpdateRequest {
  user_id: string;
  name: string;
  password?: string; // Optional - only if changing password
  current_password?: string; // Required if changing password
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
 * ETag is passed in the If-Match header
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

