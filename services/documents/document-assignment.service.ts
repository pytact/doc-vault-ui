/**
 * Document Assignment Service
 * Based on R4-HTTP Client and R8-API Calls & Error Handling rules
 * API Spec: F04_api_spec.md
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  DocumentAssignmentCreate,
  DocumentAssignmentUpdate,
  DocumentAssignmentListParams,
} from "@/modules/f004-sharing/types/requests/document-assignment";
import {
  DocumentAssignmentListResponse,
  DocumentAssignmentDetailResponse,
  DocumentAssignmentBulkCreateResponse,
  DocumentAssignmentUpdateResponse,
} from "@/modules/f004-sharing/types/responses/document-assignment";

const basePath = "/v1/documents";

/**
 * Document Assignment Service
 * Provides methods for managing document assignments (sharing)
 * All methods require Document Owner or FamilyAdmin permissions
 */
export const DocumentAssignmentService = {
  /**
   * List all assignments for a document with pagination and filtering
   * GET /api/v1/documents/{document_id}/assignments
   * 
   * Returns normalized assignments (one entry per user with effective access_type - editor overrides viewer).
   * Only document Owner (user where current_user.id == document.owner_id) or FamilyAdmin (role 'familyadmin') can view assignments.
   * 
   * @param documentId - Document identifier (UUID)
   * @param params - Query parameters for pagination, filtering, and sorting
   * @returns Paginated list of document assignments
   */
  list: async (
    documentId: string,
    params?: DocumentAssignmentListParams
  ): Promise<DocumentAssignmentListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.page_size)
        searchParams.append("page_size", params.page_size.toString());
      if (params?.access_type) searchParams.append("access_type", params.access_type);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order) searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString
        ? `${basePath}/${documentId}/assignments?${queryString}`
        : `${basePath}/${documentId}/assignments`;

      const response = await http.get<DocumentAssignmentListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Convert updated_at timestamp to ETag format
   * Format: YYYYMMDDTHHMMSSZ (basic ISO-8601 timestamp-derived ETag)
   */
  convertUpdatedAtToETag(updatedAt: string): string {
    try {
      const date = new Date(updatedAt);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${updatedAt}`);
      }
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    } catch (error) {
      return "";
    }
  },

  /**
   * Get a specific assignment by document ID and user ID
   * Note: The API doesn't have a direct GET by ID endpoint, but we can filter the list
   * This is a convenience method that uses the list endpoint with filtering
   * 
   * @param documentId - Document identifier (UUID)
   * @param userId - User identifier (UUID)
   * @returns Single assignment with ETag if found, or throws error if not found
   */
  getById: async (
    documentId: string,
    userId: string
  ): Promise<DocumentAssignmentDetailResponse & { etag?: string }> => {
    try {
      // Use list endpoint and filter client-side (or use list with access_type filter)
      // Since API doesn't provide direct GET by user_id, we list and find the user
      const listResponse = await DocumentAssignmentService.list(documentId);
      
      const assignment = listResponse.data.items.find(
        (item) => item.assign_to_user_id === userId
      );

      if (!assignment) {
        throw {
          response: {
            data: {
              error: {
                code: "ASSIGNMENT_NOT_FOUND",
                details: [
                  {
                    field: "user_id",
                    issue: "Assignment for the specified user not found or has been deleted.",
                  },
                ],
              },
              message: "Assignment not found.",
            },
            status: 404,
          },
        };
      }

      // Generate ETag from updated_at field for concurrency control
      const etag = assignment.updated_at 
        ? DocumentAssignmentService.convertUpdatedAtToETag(assignment.updated_at)
        : undefined;

      return {
        data: assignment,
        message: "Assignment retrieved successfully",
        etag,
      };
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Create one or more assignments (bulk assignment)
   * POST /api/v1/documents/{document_id}/assignments/bulk
   * 
   * Creates assignments for multiple users in a single request.
   * If assignment already exists for a user, updates to new access_type.
   * Editor assignment overrides existing viewer assignment.
   * Self-assignment is blocked (cannot assign to document owner).
   * All users must be in the same Family as the document.
   * Maximum 100 assignments per request.
   * 
   * @param documentId - Document identifier (UUID)
   * @param payload - Bulk assignment request payload
   * @returns Response with created, updated, and failed arrays
   */
  create: async (
    documentId: string,
    payload: DocumentAssignmentCreate
  ): Promise<DocumentAssignmentBulkCreateResponse> => {
    try {
      const response = await http.post<DocumentAssignmentBulkCreateResponse>(
        `${basePath}/${documentId}/assignments/bulk`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update a specific assignment by user ID (change access_type)
   * PUT /api/v1/documents/{document_id}/assignments/{user_id}
   * 
   * Updates an assignment's access_type.
   * Updating viewer to editor upgrades the assignment.
   * Updating editor to viewer retains editor (no change).
   * Self-assignment update is blocked.
   * Document must be Active (not soft-deleted).
   * User must be in the same Family as the document.
   * 
   * @param documentId - Document identifier (UUID)
   * @param userId - User identifier (UUID) whose assignment should be updated
   * @param payload - Update request payload (access_type)
   * @param etag - Optional ETag for concurrency control (If-Match header)
   * @returns Updated assignment response
   */
  update: async (
    documentId: string,
    userId: string,
    payload: DocumentAssignmentUpdate,
    etag?: string
  ): Promise<DocumentAssignmentUpdateResponse> => {
    try {
      const headers: Record<string, string> = {};
      if (etag) {
        headers["If-Match"] = etag;
      }

      const response = await http.put<DocumentAssignmentUpdateResponse>(
        `${basePath}/${documentId}/assignments/${userId}`,
        payload,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Remove a specific assignment by user ID
   * DELETE /api/v1/documents/{document_id}/assignments/{user_id}
   * 
   * Removes an assignment, immediately revoking access.
   * After successful deletion, assigned user immediately loses access.
   * Subsequent API calls for document access (preview, download, edit) will fail with 403 Forbidden.
   * Document disappears from assigned user's document listings.
   * 
   * @param documentId - Document identifier (UUID)
   * @param userId - User identifier (UUID) whose assignment should be removed
   * @param etag - Optional ETag for concurrency control (If-Match header)
   * @returns No content (204) on success
   */
  delete: async (
    documentId: string,
    userId: string,
    etag?: string
  ): Promise<void> => {
    try {
      const headers: Record<string, string> = {};
      if (etag) {
        headers["If-Match"] = etag;
      }

      const url = `${basePath}/${documentId}/assignments/${userId}`;
      
      await http.delete(url, {
        headers,
      });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

