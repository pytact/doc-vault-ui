/**
 * Authentication Request Types
 * Based on API Spec: F01ABC-api_spec.md (Section A)
 */

/**
 * Login Request
 * POST /v1/auth/login
 */
export interface AuthLoginRequest {
  email: string;
  password: string;
}

/**
 * Logout Request
 * POST /v1/auth/logout
 * No request body required
 */
// No interface needed - empty body

