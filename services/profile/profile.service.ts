/**
 * Profile Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  UserProfileUpdateRequest,
} from "@/modules/f001-identity/types/requests/user";
import {
  ProfileGetResponse,
  ProfileUpdateResponse,
} from "@/modules/f001-identity/types/responses/profile";

const basePath = "/v1/users/me";

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

export const ProfileService = {
  /**
   * Get current user profile
   * GET /v1/users/me
   * Returns both data and eTag from response headers or generated from updated_at
   */
  get: async (): Promise<{ data: ProfileGetResponse; etag?: string }> => {
    try {
      const response = await http.get<ProfileGetResponse>(basePath);
      
      // Try to get ETag from response headers first
      // Axios normalizes headers to lowercase, so check lowercase first
      let etag: string | undefined;
      
      if (response.headers) {
        // Check all possible case variations (Axios may normalize to lowercase)
        etag = (response.headers as any)["etag"] || 
               (response.headers as any)["ETag"] ||
               (response.headers as any)["ETAG"] ||
               (response.headers as any).get?.("etag") ||
               (response.headers as any).get?.("ETag");
        
        // If still not found, try iterating through headers
        if (!etag && typeof response.headers === 'object') {
          const headerKeys = Object.keys(response.headers);
          const etagKey = headerKeys.find(key => key.toLowerCase() === 'etag');
          if (etagKey) {
            etag = (response.headers as any)[etagKey];
          }
        }
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
   * Update current user profile
   * PATCH /v1/users/{user_id}
   * ETag is passed in the If-Match header (required by backend)
   */
  update: async (
    userId: string,
    payload: UserProfileUpdateRequest,
    etag?: string
  ): Promise<ProfileUpdateResponse> => {
    try {
      // ETag is required and must be passed as parameter (sent in If-Match header)
      if (!etag) {
        throw new Error("ETag is required for update operations. Please refresh the page and try again.");
      }

      // ETag in If-Match header (without quotes)
      // Build payload - include user_id and name
      const requestPayload: UserProfileUpdateRequest & { user_id: string } = {
        user_id: userId,
        name: payload.name,
      };

      // Only include password fields if password is being changed
      if (payload.password && payload.password.trim() !== "") {
        requestPayload.password = payload.password;
        requestPayload.current_password = payload.current_password;
      }

      const headers: Record<string, string> = {
        "If-Match": etag,
      };

      const response = await http.patch<ProfileUpdateResponse>(
        `/v1/users/${userId}`,
        requestPayload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

