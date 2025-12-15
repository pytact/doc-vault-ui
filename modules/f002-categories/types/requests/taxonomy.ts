/**
 * Taxonomy Request Types
 * Based on API Spec: F02_api_spec.md
 * Domain Model: F02_domain_model.md
 * 
 * NOTE: F-002 is a read-only feature (immutable taxonomy).
 * Create and Update operations are defined here for type consistency with R2 rules,
 * but they are NOT currently supported by the API.
 * The taxonomy is immutable and cannot be modified via API.
 */

/**
 * Category Base Interface
 * Represents the base structure of a Category entity
 */
export interface CategoryBase {
  id: string; // UUID format (RFC 4122 UUID v4)
  name: string; // Min 1 character, max 100 characters, immutable
}

/**
 * Category Create Request
 * POST /v1/categories (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R2 rules.
 */
export interface CategoryCreate {
  name: string; // Required, min 1 character, max 100 characters
}

/**
 * Category Update Request
 * PATCH /v1/categories/{category_id} (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R2 rules.
 */
export interface CategoryUpdate {
  name?: string | null; // Optional, min 1 character, max 100 characters (if provided)
}

/**
 * Category List Parameters
 * GET /v1/categories (NOT CURRENTLY SUPPORTED - Use GET /v1/taxonomy instead)
 * 
 * NOTE: The current API endpoint GET /v1/taxonomy has no query parameters.
 * This interface is defined for potential future use or consistency with R2 rules.
 */
export interface CategoryListParams {
  skip?: number;
  take?: number;
  search?: string | null; // Case-insensitive substring search on category name
  sort_by?: string; // Default: "name"
  sort_order?: "asc" | "desc"; // Default: "asc" (alphabetical)
}

/**
 * Subcategory Base Interface
 * Represents the base structure of a Subcategory entity
 */
export interface SubcategoryBase {
  id: string; // UUID format (RFC 4122 UUID v4)
  name: string; // Min 1 character, max 100 characters, immutable, searchable
  category_id: string; // UUID format - Parent category (required, immutable)
}

/**
 * Subcategory Create Request
 * POST /v1/subcategories (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R2 rules.
 * 
 * Note: id is not included as it is server-generated.
 */
export interface SubcategoryCreate {
  name: string; // Required, min 1 character, max 100 characters
  category_id: string; // Required, must reference existing Category (UUID)
}

/**
 * Subcategory Update Request
 * PATCH /v1/subcategories/{subcategory_id} (NOT CURRENTLY SUPPORTED - Taxonomy is immutable)
 * 
 * NOTE: This operation does not exist in the current API.
 * Defined for type consistency with R2 rules.
 */
export interface SubcategoryUpdate {
  name?: string | null; // Optional, min 1 character, max 100 characters (if provided)
  category_id?: string | null; // Optional, must reference existing Category (UUID) if provided
}

/**
 * Subcategory List Parameters
 * GET /v1/subcategories (NOT CURRENTLY SUPPORTED - Use GET /v1/taxonomy instead)
 * 
 * NOTE: The current API endpoint GET /v1/taxonomy has no query parameters.
 * This interface is defined for potential future use or consistency with R2 rules.
 */
export interface SubcategoryListParams {
  skip?: number;
  take?: number;
  category_id?: string | null; // Filter subcategories by category
  search?: string | null; // Case-insensitive substring search on subcategory name
  sort_by?: string; // Default: "name"
  sort_order?: "asc" | "desc"; // Default: "asc" (alphabetical)
}

/**
 * Taxonomy List Parameters
 * GET /v1/taxonomy
 * 
 * NOTE: The current API endpoint has NO query parameters.
 * This interface is defined for potential future use or consistency with R2 rules.
 * The API returns all 15 categories and 78 subcategories in a single response (no pagination).
 */
export interface TaxonomyListParams {
  // Currently no query parameters supported
  // Future potential parameters:
  // skip?: number;
  // take?: number;
  // category_id?: string | null; // Filter to specific category
  // search?: string | null; // Search subcategories
}

/**
 * Taxonomy Pagination Parameters
 * 
 * NOTE: The API explicitly states "No pagination required" (15 categories, 78 subcategories).
 * This interface is defined for potential future use or consistency with R2 rules.
 */
export interface TaxonomyPaginationParams {
  skip?: number; // Offset for pagination
  take?: number; // Page size for pagination
  page?: number; // Page number (alternative to skip/take)
  page_size?: number; // Page size (alternative to take)
}

