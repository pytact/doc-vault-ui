/**
 * Profile Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  UserProfileUpdateRequest,
  UserPasswordChangeRequest,
} from "@/types/requests/user.requests";
import {
  ProfileGetResponse,
  ProfileUpdateResponse,
  PasswordChangeResponse,
} from "@/types/responses/profile.responses";

const basePath = "/v1/users/me";

export const ProfileService = {
  /**
   * Get current user profile
   * GET /v1/users/me
   */
  get: async (): Promise<ProfileGetResponse> => {
    try {
      const response = await http.get<ProfileGetResponse>(basePath);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update current user profile
   * PATCH /v1/users/me
   */
  update: async (
    payload: UserProfileUpdateRequest,
    etag?: string
  ): Promise<ProfileUpdateResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
      const response = await http.patch<ProfileUpdateResponse>(
        basePath,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Change password
   * POST /v1/users/me/password/change
   */
  changePassword: async (
    payload: UserPasswordChangeRequest
  ): Promise<PasswordChangeResponse> => {
    try {
      const response = await http.post<PasswordChangeResponse>(
        `${basePath}/password/change`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

