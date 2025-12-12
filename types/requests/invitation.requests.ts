/**
 * Invitation Request Types
 * Based on API Spec: F01DEF-api_spec.md (Section D)
 */

/**
 * Invitation Validate Query Parameters
 * GET /v1/invitations/validate
 */
export interface InvitationValidateQuery {
  token: string;
}

