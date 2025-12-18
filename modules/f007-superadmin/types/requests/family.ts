/**
 * Family Request Types for SuperAdmin Console (F-007)
 * Based on API Spec: F07_api_spec.md and Domain Model
 * 
 * Note: Family creation endpoint is documented separately (existing endpoint),
 * but included here for SuperAdmin Console usage.
 */

/**
 * Family Create Request
 * POST /v1/families
 * Creates a new family with name only
 */
export interface FamilyCreateRequest {
  name: string; // REQUIRED - Family display name
}

/**
 * Family Update Request
 * PATCH /v1/families/{family_id}
 * Updates family information
 */
export interface FamilyUpdateRequest {
  name?: string | null; // Optional - Family display name
}

/**
 * Family List Query Parameters
 * GET /v1/families
 * Note: Pagination and filtering parameters for family listing
 */
export interface FamilyListParams {
  skip?: number;
  take?: number;
  search?: string | null; // Search by name
  status?: string[] | []; // Filter by status (active, soft-deleted)
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

