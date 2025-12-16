/**
 * Invitation Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { UserInviteRequest, UserActivateRequest } from "@/modules/f001-identity/types/requests/user";
import {
  InvitationCreateResponse,
  InvitationValidationResponse,
  InvitationActivateResponse,
} from "@/modules/f001-identity/types/responses/invitation";
import { sessionStorageKeys } from "@/utils/constants/common";

export const InvitationService = {
  /**
   * Create user invitation
   * POST /v1/invite
   */
  create: async (
    familyId: string,
    payload: UserInviteRequest
  ): Promise<InvitationCreateResponse> => {
    try {
      // Get frontend URL from environment or window location
      const frontendUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_FRONTEND_URL || "";

      // Include family_id and frontend_url in the payload
      const requestPayload: UserInviteRequest = {
        ...payload,
        family_id: familyId,
        frontend_url: frontendUrl,
      };
      const response = await http.post<InvitationCreateResponse>(
        `/v1/invite`,
        requestPayload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Validate invitation token
   * GET /v1/invitation/{token}
   */
  validate: async (
    token: string
  ): Promise<InvitationValidationResponse> => {
    try {
      const encodedToken = encodeURIComponent(token);
      const response = await http.get<InvitationValidationResponse>(
        `/v1/invitations/${encodedToken}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Activate user account
   * POST /v1/invitation/activate/{token}
   */
  activate: async (
    token: string,
    payload: Omit<UserActivateRequest, 'token'>
  ): Promise<InvitationActivateResponse> => {
    try {
      // Get frontend URL from environment or window location
      const frontendUrl = typeof window !== "undefined" 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_FRONTEND_URL || "";

      // Include token and frontend_url in the payload
      const requestPayload: UserActivateRequest = {
        ...payload,
        token: token,
        frontend_url: frontendUrl,
      };

      const response = await http.post<InvitationActivateResponse>(
        `/v1/invitations/activate/${token}`,
        requestPayload
      );

      // Don't store token - user should log in manually after activation
      // Token will be stored after successful login

      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

