/**
 * User Response Types for SuperAdmin Console (F-007)
 * Based on API Spec: F07_api_spec.md
 */

/**
 * Role Info (nested in user responses)
 * Matches existing RoleInfo from f001-identity
 */
export interface RoleInfo {
  id: string;
  name: string;
}

/**
 * User Entity Response
 * Used in UserDetailRead schema for reassign and reactivate endpoints
 * POST /v1/users/{user_id}/reassign
 * POST /v1/users/{user_id}/reactivate
 */
export interface UserResponse {
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
 * User Mutation Response
 * Wrapper for user mutation operations (reassign, reactivate)
 * POST /v1/users/{user_id}/reassign
 * POST /v1/users/{user_id}/reactivate
 */
export interface UserMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * User Bulk Delete Response Data
 * Response data structure for bulk delete operation
 * POST /v1/users/bulk-delete
 */
export interface UserBulkDeleteResponseData {
  deleted_count: number;
  skipped_count: number;
  deleted_user_ids: string[];
  skipped_user_ids: string[];
  skipped_reasons: Record<string, string>;
}

/**
 * User Bulk Delete Response
 * POST /v1/users/bulk-delete
 */
export interface UserBulkDeleteResponse {
  data: UserBulkDeleteResponseData;
  message: string;
}

/**
 * User List Response Item
 * For user listing endpoints (existing endpoints used in SuperAdmin context)
 */
export interface UserListResponseItem {
  id: string;
  name: string;
  email: string;
  family_id: string;
  status: "Active" | "PendingActivation" | "SoftDeleted";
  invite_sent_at: string | null;
  invite_expire_at: string | null;
  activated_at: string | null;
  is_del: boolean;
  roles_summary: string[];
  activation_state_label: string;
  is_activation_expired: boolean;
  family_status: "Active" | "SoftDeleted";
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

/**
 * User List Items (with pagination)
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
 * GET /v1/users (existing endpoint used in SuperAdmin context)
 */
export interface UserListResponse {
  data: UserListItems;
  message: string;
}

