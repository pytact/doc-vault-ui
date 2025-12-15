/**
 * Taxonomy Service
 * Based on R4-HTTP Client and R8-API Calls & Error Handling rules
 * 
 * NOTE: F-002 is a read-only feature (immutable taxonomy).
 * Only GET /v1/taxonomy endpoint is available in the API.
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { TaxonomyListParams } from "@/modules/f002-categories/types/requests/taxonomy";
import {
  TaxonomyResponse,
  CategoryResponse,
} from "@/modules/f002-categories/types/responses/taxonomy";

const basePath = "/v1/taxonomy";

export const TaxonomyService = {
  /**
   * List complete taxonomy (all categories with subcategories)
   * GET /v1/taxonomy
   * 
   * Returns the complete immutable taxonomy including all 15 categories
   * and 78 subcategories in a single response.
   * 
   * @param params - Optional list parameters (currently not used by API)
   * @returns Complete taxonomy response with nested categories and subcategories
   */
  list: async (params?: TaxonomyListParams): Promise<TaxonomyResponse> => {
    try {
      // API currently has no query parameters, but prepare for future use
      const searchParams = new URLSearchParams();
      
      // Future potential query parameters (commented out as API doesn't support them yet)
      // if (params?.skip !== undefined) searchParams.append("skip", params.skip.toString());
      // if (params?.take !== undefined) searchParams.append("take", params.take.toString());
      
      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const response = await http.get<TaxonomyResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get category by ID (extracted from taxonomy list)
   * 
   * NOTE: The API does not have a dedicated GET /v1/categories/{id} endpoint.
   * This function fetches the complete taxonomy and filters for the requested category.
   * 
   * @param categoryId - Category UUID
   * @returns Category with nested subcategories, or undefined if not found
   */
  getById: async (categoryId: string): Promise<CategoryResponse | undefined> => {
    try {
      // Fetch complete taxonomy
      const taxonomyResponse = await TaxonomyService.list();
      
      // Find category by ID
      const category = taxonomyResponse.data.taxonomy.categories.find(
        (cat) => cat.id === categoryId
      );

      return category;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

};

