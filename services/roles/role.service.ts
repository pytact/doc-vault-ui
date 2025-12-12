/**
 * Role Service
 * Based on R4 and R8 rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { RoleListResponse } from "@/types/responses/role.responses";

const basePath = "/v1/roles";

export const RoleService = {
  /**
   * List all available roles
   * GET /v1/roles
   */
  list: async (): Promise<RoleListResponse> => {
    try {
      const response = await http.get<RoleListResponse>(basePath);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

