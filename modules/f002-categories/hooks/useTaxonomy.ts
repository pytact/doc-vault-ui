/**
 * Taxonomy Hooks
 * Based on R5-Custom Hooks and R9-Caching rules
 * 
 * NOTE: F-002 is a read-only feature (immutable taxonomy).
 * Only GET /v1/taxonomy endpoint is available in the API.
 * Create, update, and delete operations are not supported.
 */

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { TaxonomyService } from "@/services/categories/taxonomy.service";
import { TaxonomyListParams } from "../types/requests";
import {
  TaxonomyResponse,
  CategoryResponse,
} from "../types/responses";

/**
 * Taxonomy list query hook
 * GET /v1/taxonomy
 * 
 * Returns the complete immutable taxonomy including all categories and subcategories.
 * Uses Infinity staleTime since taxonomy is immutable and never changes.
 * 
 * @param params - Optional list parameters (currently not used by API)
 * @returns React Query result with taxonomy data
 */
export function useListTaxonomy(params?: TaxonomyListParams) {
  return useQuery({
    queryKey: ["taxonomy", "list", params],
    queryFn: () => TaxonomyService.list(params),
    staleTime: Infinity, // Taxonomy is immutable - never stale
    gcTime: Infinity, // Keep in cache indefinitely since data never changes
    refetchOnWindowFocus: false, // No need to refetch immutable data
    placeholderData: keepPreviousData, // Keep previous data while refetching (if ever needed)
  });
}

/**
 * Get category by ID query hook
 * 
 * NOTE: The API does not have a dedicated GET /v1/categories/{id} endpoint.
 * This hook uses the taxonomy list and filters for the requested category.
 * 
 * @param categoryId - Category UUID
 * @param enabled - Whether the query should run (defaults to true if categoryId is provided)
 * @returns React Query result with category data or undefined
 */
export function useGetTaxonomy(
  categoryId: string | undefined,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["taxonomy", "category", categoryId],
    queryFn: async () => {
      if (!categoryId) return undefined;
      return TaxonomyService.getById(categoryId);
    },
    enabled: enabled && !!categoryId, // Only run if categoryId is provided and enabled
    staleTime: Infinity, // Taxonomy is immutable - never stale
    gcTime: Infinity, // Keep in cache indefinitely
    refetchOnWindowFocus: false, // No need to refetch immutable data
  });
}

