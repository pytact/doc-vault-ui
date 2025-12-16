/**
 * User Response Types
 * Based on API Spec: F01ABC-api_spec.md (Section C) and F01DEF-api_spec.md (Section F)
 */

/**
 * Role Info (nested in user responses)
 */
export interface RoleInfo {
  id: string;
  name: string;
}

/**
 * User Entity Response (for list)
 */
export interface UserListResponseItem {
  id: string;
  name: string;
  email: string;
  status: "Active" | "PendingActivation" | "SoftDeleted";
  invite_sent_at: string | null;
  invite_expire_at: string | null;
  activated_at: string | null;
  is_del: boolean;
  roles_summary: string[];
  activation_state_label: string;
  is_activation_expired: boolean;
  family_status: "Active" | "SoftDeleted";
  family_id?: string; // Optional - included in /v1/users response for SuperAdmin
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

/**
 * User Detail Response (for detail view)
 */
export interface UserDetailResponse {
  id: string;
  name: string;
  email: string;
  family_id: string;
  status: "Active" | "PendingActivation" | "SoftDeleted";
  activated_at: string | null;
  invite_sent_at: string | null;
  invite_expire_at: string | null;
  invited_by: string | null;
  is_del: boolean;
  roles_list: RoleInfo[];
  allowed_role_management: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

/**
 * User List Items
 */
export interface UserListItems {
  items: UserListResponseItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * User List Response
 * GET /v1/families/{family_id}/users
 */
export interface UserListResponse {
  data: UserListItems;
  message: string;
}

/**
 * User Detail Response
 * GET /v1/families/{family_id}/users/{user_id}
 */
export interface UserDetailResponseWrapper {
  data: UserDetailResponse;
  message: string;
}

/**
 * User Delete Response
 * DELETE /v1/families/{family_id}/users/{user_id}
 */
export interface UserSoftDeleteResponse {
  data: UserDetailResponse;
  message: string;
}

/**
 * User Role Update Response
 * PATCH /v1/roles/families/{family_id}/users/{user_id}/
 */
export interface UserRoleUpdateResponseData {
  user_id: string;
  family_id: string;
  roles: RoleInfo[];
}

/**
 * User Role Update Response
 * PATCH /v1/roles/families/{family_id}/users/{user_id}/
 */
export interface UserRoleUpdateResponse {
  data: UserRoleUpdateResponseData;
  message: string;
}

