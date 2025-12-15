/**
 * Profile Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  UserProfileUpdateRequest,
  UserPasswordChangeRequest,
} from "@/modules/f001-identity/types/requests/user";
import {
  ProfileGetResponse,
  ProfileUpdateResponse,
  PasswordChangeResponse,
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
    console.error("convertUpdatedAtToETag - Error converting updated_at to ETag:", error);
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
      let etag: string | undefined;
      
      if (response.headers) {
        etag = (response.headers as any)["etag"] || 
               (response.headers as any)["ETag"] ||
               (response.headers as any)["ETAG"];
      }
      
      // Clean up ETag from header: remove quotes and whitespace
      if (etag) {
        etag = String(etag).replace(/^"|"$/g, "").trim();
        console.log("ProfileService.get - ETag from headers:", etag);
      }
      
      // If ETag not in headers, generate it from updated_at field
      if (!etag && response.data?.data?.updated_at) {
        console.log("ProfileService.get - ETag not in headers, generating from updated_at:", response.data.data.updated_at);
        etag = convertUpdatedAtToETag(response.data.data.updated_at);
        console.log("ProfileService.get - Generated ETag:", etag);
      }
      
      if (!etag) {
        console.warn("ProfileService.get - WARNING: Could not generate ETag from headers or updated_at!");
      }
      
      return {
        data: response.data,
        etag: etag || undefined,
      };
    } catch (error) {
      console.error("ProfileService.get - Error:", error);
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

      // ETag in If-Match header should be wrapped in quotes per HTTP spec
      const ifMatchValue = `"${etag}"`;
      const headers = { "If-Match": ifMatchValue };

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

      console.log("ProfileService.update - URL:", `/v1/users/${userId}`, "Payload:", requestPayload, "ETag (raw):", etag, "If-Match header:", ifMatchValue, "Headers:", headers);
      const response = await http.patch<ProfileUpdateResponse>(
        `/v1/users/${userId}`,
        requestPayload,
        { headers }
      );
      console.log("ProfileService.update - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("ProfileService.update - Error:", error);
      throw normalizeAPIError(error);
    }
  },

  /**
   * Change password
   * POST /v1/users/me/password/change
   * ETag is passed in the If-Match header
   */
  changePassword: async (
    payload: UserPasswordChangeRequest,
    etag?: string
  ): Promise<PasswordChangeResponse> => {
    try {
      // ETag in If-Match header should be wrapped in quotes per HTTP spec
      const ifMatchValue = etag ? `"${etag}"` : undefined;
      const headers = ifMatchValue ? { "If-Match": ifMatchValue } : {};
      
      console.log("ProfileService.changePassword - URL:", `${basePath}/password/change`, "ETag (raw):", etag, "If-Match header:", ifMatchValue, "Headers:", headers);
      const response = await http.post<PasswordChangeResponse>(
        `${basePath}/password/change`,
        payload,
        { headers }
      );
      console.log("ProfileService.changePassword - Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("ProfileService.changePassword - Error:", error);
      throw normalizeAPIError(error);
    }
  },
};

