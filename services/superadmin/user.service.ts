/**
 * SuperAdmin User Service
 * Based on R4 and R8 rules
 * F-007 SuperAdmin Console endpoints
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  UserReassignRequest,
  UserReactivateRequest,
  UserBulkDeleteRequest,
} from "@/modules/f007-superadmin/types/requests/user";
import {
  UserMutationResponse,
  UserBulkDeleteResponse,
} from "@/modules/f007-superadmin/types/responses/user";

const basePath = "/v1/users";

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

export const SuperAdminUserService = {
  /**
   * Reassign user to different family with optional role change
   * POST /v1/users/{user_id}/reassign
   * SuperAdmin only
   */
  reassign: async (
    userId: string,
    payload: UserReassignRequest,
    etag: string
  ): Promise<UserMutationResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for reassignment operations");
      }

      const headers = { "If-Match": etag };
      const response = await http.post<UserMutationResponse>(
        `${basePath}/${userId}/reassign`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Reactivate soft-deleted user
   * POST /v1/users/{user_id}/reactivate
   * SuperAdmin only
   */
  reactivate: async (
    userId: string,
    etag: string
  ): Promise<UserMutationResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for reactivation operations");
      }

      const headers = { "If-Match": etag };
      // Request body is empty or {} - both approaches are valid
      const response = await http.post<UserMutationResponse>(
        `${basePath}/${userId}/reactivate`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Bulk delete multiple users
   * POST /v1/users/bulk-delete
   * SuperAdmin only
   */
  bulkDelete: async (
    payload: UserBulkDeleteRequest
  ): Promise<UserBulkDeleteResponse> => {
    try {
      const response = await http.post<UserBulkDeleteResponse>(
        `${basePath}/bulk-delete`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

