/**
 * SuperAdmin Analytics Service
 * Based on R4 and R8 rules
 * F-007 SuperAdmin Console endpoints
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { AnalyticsDashboardParams } from "@/modules/f007-superadmin/types/requests/analytics";
import { AnalyticsDashboardResponse } from "@/modules/f007-superadmin/types/responses/analytics";

const basePath = "/v1/analytics";

export const SuperAdminAnalyticsService = {
  /**
   * Get platform-wide dashboard summary metrics
   * GET /v1/analytics/dashboard
   * SuperAdmin only
   */
  getDashboard: async (
    params?: AnalyticsDashboardParams
  ): Promise<AnalyticsDashboardResponse> => {
    try {
      // Currently no query parameters in API spec, but structure ready for future expansion
      const searchParams = new URLSearchParams();
      
      // Future: Add date range and other filter params here when API supports them
      // if (params?.date_range_start) {
      //   searchParams.append("date_range_start", params.date_range_start);
      // }
      // if (params?.date_range_end) {
      //   searchParams.append("date_range_end", params.date_range_end);
      // }

      const queryString = searchParams.toString();
      const url = queryString 
        ? `${basePath}/dashboard?${queryString}` 
        : `${basePath}/dashboard`;

      const response = await http.get<AnalyticsDashboardResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

