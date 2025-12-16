/**
 * Authentication Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { AuthLoginRequest } from "@/modules/f001-identity/types/requests/auth";
import {
  AuthLoginResponse,
  AuthLogoutResponse,
  UserRole,
} from "@/modules/f001-identity/types/responses/auth";
import { ProfileGetResponse } from "@/modules/f001-identity/types/responses/profile";
import { sessionStorageKeys } from "@/utils/constants/common";

const basePath = "/v1/auth";

export const AuthService = {
  /**
   * Login user
   * POST /v1/auth/login
   * After login, calls /v1/users/me to get full user data including role and permissions
   */
  login: async (payload: AuthLoginRequest): Promise<AuthLoginResponse> => {
    try {
      // POST request to login endpoint
      const response = await http.post<AuthLoginResponse>(
        `${basePath}/login`,
        payload
      );

      // Store token in sessionStorage
      if (typeof window !== "undefined" && response.data.data.token) {
        sessionStorage.setItem(sessionStorageKeys.accessToken, response.data.data.token);
        
        // After storing token, fetch full user profile with role and permissions from /users/me
        try {
          const profileResponse = await http.get<ProfileGetResponse>("/v1/users/me");
          if (profileResponse.data?.data) {
            const profileData = profileResponse.data.data;
            
            // Extract role name from role object (API returns role as { id, name, permissions })
            const roleName = profileData.role?.name || response.data.data.user.role;
            
            // Ensure role is a string (handle case where it might be an object)
            const roleString: UserRole = typeof roleName === 'string' 
              ? (roleName as UserRole)
              : (typeof roleName === 'object' && roleName !== null && 'name' in roleName 
                  ? (roleName as { name: UserRole }).name 
                  : 'member' as UserRole);
            
            // Extract family info (API returns family as object or null)
            const familyId = profileData.family?.id || null;
            const familyName = profileData.family?.name || null;
            
            // Extract permissions from role object
            const permissions = profileData.role?.permissions || {};
            
            // Update login response with role and permissions from /users/me
            response.data.data.user = {
              ...response.data.data.user,
              role: roleString, // Use role name string (ensure it's a string)
              family_id: familyId,
              family_name: familyName,
              permissions: permissions,
            };
            
            // Store updated user data in sessionStorage
            sessionStorage.setItem(
              sessionStorageKeys.user,
              JSON.stringify(response.data.data.user)
            );
          }
        } catch (profileError) {
          // If /users/me fails, continue with login response data
          // Role should still be available from login response
        }
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

