/**
 * User Request Types for SuperAdmin Console (F-007)
 * Based on API Spec: F07_api_spec.md
 */

/**
 * User Reassign Request
 * POST /v1/users/{user_id}/reassign
 * Reassigns a user to a different family with optional role change
 */
export interface UserReassignRequest {
  family_id: string; // UUID, REQUIRED - Target family identifier
  role_id?: string | null; // UUID, OPTIONAL - Role identifier to assign simultaneously
}

/**
 * User Reactivate Request
 * POST /v1/users/{user_id}/reactivate
 * Reactivates a soft-deleted user
 * Note: Request body is empty or {} - no fields required
 */
export interface UserReactivateRequest {
  // Empty body - no fields required
}

/**
 * User Bulk Delete Request
 * POST /v1/users/bulk-delete
 * Bulk soft-deletes multiple users at once
 */
export interface UserBulkDeleteRequest {
  user_ids: string[]; // Array of UUIDs, REQUIRED, min 1, max 100, all unique
}

/**
 * User List Query Parameters
 * GET /v1/users (existing endpoint, but may be used in SuperAdmin context)
 * Note: Pagination and filtering parameters for user listing
 */
export interface UserListParams {
  skip?: number;
  take?: number;
  search?: string | null; // Search by name/email
  role?: string[] | []; // Filter by role(s)
  family_id?: string | null; // Filter by family
  status?: string[] | []; // Filter by status (active, soft-deleted)
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

