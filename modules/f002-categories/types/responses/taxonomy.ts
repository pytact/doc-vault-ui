/**
 * Taxonomy Response Types
 * Based on API Spec: F02_api_spec.md
 * Domain Model: F02_domain_model.md
 * 
 * NOTE: F-002 is a read-only feature (immutable taxonomy).
 * Mutation responses are defined here for type consistency with R3 rules,
 * but they are NOT currently supported by the API.
 */

import type { APIErrorResponse } from "@/types/responses/common";

/**
 * Subcategory Entity Response
 * Represents a subcategory in API responses
 * GET /v1/taxonomy - nested in categories
 */
export interface SubcategoryResponse {
  id: string; // UUID format (RFC 4122 UUID v4)
  name: string; // Min 1 character, max 100 characters, alphabetically ordered
}

/**
 * Category Entity Response
 * Represents a category with nested subcategories in API responses
 * GET /v1/taxonomy - contains array of categories
 */
export interface CategoryResponse {
  id: string; // UUID format (RFC 4122 UUID v4)
  name: string; // Min 1 character, max 100 characters, alphabetically ordered
  subcategories: SubcategoryResponse[]; // Array of subcategories, alphabetically ordered by name
}

/**
 * Taxonomy Data Structure
 * The taxonomy container structure from API response
 * GET /v1/taxonomy - data.taxonomy
 */
export interface TaxonomyData {
  taxonomy: {
    categories: CategoryResponse[]; // Array of categories, alphabetically ordered by name
  };
}

/**
 * Taxonomy Response (Entity Response)
 * The complete taxonomy response structure
 * GET /v1/taxonomy
 * 
 * Matches API response structure exactly:
 * {
 *   "data": {
 *     "taxonomy": {
 *       "categories": [...]
 *     }
 *   },
 *   "message": "..."
 * }
 */
export interface TaxonomyResponse {
  data: TaxonomyData;
  message: string;
}

/**
 * Taxonomy List Response
 * Following R3 pattern for list responses
 * 
 * NOTE: The current API endpoint GET /v1/taxonomy does not support pagination
 * (returns all 15 categories and 78 subcategories in a single response).
 * This interface is defined for consistency with R3 rules and potential future use.
 */
export interface TaxonomyListResponse {
  data: CategoryResponse[]; // Array of categories with nested subcategories
  total: number; // Total number of categories
  page?: number; // Page number (if pagination is added in future)
  pageSize?: number; // Page size (if pagination is added in future)
}

/**
 * Taxonomy List Response with Pagination Meta
 * Alternative structure using PaginationMeta from common.ts
 * 
 * NOTE: Not currently used by API, but defined for consistency with R3 rules.
 */
export interface TaxonomyListResponseWithMeta {
  data: {
    items: CategoryResponse[]; // Array of categories with nested subcategories
  };
  pagination: {
    total: number; // Total number of categories
    page: number; // Current page number
    page_size: number; // Page size
    total_pages: number; // Total number of pages
    next_page: string | null; // Next page URL or null
    prev_page: string | null; // Previous page URL or null
  };
  message: string;
}

/**
 * Category Mutation Response
 * For Create/Update operations (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R3 rules.
 */
export interface CategoryMutationResponse {
  message: string;
  data?: CategoryResponse | null;
}

/**
 * Subcategory Mutation Response
 * For Create/Update operations (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R3 rules.
 */
export interface SubcategoryMutationResponse {
  message: string;
  data?: SubcategoryResponse | null;
}

/**
 * Taxonomy Mutation Response
 * For Create/Update operations (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R3 rules.
 */
export interface TaxonomyMutationResponse {
  message: string;
  data?: TaxonomyData | null;
}

/**
 * Error Response
 * Re-export from common.ts for convenience
 * Used for taxonomy-specific error handling
 * 
 * API Error Response Structure:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "details": [{"field": "field_name", "issue": "Error description"}]
 *   },
 *   "message": "Human-friendly error message"
 * }
 */
export type TaxonomyErrorResponse = APIErrorResponse;

