/**
 * Notification Response Types
 * Based on API Spec: F05_api_spec.md
 * Domain Model: F05_domain_model.md
 * UI Data Contract: F05_ui_data_contract.md
 * 
 * All response fields match backend API exactly (no renaming).
 */

import type { APIErrorResponse } from "@/types/responses/common.responses";

/**
 * Reminder Type Enum
 * Indicates how far before expiry the reminder was sent
 */
export type ReminderType = "30d" | "7d" | "0d";

/**
 * Notification Entity Response
 * Represents a single notification in API responses
 * Used in: GET /v1/notifications (list items)
 * 
 * Matches NotificationRead schema from API spec exactly.
 */
export interface NotificationResponse {
  id: string; // UUID format (RFC 4122 UUID v4)
  document_id: string; // UUID format (RFC 4122 UUID v4)
  document_title: string; // Document title (resolved dynamically), min 1 character, max 255 characters
  expiry_date: string | null; // ISO 8601 date format (YYYY-MM-DD), UTC timezone, nullable
  category: string; // Category name (resolved dynamically), min 1 character, max 100 characters
  subcategory: string; // Subcategory name (resolved dynamically), min 1 character, max 100 characters
  document_link: string; // URL to document detail page, relative URL format: /v1/documents/{document_id}
  reminder_type: ReminderType; // Enum: "30d", "7d", "0d" (case-sensitive)
  created_at: string; // ISO 8601 format, UTC timezone (Z suffix required)
  updated_at: string; // ISO 8601 format, UTC timezone (Z suffix required)
  is_read: boolean; // Read/unread state, true if read_at is not null, false otherwise
}

/**
 * Notification List Items (Pagination Data)
 * Inner structure of paginated list response
 * GET /v1/notifications - data field
 */
export interface NotificationListItems {
  items: NotificationResponse[]; // Array of NotificationResponse
  total: number; // Total number of notifications across all pages (≥ 0)
  page: number; // Current page number (≥ 1)
  page_size: number; // Page size (1-100)
  total_pages: number; // Total number of pages (≥ 0)
  next_page: string | null; // URL for next page (includes all query parameters) or null if last page, relative URL starting with /
  prev_page: string | null; // URL for previous page (includes all query parameters) or null if first page, relative URL starting with /
}

/**
 * Notification List Response
 * GET /v1/notifications
 * 
 * Returns paginated list of notifications for the current authenticated user.
 * Sorted by createdAt DESC by default.
 * Returns only notifications for Owner and FamilyAdmin roles.
 */
export interface NotificationListResponse {
  data: NotificationListItems;
  message: string;
}

/**
 * Notification Mark Read Response Data
 * Inner structure for mark-as-read response
 * PATCH /v1/notifications/{notification_id}/read - data field
 */
export interface NotificationMarkReadResponseData {
  id: string; // UUID format (RFC 4122 UUID v4), notification ID
  read_at: string; // ISO 8601 format, UTC timezone (Z suffix required), timestamp when notification was marked as read
}

/**
 * Notification Mark Read Response
 * PATCH /v1/notifications/{notification_id}/read
 * 
 * Response after successfully marking a single notification as read.
 */
export interface NotificationMarkReadResponse {
  data: NotificationMarkReadResponseData;
  message: string;
}

/**
 * Notification Mark All Read Response Data
 * Inner structure for mark-all-as-read response
 * PATCH /v1/notifications/read-all - data field
 */
export interface NotificationMarkAllReadResponseData {
  marked_count: number; // Number of notifications marked as read (≥ 0)
}

/**
 * Notification Mark All Read Response
 * PATCH /v1/notifications/read-all
 * 
 * Response after successfully marking all notifications as read for the current user.
 */
export interface NotificationMarkAllReadResponse {
  data: NotificationMarkAllReadResponseData;
  message: string;
}

/**
 * Upcoming Expiry Item Response
 * Represents a document expiring within the next 30 days
 * Used in: GET /v1/notifications/upcoming-expiries
 * 
 * Matches UpcomingExpiryItem schema from API spec exactly.
 */
export interface UpcomingExpiryItemResponse {
  document_id: string; // UUID format (RFC 4122 UUID v4)
  document_title: string; // Document title (resolved dynamically), min 1 character, max 255 characters
  expiry_date: string; // ISO 8601 date format (YYYY-MM-DD), UTC timezone
  category: string; // Category name (resolved dynamically), min 1 character, max 100 characters
  subcategory: string; // Subcategory name (resolved dynamically), min 1 character, max 100 characters
  days_until_expiry: number; // Number of days until expiry (≥ 0, ≤ 30)
}

/**
 * Upcoming Expiry List Response Data
 * Inner structure for upcoming expiries response
 * GET /v1/notifications/upcoming-expiries - data field
 */
export interface UpcomingExpiryListResponseData {
  upcoming_expiries: UpcomingExpiryItemResponse[]; // Array of documents expiring in next 30 days
}

/**
 * Upcoming Expiry List Response
 * GET /v1/notifications/upcoming-expiries
 * 
 * Returns list of documents expiring within the next 30 days for dashboard widget.
 * Owner sees only their own documents.
 * FamilyAdmin sees all documents in the family.
 */
export interface UpcomingExpiryListResponse {
  data: UpcomingExpiryListResponseData;
  message: string;
}

/**
 * Notification Mutation Response
 * Generic response wrapper for mutation operations
 * Used for: PATCH /v1/notifications/{notification_id}/read, PATCH /v1/notifications/read-all
 * 
 * Note: Specific mutation responses (NotificationMarkReadResponse, NotificationMarkAllReadResponse)
 * are preferred for type safety, but this generic type can be used when needed.
 */
export interface NotificationMutationResponse {
  data: NotificationMarkReadResponseData | NotificationMarkAllReadResponseData;
  message: string;
}

/**
 * Notification Error Response
 * Re-export from common.responses.ts for convenience
 * Used for notification-specific error handling
 * 
 * API Error Response Structure:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "details": [{"field": "field_name", "issue": "Error description"}]
 *   },
 *   "message": "Human-friendly error message"
 * }
 * 
 * Error Codes:
 * - UNAUTHENTICATED (401): Missing or invalid JWT token
 * - TOKEN_EXPIRED (401): JWT token has expired
 * - INVALID_TOKEN (401): JWT token is invalid or missing required claims
 * - INSUFFICIENT_PERMISSIONS (403): User role is not Owner or FamilyAdmin, or user doesn't own the notification
 * - NOTIFICATION_NOT_FOUND (404): Notification with specified ID not found
 * - DOCUMENT_NOT_FOUND (404): Document associated with notification not found or soft-deleted
 * - DOCUMENT_DELETED (410): Document associated with notification has been soft-deleted
 * - FAMILY_DELETED (410): Family associated with document has been soft-deleted
 * - PRECONDITION_FAILED (412): ETag mismatch (If-Match header doesn't match current resource version)
 * - PRECONDITION_REQUIRED (428): If-Match header missing but required for update operations
 * - VALIDATION_ERROR (422): Invalid query parameter values (e.g., page < 1, page_size > 100)
 */
export type NotificationErrorResponse = APIErrorResponse;

