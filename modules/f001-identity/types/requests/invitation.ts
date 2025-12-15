/**
 * Invitation Request Types
 * Based on API Spec: F01DEF-api_spec.md (Section D)
 */

/**
 * Invitation Validate Query Parameters
 * GET /v1/invitation/{token}
 * Note: Token is now passed in the URL path, not as a query parameter
 * This interface is kept for backward compatibility but may not be used
 */
export interface InvitationValidateQuery {
  token: string;
}

