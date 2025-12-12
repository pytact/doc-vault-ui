/**
 * Common API Response Types
 * Based on API Spec: Global response format
 */

/**
 * Standard API Error Response
 * Used across all error responses
 */
export interface APIErrorResponse {
  error: {
    code: string;
    details: Array<{
      field: string;
      issue: string;
    }>;
  };
  message: string;
}

/**
 * Standard API Success Response Wrapper
 * Wraps all successful responses
 */
export interface StandardResponse<T> {
  data: T;
  message: string;
}

/**
 * Pagination Metadata
 * Used in list responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * Password Rules Object
 * Used in invitation and profile responses
 */
export interface PasswordRules {
  min_length: number;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  disallow_last_5: boolean;
}

