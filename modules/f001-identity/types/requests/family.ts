/**
 * Family Request Types
 * Based on API Spec: F01ABC-api_spec.md (Section B)
 */

/**
 * Family Create Request
 * POST /v1/families
 */
export interface FamilyCreateRequest {
  name: string;
}

/**
 * Family Update Request
 * PATCH /v1/families/{family_id}
 */
export interface FamilyUpdateRequest {
  name: string;
}

/**
 * Family List Query Parameters
 * GET /v1/families
 */
export interface FamilyListParams {
  page?: number;
  page_size?: number;
  status?: string | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * Family Soft Delete Request
 * DELETE /v1/families/{family_id}
 * ETag is passed in the request payload
 */
export interface FamilyDeleteRequest {
  family_id: string;
  etag: string;
}

