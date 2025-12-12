/**
 * Invitation Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { UserInviteRequest, UserActivateRequest } from "@/types/requests/user.requests";
import { InvitationValidateQuery } from "@/types/requests/invitation.requests";
import {
  InvitationCreateResponse,
  InvitationValidationResponse,
  InvitationActivateResponse,
} from "@/types/responses/invitation.responses";
import { sessionStorageKeys } from "@/utils/constants/common";

const invitationBasePath = "/v1/invitations";

export const InvitationService = {
  /**
   * Create user invitation
   * POST /v1/invite/families/{family_id}/users/
   */
  create: async (
    familyId: string,
    payload: UserInviteRequest
  ): Promise<InvitationCreateResponse> => {
    try {
      const response = await http.post<InvitationCreateResponse>(
        `/v1/invite/families/${familyId}/users/`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Validate invitation token
   * GET /v1/invitations/validate
   */
  validate: async (
    params: InvitationValidateQuery
  ): Promise<InvitationValidationResponse> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("token", params.token);

      const response = await http.get<InvitationValidationResponse>(
        `${invitationBasePath}/validate?${searchParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Activate user account
   * POST /v1/invitations/activate
   */
  activate: async (
    payload: UserActivateRequest
  ): Promise<InvitationActivateResponse> => {
    try {
      const response = await http.post<InvitationActivateResponse>(
        `${invitationBasePath}/activate`,
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
};

