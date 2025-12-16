/**
 * Document Assignment Response Types
 * Based on API Spec: F04_api_spec.md
 * Domain Model: F04_domain_model.md
 * UI Data Contract: F04_ui_data_contract.md
 * 
 * All response fields match backend API exactly (no renaming, snake_case).
 */

import type { APIErrorResponse, StandardResponse } from "@/types/responses/common.responses";

/**
 * User Summary (Nested in Assignment Response)
 * Represents user details included in assignment responses
 * Used in: GET assignments, PUT assignment, POST bulk assignment responses
 */
export interface UserSummary {
  id: string; // UUID format (RFC 4122 UUID v4)
  name: string; // Min 1 character, max 255 characters
  email: string; // RFC 5322 format, max 254 characters
  family_id: string; // UUID format (RFC 4122 UUID v4)
  status: "Active" | "PendingActivation" | "SoftDeleted"; // User status enum
}

/**
 * Document Assignment Entity Response
 * Represents a single document assignment in API responses
 * Used in: GET /api/v1/documents/{document_id}/assignments, PUT /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Matches DocumentAssignmentRead schema from API spec exactly.
 * Response returns normalized assignments (one entry per user with effective access_type - editor overrides viewer).
 */
export interface DocumentAssignmentResponse {
  id: string; // UUID format (RFC 4122 UUID v4), unique assignment identifier
  document_id: string; // UUID format (RFC 4122 UUID v4), document being shared
  assign_to_user_id: string; // UUID format (RFC 4122 UUID v4), user receiving the access
  owner_id: string; // UUID format (RFC 4122 UUID v4), user who created or last updated the assignment
  user: UserSummary; // Nested user details (required)
  access_type: "viewer" | "editor"; // Effective access type (case-sensitive enum)
  assigned_at: string; // ISO 8601 format with Z suffix (UTC), e.g., "2024-01-20T10:30:00Z"
  updated_at: string; // ISO 8601 format with Z suffix (UTC), e.g., "2024-01-20T10:35:00Z"
  is_del: boolean; // Soft-delete flag, false if active, true if soft-deleted
}

/**
 * Document Assignment List Items (Pagination Data)
 * Inner structure of paginated list response
 * GET /api/v1/documents/{document_id}/assignments - data field
 */
export interface DocumentAssignmentListItems {
  items: DocumentAssignmentResponse[]; // Array of assignment objects
  total: number; // Total number of items across all pages
  page: number; // Current page number (≥ 1)
  page_size: number; // Number of items per page (1-100)
  total_pages: number; // Total number of pages (calculated: ceil(total / page_size))
  next_page: string | null; // Full relative URL for next page (includes all query parameters) or null if no next page
  prev_page: string | null; // Full relative URL for previous page (includes all query parameters) or null if no previous page
}

/**
 * Document Assignment List Response
 * GET /api/v1/documents/{document_id}/assignments
 * 
 * Returns paginated list of assignments for a document with normalized effective access
 * (one entry per user, Editor overrides Viewer).
 * Only document Owner (user where current_user.id == document.owner_id) or FamilyAdmin (role 'familyadmin') can view assignments.
 */
export interface DocumentAssignmentListResponse extends StandardResponse<DocumentAssignmentListItems> {
  data: DocumentAssignmentListItems;
  message: string;
}

/**
 * Document Assignment Detail Response
 * GET /api/v1/documents/{document_id}/assignments (single item from list)
 * PUT /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Returns single assignment with nested user details.
 */
export interface DocumentAssignmentDetailResponse extends StandardResponse<DocumentAssignmentResponse> {
  data: DocumentAssignmentResponse;
  message: string;
}

/**
 * Failed Assignment Item
 * Represents an assignment that failed validation in bulk operations
 * Structure not fully specified in API spec, but likely contains request item + error info
 */
export interface FailedAssignmentItem {
  user_id: string; // UUID format (RFC 4122 UUID v4), user ID from original request
  access_type: "viewer" | "editor"; // Access type from original request
  error?: string; // Optional error message or code
}

/**
 * Document Assignment Bulk Create Response Data
 * Inner structure for bulk assignment response
 * POST /api/v1/documents/{document_id}/assignments/bulk - data field
 */
export interface DocumentAssignmentBulkCreateData {
  created: DocumentAssignmentResponse[]; // Array of newly created assignments
  updated: DocumentAssignmentResponse[]; // Array of existing assignments that were updated
  failed: FailedAssignmentItem[]; // Array of assignments that failed validation (if partial failure is allowed)
}

/**
 * Document Assignment Bulk Create Response
 * POST /api/v1/documents/{document_id}/assignments/bulk
 * 
 * Response after successfully creating or updating assignments in bulk.
 * If assignment already exists for a user, updates to new access_type.
 * Editor assignment overrides existing viewer assignment.
 */
export interface DocumentAssignmentBulkCreateResponse extends StandardResponse<DocumentAssignmentBulkCreateData> {
  data: DocumentAssignmentBulkCreateData;
  message: string;
}

/**
 * Document Assignment Update Response
 * PUT /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Response after successfully updating an assignment's access_type.
 * Updating viewer to editor upgrades the assignment.
 * Updating editor to viewer retains editor (no change).
 */
export interface DocumentAssignmentUpdateResponse extends StandardResponse<DocumentAssignmentResponse> {
  data: DocumentAssignmentResponse;
  message: string;
}

/**
 * Document Assignment Mutation Response
 * Generic mutation response type for create and update operations
 * Can be used as a union type for POST and PUT responses
 */
export type DocumentAssignmentMutationResponse = 
  | DocumentAssignmentBulkCreateResponse 
  | DocumentAssignmentUpdateResponse;

/**
 * Document Assignment Error Response
 * Re-export from common.responses.ts for convenience
 * Used for assignment-specific error handling
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
export type DocumentAssignmentErrorResponse = APIErrorResponse;

