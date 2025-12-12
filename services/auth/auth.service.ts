/**
 * Authentication Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { AuthLoginRequest } from "@/types/requests/auth.requests";
import {
  AuthLoginResponse,
  AuthLogoutResponse,
} from "@/types/responses/auth.responses";
import { sessionStorageKeys } from "@/utils/constants/common";

const basePath = "/v1/auth";

export const AuthService = {
  /**
   * Login user
   * POST /v1/auth/login
   */
  login: async (payload: AuthLoginRequest): Promise<AuthLoginResponse> => {
    try {
      const response = await http.post<AuthLoginResponse>(
        `${basePath}/login`,
        payload
      );

      // Store token in sessionStorage
      if (typeof window !== "undefined" && response.data.data.token) {
        sessionStorage.setItem(sessionStorageKeys.accessToken, response.data.data.token);
      }

      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Logout user
   * POST /v1/auth/logout
   */
  logout: async (): Promise<AuthLogoutResponse> => {
    try {
      const response = await http.post<AuthLogoutResponse>(
        `${basePath}/logout`
      );

      // Clear token from sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(sessionStorageKeys.accessToken);
      }

      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

