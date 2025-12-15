/**
 * User Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  UserInviteRequest,
  UserListParams,
  UserRoleUpdateRequest,
} from "@/modules/f001-identity/types/requests/user";
import {
  UserListResponse,
  UserDetailResponseWrapper,
  UserSoftDeleteResponse,
  UserRoleUpdateResponse,
} from "@/modules/f001-identity/types/responses/user";
import { InvitationCreateResponse } from "@/modules/f001-identity/types/responses/invitation";

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
    console.error("convertUpdatedAtToETag - Error converting updated_at to ETag:", error);
    return "";
  }
}

export const UserService = {
  /**
   * List all users (SuperAdmin only)
   * GET /v1/users
   */
  listAll: async (params?: UserListParams): Promise<UserListResponse> => {
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
      const url = queryString ? `/v1/users?${queryString}` : `/v1/users`;

      const response = await http.get<UserListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * List users in a family
   * GET /v1/families/{family_id}/users
   */
  list: async (
    familyId: string,
    params?: UserListParams
  ): Promise<UserListResponse> => {
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
      const url = queryString
        ? `${basePath}/${familyId}/users?${queryString}`
        : `${basePath}/${familyId}/users`;

      const response = await http.get<UserListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get user by ID
   * GET /v1/families/{family_id}/users/{user_id}
   * Returns both data and eTag from response headers
   */
  getById: async (
    familyId: string,
    userId: string
  ): Promise<{ data: UserDetailResponseWrapper; etag?: string }> => {
    try {
      const response = await http.get<UserDetailResponseWrapper>(
        `${basePath}/${familyId}/users/${userId}`
      );
      
      // Try to get ETag from response headers first
      let etag: string | undefined;
      
      if (response.headers) {
        etag = (response.headers as any)["etag"] || 
               (response.headers as any)["ETag"] ||
               (response.headers as any)["ETAG"];
      }
      
      // Clean up ETag from header: remove quotes and whitespace
      if (etag) {
        etag = String(etag).replace(/^"|"$/g, "").trim();
      }
      
      // If ETag not in headers, generate it from updated_at field
      if (!etag && response.data?.data?.updated_at) {
        console.log("UserService.getById - ETag not in headers, generating from updated_at:", response.data.data.updated_at);
        etag = convertUpdatedAtToETag(response.data.data.updated_at);
        console.log("UserService.getById - Generated ETag:", etag);
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
   * Invite user to family
   * POST /v1/invite
   */
  invite: async (
    familyId: string,
    payload: UserInviteRequest
  ): Promise<InvitationCreateResponse> => {
    try {
      // Get frontend URL from environment or window location
      const frontendUrl = typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_FRONTEND_URL || "";

      // Include family_id, frontend_url, and preserve role_id from payload
      const requestPayload: UserInviteRequest = {
        email: payload.email,
        role_id: payload.role_id, // Ensure role_id is explicitly included
        family_id: familyId,
        frontend_url: frontendUrl,
      };
      
      console.log("UserService.invite - Request payload:", requestPayload);
      console.log("UserService.invite - Role ID being sent:", requestPayload.role_id);
      
      const response = await http.post<InvitationCreateResponse>(
        `/v1/invite`,
        requestPayload
      );
      console.log("UserService.invite - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("UserService.invite - Error:", error);
      throw normalizeAPIError(error);
    }
  },

  /**
   * Soft delete user
   * PATCH /v1/families/{family_id}/users/{user_id}/soft-delete
   */
  softDelete: async (
    familyId: string,
    userId: string,
    etag?: string
  ): Promise<UserSoftDeleteResponse> => {
    try {
      // ETag in If-Match header should be wrapped in quotes per HTTP spec
      const ifMatchValue = etag ? `"${etag}"` : undefined;
      const headers = ifMatchValue ? { "If-Match": ifMatchValue } : {};
      const response = await http.patch<UserSoftDeleteResponse>(
        `${basePath}/${familyId}/users/${userId}/soft-delete`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update user roles
   * PATCH /v1/roles/families/{family_id}/users/{user_id}/
   * ETag is passed in the If-Match header
   */
  updateRoles: async (
    familyId: string,
    userId: string,
    payload: UserRoleUpdateRequest,
    etag?: string
  ): Promise<UserRoleUpdateResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for role update operations");
      }

      // ETag in If-Match header should be wrapped in quotes per HTTP spec
      const ifMatchValue = `"${etag}"`;
      const headers = { "If-Match": ifMatchValue };

      console.log("UserService.updateRoles - URL:", `/v1/roles/families/${familyId}/users/${userId}/`, "Payload:", payload, "ETag (raw):", etag, "If-Match header:", ifMatchValue, "Headers:", headers);
      const response = await http.patch<UserRoleUpdateResponse>(
        `/v1/roles/families/${familyId}/users/${userId}/`,
        payload,
        { headers }
      );
      console.log("UserService.updateRoles - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("UserService.updateRoles - Error:", error);
      throw normalizeAPIError(error);
    }
  },
};

