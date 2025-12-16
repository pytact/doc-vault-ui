/**
 * Document Response Types
 * Based on API Spec: F03_api_spec.md
 * Domain Model: F03_domain_model.md
 * 
 * All response fields match backend API exactly (no renaming).
 */

import type { APIErrorResponse } from "@/types/responses/common";

/**
 * Document Permission Enum
 * User's permission level for a document
 */
export type DocumentPermission = "owner" | "editor" | "viewer";

/**
 * Document Entity Response
 * Represents a single document in API responses
 * Used in: GET /v1/documents/{document_id}, POST /v1/documents, PATCH /v1/documents/{document_id}
 * 
 * Matches DocumentRead schema from API spec exactly.
 */
export interface DocumentResponse {
  id: string; // UUID format (RFC 4122 UUID v4), never changes
  family_id: string; // UUID format (RFC 4122 UUID v4), must equal owner's family
  owner_user_id: string; // UUID format (RFC 4122 UUID v4), permanent (set at upload)
  title: string; // Min 1 character, max 255 characters, searchable
  category_id: string; // UUID format (RFC 4122 UUID v4), must exist in F-002 taxonomy
  subcategory_id: string; // UUID format (RFC 4122 UUID v4), must exist in F-002 taxonomy, must belong to selected category
  expiry_date: string | null; // ISO 8601 format (YYYY-MM-DD), UTC timezone, optional
  details_json: Record<string, any> | null; // Free-form metadata, valid JSON object, no schema validation, not searchable, optional
  file_path: string | null; // String path to stored PDF, updated on replacement, null if file not uploaded
  file_size: number | null; // Integer (bytes), must be ≤ 5 MB, null if file not uploaded
  mime_type: string | null; // Must always be "application/pdf" if file uploaded, null if file not uploaded
  is_del: boolean; // Boolean, soft-delete flag, permanent and irreversible
  created_at: string; // ISO 8601 format with Z suffix (UTC), e.g., "2024-01-20T10:30:00Z"
  updated_at: string; // ISO 8601 format with Z suffix (UTC), e.g., "2024-01-20T10:30:00Z"
  created_by: string; // UUID format (RFC 4122 UUID v4)
  updated_by: string; // UUID format (RFC 4122 UUID v4)
  permission: DocumentPermission; // Enum - one of: "owner", "editor", "viewer" (user's permission level for this document)
}

/**
 * Document List Items (Pagination Data)
 * Inner structure of paginated list response
 * GET /v1/documents - data field
 */
export interface DocumentListItems {
  items: DocumentResponse[]; // Array of DocumentResponse
  total: number; // Total number of items across all pages
  page: number; // Current page number (≥ 1)
  page_size: number; // Page size (1-100)
  total_pages: number; // Total number of pages (calculated: ceil(total / page_size))
  next_page: string | null; // URL for next page (includes all query parameters) or null if last page
  prev_page: string | null; // URL for previous page (includes all query parameters) or null if first page
}

/**
 * Document List Response
 * GET /v1/documents
 * 
 * Returns paginated list of documents with filtering, search, and sorting.
 * Returns only documents the user has access to (own documents, shared documents via F-004,
 * or all family documents for FamilyAdmin).
 */
export interface DocumentListResponse {
  data: DocumentListItems;
  message: string;
}

/**
 * Document Detail Response
 * GET /v1/documents/{document_id}
 * 
 * Returns single document with full metadata, including user's permission level.
 */
export interface DocumentDetailResponse {
  data: DocumentResponse;
  message: string;
}

/**
 * Document Mutation Response
 * POST /v1/documents (Create)
 * PATCH /v1/documents/{document_id} (Update)
 * 
 * Standard response wrapper for create and update operations.
 */
export interface DocumentMutationResponse {
  data: DocumentResponse;
  message: string;
}

/**
 * File Upload Response Data
 * Inner structure for file upload/replace responses
 * POST /v1/documents/{document_id}/file
 * PUT /v1/documents/{document_id}/file
 */
export interface FileUploadResponseData {
  file_path: string; // Local filesystem/URL path to stored PDF
  file_url: string; // Full URL to access the file (e.g., "https://cdn.example.com/uploads/f12/d88.pdf")
  file_size: number; // File size in bytes
  content_type: string; // MIME type, always "application/pdf"
  uploaded_at: string; // ISO 8601 format with Z suffix (UTC), e.g., "2024-01-20T10:35:00Z"
}

/**
 * File Upload Response
 * POST /v1/documents/{document_id}/file
 * PUT /v1/documents/{document_id}/file
 * 
 * Response after successfully uploading or replacing a PDF file.
 */
export interface FileUploadResponse {
  data: FileUploadResponseData;
  message: string;
}

/**
 * Document Error Response
 * Re-export from common.ts for convenience
 * Used for document-specific error handling
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
export type DocumentErrorResponse = APIErrorResponse;

