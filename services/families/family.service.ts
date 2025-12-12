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
} from "@/types/requests/family.requests";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilyCreateResponse,
  FamilyUpdateResponse,
  FamilySoftDeleteResponse,
} from "@/types/responses/family.responses";

const basePath = "/v1/families";

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
   */
  getById: async (familyId: string): Promise<FamilyDetailResponse> => {
    try {
      const response = await http.get<FamilyDetailResponse>(
        `${basePath}/${familyId}`
      );
      return response.data;
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
      const response = await http.patch<FamilyUpdateResponse>(
        `${basePath}/${familyId}`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Soft delete family
   * PATCH /v1/families/{family_id}/soft-delete
   */
  softDelete: async (
    familyId: string,
    etag?: string
  ): Promise<FamilySoftDeleteResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
      const response = await http.patch<FamilySoftDeleteResponse>(
        `${basePath}/${familyId}/soft-delete`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

