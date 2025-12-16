/**
 * Family Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  FamilyCreateRequest,
  FamilyUpdateRequest,
  FamilyListParams,
} from "@/modules/f001-identity/types/requests/family";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilyCreateResponse,
  FamilyUpdateResponse,
  FamilySoftDeleteResponse,
} from "@/modules/f001-identity/types/responses/family";

const basePath = "/v1/families";

/**
 * Convert updated_at timestamp to ETag format
 * Format: YYYYMMDDTHHMMSSZ (e.g., "20251215T090603Z")
 * Input: "2025-12-15T09:06:03.637969Z"
 */
function convertUpdatedAtToETag(updatedAt: string): string {
  try {
    const date = new Date(updatedAt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  } catch (error) {
    return "";
  }
}

export const FamilyService = {
  /**
   * List all families
   * GET /v1/families
   */
  list: async (params?: FamilyListParams): Promise<FamilyListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.page_size)
        searchParams.append("page_size", params.page_size.toString());
      if (params?.status) searchParams.append("status", params.status);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const response = await http.get<FamilyListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get family by ID
   * GET /v1/families/{family_id}
   * Returns both data and eTag from response headers
   */
  getById: async (familyId: string): Promise<{ data: FamilyDetailResponse; etag?: string }> => {
    try {
      const response = await http.get<FamilyDetailResponse>(
        `${basePath}/${familyId}`
      );
      
      // Try to get ETag from response headers first
      let etag: string | undefined;
      
      if (response.headers) {
        etag = (response.headers as any)["etag"] || 
               (response.headers as any)["ETag"] ||
               (response.headers as any)["ETAG"];
      }
      
      if (etag) {
        etag = String(etag).replace(/^"|"$/g, "").trim();
      }
      
      if (!etag && response.data?.data?.updated_at) {
        etag = convertUpdatedAtToETag(response.data.data.updated_at);
      }
      
      return {
        data: response.data,
        etag: etag || undefined,
      };
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Create new family
   * POST /v1/families
   */
  create: async (
    payload: FamilyCreateRequest
  ): Promise<FamilyCreateResponse> => {
    try {
      const response = await http.post<FamilyCreateResponse>(
        basePath,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update family
   * PATCH /v1/families/{family_id}
   */
  update: async (
    familyId: string,
    payload: FamilyUpdateRequest,
    etag?: string
  ): Promise<FamilyUpdateResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
      const url = `${basePath}/${familyId}`;
      const response = await http.patch<FamilyUpdateResponse>(
        url,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Delete family (backend handles soft-delete automatically)
   * DELETE /v1/families/{family_id}
   * ETag is passed in the If-Match header (required for concurrency control)
   */
  delete: async (
    familyId: string,
    etag?: string
  ): Promise<FamilySoftDeleteResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for delete operations");
      }

      const headers = { "If-Match": etag };
      const url = `${basePath}/${familyId}`;

      const response = await http.delete<FamilySoftDeleteResponse>(
        url,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};