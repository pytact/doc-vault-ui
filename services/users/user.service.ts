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
} from "@/types/requests/user.requests";
import {
  UserListResponse,
  UserDetailResponseWrapper,
  UserSoftDeleteResponse,
  UserRoleUpdateResponse,
} from "@/types/responses/user.responses";
import { InvitationCreateResponse } from "@/types/responses/invitation.responses";

const basePath = "/v1/families";

export const UserService = {
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
   */
  getById: async (
    familyId: string,
    userId: string
  ): Promise<UserDetailResponseWrapper> => {
    try {
      const response = await http.get<UserDetailResponseWrapper>(
        `${basePath}/${familyId}/users/${userId}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Invite user to family
   * POST /v1/invite/families/{family_id}/users/
   */
  invite: async (
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
   * Soft delete user
   * PATCH /v1/families/{family_id}/users/{user_id}/soft-delete
   */
  softDelete: async (
    familyId: string,
    userId: string,
    etag?: string
  ): Promise<UserSoftDeleteResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
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
   */
  updateRoles: async (
    familyId: string,
    userId: string,
    payload: UserRoleUpdateRequest,
    etag?: string
  ): Promise<UserRoleUpdateResponse> => {
    try {
      const headers = etag ? { "If-Match": etag } : {};
      const response = await http.patch<UserRoleUpdateResponse>(
        `/v1/roles/families/${familyId}/users/${userId}/`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

