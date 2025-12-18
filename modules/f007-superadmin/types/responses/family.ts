/**
 * Family Response Types for SuperAdmin Console (F-007)
 * Based on API Spec: F07_api_spec.md and existing family endpoints
 * 
 * Note: Family endpoints are documented separately (existing endpoints),
 * but included here for SuperAdmin Console usage.
 */

/**
 * Family Entity Response
 */
export interface FamilyResponse {
  id: string;
  name: string;
  status: "Active" | "SoftDeleted";
  is_del: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
}

/**
 * Family List Items (with pagination)
 */
export interface FamilyListItems {
  items: FamilyResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * Family List Response
 * GET /v1/families
 */
export interface FamilyListResponse {
  data: FamilyListItems;
  message: string;
}

/**
 * Family Mutation Response
 * Wrapper for family mutation operations (create, update)
 * POST /v1/families
 * PATCH /v1/families/{family_id}
 */
export interface FamilyMutationResponse {
  data: FamilyResponse;
  message: string;
}

