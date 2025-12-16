/**
 * Document Assignment Request Types
 * Based on API Spec: F04_api_spec.md
 * Domain Model: F04_domain_model.md
 * UI Data Contract: F04_ui_data_contract.md
 */

/**
 * Assignment Item
 * Represents a single assignment in a bulk assignment request
 */
export interface AssignmentItem {
  user_id: string; // UUID format (RFC 4122 UUID v4), required - must be in same Family, cannot be document owner
  access_type: "viewer" | "editor"; // Required, case-sensitive enum
}

/**
 * Document Assignment Create Request (Bulk)
 * POST /api/v1/documents/{document_id}/assignments/bulk
 * 
 * Creates one or more assignments (bulk assignment with array input for multiple users).
 * If assignment already exists for a user, updates to new access_type.
 * Editor assignment overrides existing viewer assignment.
 * Self-assignment is blocked (cannot assign to document owner).
 * All users must be in the same Family as the document.
 * Maximum 100 assignments per request.
 */
export interface DocumentAssignmentCreate {
  assignments: AssignmentItem[]; // Required, min 1 item, max 100 items
}

/**
 * Document Assignment Update Request
 * PUT /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Updates a specific assignment by user ID (changes access_type).
 * Updating viewer to editor upgrades the assignment.
 * Updating editor to viewer retains editor (no change).
 * Self-assignment update is blocked.
 * Document must be Active (not soft-deleted).
 * User must be in the same Family as the document.
 */
export interface DocumentAssignmentUpdate {
  access_type: "viewer" | "editor"; // Required, case-sensitive enum
}

/**
 * Document Assignment List Parameters
 * GET /api/v1/documents/{document_id}/assignments
 * 
 * Query parameters for listing document assignments with pagination and filtering.
 * Returns normalized assignments (one entry per user with effective access_type - editor overrides viewer).
 * Only document Owner (user where current_user.id == document.owner_id) or FamilyAdmin (role 'familyadmin') can view assignments.
 */
export interface DocumentAssignmentListParams {
  page?: number; // Page number (≥ 1), default: 1, optional
  page_size?: number; // Page size (1-100), default: 20, optional
  access_type?: string | null; // Filter by access type: "viewer" or "editor", optional
  sort_by?: string; // Sort field: "assigned_at", "updated_at", "access_type", default: "assigned_at", optional
  sort_order?: "asc" | "desc"; // Sort order, default: "desc", optional
}

