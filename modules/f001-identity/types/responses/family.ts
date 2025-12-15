/**
 * Family Response Types
 * Based on API Spec: F01ABC-api_spec.md (Section B)
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
 * Family List Items
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
 * Family Detail Response
 * GET /v1/families/{family_id}
 */
export interface FamilyDetailResponse {
  data: FamilyResponse;
  message: string;
}

/**
 * Family Create Response
 * POST /v1/families
 */
export interface FamilyCreateResponse {
  data: FamilyResponse;
  message: string;
}

/**
 * Family Update Response
 * PATCH /v1/families/{family_id}
 */
export interface FamilyUpdateResponse {
  data: FamilyResponse;
  message: string;
}

/**
 * Family Soft Delete Response
 * PATCH /v1/families/{family_id}/soft-delete
 */
export interface FamilySoftDeleteResponse {
  data: FamilyResponse;
  message: string;
}

