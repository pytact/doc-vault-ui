/**
 * Document Request Types
 * Based on API Spec: F03_api_spec.md
 * Domain Model: F03_domain_model.md
 * UI Data Contract: F03_ui_data_contract.md
 */

/**
 * Document Base Interface
 * Represents the base structure of a Document entity
 */
export interface DocumentBase {
  title: string; // Min 1 character, max 255 characters, searchable
  category_id: string; // UUID format (RFC 4122 UUID v4), must exist in F-002 taxonomy
  subcategory_id: string; // UUID format (RFC 4122 UUID v4), must exist in F-002 taxonomy, must belong to selected category
  expiry_date?: string | null; // ISO 8601 format (YYYY-MM-DD), UTC timezone, optional
  details_json?: Record<string, any> | null; // Free-form metadata, valid JSON object, no schema validation, not searchable
}

/**
 * Document Create Request
 * POST /v1/documents
 * 
 * Creates a new document with metadata (without file).
 * Client must immediately call POST /v1/documents/{document_id}/file to upload the PDF.
 */
export interface DocumentCreate extends DocumentBase {
  family_id: string; // UUID format (RFC 4122 UUID v4), required - must equal owner's family
  // All required fields are inherited from DocumentBase
  // title, category_id, subcategory_id are required
  // expiry_date and details_json are optional
}

/**
 * Document Update Request
 * PATCH /v1/documents/{document_id}
 * 
 * Updates document metadata (title, category, subcategory, expiry date, details JSON).
 * All editable metadata fields are editable by Owner, Editor, and FamilyAdmin.
 * 
 * NOTE: ETag is sent in the If-Match header, not in payload.
 * Use null to clear expiry_date or details_json.
 */
export interface DocumentUpdate {
  title?: string | null; // Optional, min 1 character, max 255 characters
  category_id?: string | null; // Optional, UUID format, must exist in F-002 taxonomy
  subcategory_id?: string | null; // Optional, UUID format, must exist in F-002 taxonomy, must belong to selected category
  expiry_date?: string | null; // Optional, ISO 8601 format (YYYY-MM-DD), use null to clear expiry date
  details_json?: Record<string, any> | null; // Optional, valid JSON object, use null to clear details
}

/**
 * Document List Parameters
 * GET /v1/documents
 * 
 * Query parameters for listing documents with pagination, filtering, search, and sorting.
 * Returns only documents the user has access to (own documents, shared documents via F-004,
 * or all family documents for FamilyAdmin).
 */
export interface DocumentListParams {
  page?: number; // Page number (≥ 1), default: 1
  page_size?: number; // Page size (1-100), default: 20
  category_id?: string | null; // Filter by category ID (exact match), UUID format
  subcategory_id?: string | null; // Filter by subcategory ID (exact match), UUID format
  owner_user_id?: string | null; // Filter by owner user ID (exact match), UUID format
  expiry_date?: string | null; // Filter by expiry date (exact match, ISO 8601 format YYYY-MM-DD)
  search?: string | null; // Search query (case-insensitive partial match on title + category/subcategory names from F-002 taxonomy. details_json is NOT searchable)
  sort_by?: string; // Sort field: "created_at", "updated_at", "title", "expiry_date", default: "created_at"
  sort_order?: "asc" | "desc"; // Sort order, default: "desc"
}

