/**
 * SuperAdmin Family Service
 * Based on R4 and R8 rules
 * F-007 SuperAdmin Console - Family management endpoints
 * 
 * Note: These endpoints are existing endpoints (not new in F-007),
 * but organized here for SuperAdmin Console usage.
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  FamilyCreateRequest,
  FamilyUpdateRequest,
  FamilyListParams,
} from "@/modules/f007-superadmin/types/requests/family";
import {
  FamilyListResponse,
  FamilyMutationResponse,
} from "@/modules/f007-superadmin/types/responses/family";

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

export const SuperAdminFamilyService = {
  /**
   * List all families
   * GET /v1/families
   */
  list: async (params?: FamilyListParams): Promise<FamilyListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.skip !== undefined) {
        searchParams.append("skip", params.skip.toString());
      }
      if (params?.take !== undefined) {
        searchParams.append("take", params.take.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.status && params.status.length > 0) {
        params.status.forEach((status) => {
          searchParams.append("status", status);
        });
      }
      if (params?.sortBy) {
        searchParams.append("sortBy", params.sortBy);
      }
      if (params?.sortOrder) {
        searchParams.append("sortOrder", params.sortOrder);
      }

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
  getById: async (
    familyId: string
  ): Promise<{ data: FamilyMutationResponse; etag?: string }> => {
    try {
      const response = await http.get<FamilyMutationResponse>(
        `${basePath}/${familyId}`
      );
      
      // Try to get ETag from response headers first
      let etag: string | undefined;
      
      if (response.headers) {
        const headers = response.headers as Record<string, string | undefined>;
        etag = headers["etag"] || headers["ETag"] || headers["ETAG"];
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
  ): Promise<FamilyMutationResponse> => {
    try {
      const response = await http.post<FamilyMutationResponse>(
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
  ): Promise<FamilyMutationResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
      const url = `${basePath}/${familyId}`;
      const response = await http.patch<FamilyMutationResponse>(
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
   * Delete family (soft delete)
   * DELETE /v1/families/{family_id}
   * ETag is passed in the If-Match header (required for concurrency control)
   */
  delete: async (
    familyId: string,
    etag?: string
  ): Promise<FamilyMutationResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for delete operations");
      }

      const headers = { "If-Match": etag };
      const url = `${basePath}/${familyId}`;

      const response = await http.delete<FamilyMutationResponse>(
        url,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

