/**
 * Document Assignment Hooks
 * Based on R5-Custom Hooks and R9-Caching rules
 * API Spec: F04_api_spec.md
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { DocumentAssignmentService } from "@/services/documents/document-assignment.service";
import {
  DocumentAssignmentCreate,
  DocumentAssignmentUpdate,
  DocumentAssignmentListParams,
} from "../types/requests/document-assignment";
import {
  DocumentAssignmentListResponse,
  DocumentAssignmentDetailResponse,
  DocumentAssignmentBulkCreateResponse,
  DocumentAssignmentUpdateResponse,
} from "../types/responses/document-assignment";

/**
 * Document assignment list query hook
 * GET /api/v1/documents/{document_id}/assignments
 * 
 * Returns paginated list of assignments for a document with normalized effective access
 * (one entry per user, Editor overrides Viewer).
 * Only document Owner (user where current_user.id == document.owner_id) or FamilyAdmin (role 'familyadmin') can view assignments.
 * 
 * @param documentId - Document identifier (UUID)
 * @param params - Query parameters for pagination, filtering, and sorting
 * @returns React Query result with paginated assignment list
 */
export function useListDocumentAssignments(
  documentId: string | null,
  params?: DocumentAssignmentListParams
) {
  return useQuery({
    queryKey: [
      "document-assignments",
      documentId,
      params?.page,
      params?.page_size,
      params?.access_type,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => {
      if (!documentId) throw new Error("Document ID is required");
      return DocumentAssignmentService.list(documentId, params);
    },
    enabled: !!documentId,
    staleTime: 30_000, // 30 seconds - assignment lists update frequently (R9: List Data = 30 seconds)
    gcTime: 5 * 60 * 1000, // 5 minutes (R9: Standard gcTime)
    placeholderData: keepPreviousData, // Keep previous data while fetching new page (R9: Pagination)
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

/**
 * Document assignment detail query hook
 * Uses list endpoint to get specific assignment by user ID
 * 
 * Returns single assignment with nested user details and ETag.
 * This is a convenience method since the API doesn't have a direct GET by user_id endpoint.
 * 
 * @param documentId - Document identifier (UUID)
 * @param userId - User identifier (UUID)
 * @returns React Query result with assignment data and ETag
 */
export function useGetDocumentAssignment(
  documentId: string | null,
  userId: string | null
) {
  return useQuery({
    queryKey: ["document-assignment", documentId, userId],
    queryFn: () => {
      if (!documentId) throw new Error("Document ID is required");
      if (!userId) throw new Error("User ID is required");
      return DocumentAssignmentService.getById(documentId, userId);
    },
    enabled: !!documentId && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - assignment details are relatively stable (R9: Detail Data = 5 minutes)
    gcTime: 10 * 60 * 1000, // 10 minutes (R9: Standard gcTime for detail views)
    refetchOnWindowFocus: true, // Refetch on focus to get latest changes (important for assignment details)
  });
}

/**
 * Create document assignment mutation hook (bulk)
 * POST /api/v1/documents/{document_id}/assignments/bulk
 * 
 * Creates one or more assignments (bulk assignment with array input for multiple users).
 * If assignment already exists for a user, updates to new access_type.
 * Editor assignment overrides existing viewer assignment.
 * 
 * @returns React Query mutation with cache invalidation
 */
export function useCreateDocumentAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      payload,
    }: {
      documentId: string;
      payload: DocumentAssignmentCreate;
    }) => DocumentAssignmentService.create(documentId, payload),
    onSuccess: (data, variables) => {
      // Invalidate assignment list queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["document-assignments", variables.documentId],
      });
      // Invalidate specific assignment queries for users that were assigned
      data.data.created.forEach((assignment) => {
        queryClient.invalidateQueries({
          queryKey: [
            "document-assignment",
            variables.documentId,
            assignment.assign_to_user_id,
          ],
        });
      });
      data.data.updated.forEach((assignment) => {
        queryClient.invalidateQueries({
          queryKey: [
            "document-assignment",
            variables.documentId,
            assignment.assign_to_user_id,
          ],
        });
      });
    },
  });
}

/**
 * Update document assignment mutation hook
 * PUT /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Updates a specific assignment by user ID (changes access_type).
 * Updating viewer to editor upgrades the assignment.
 * Updating editor to viewer retains editor (no change).
 * 
 * @returns React Query mutation with cache invalidation and ETag handling
 */
export function useUpdateDocumentAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      userId,
      payload,
      etag,
    }: {
      documentId: string;
      userId: string;
      payload: DocumentAssignmentUpdate;
      etag?: string;
    }) => DocumentAssignmentService.update(documentId, userId, payload, etag),
    onSuccess: (data, variables) => {
      // Invalidate assignment list queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["document-assignments", variables.documentId],
      });
      // Invalidate specific assignment query to refresh detail view
      queryClient.invalidateQueries({
        queryKey: [
          "document-assignment",
          variables.documentId,
          variables.userId,
        ],
      });
    },
  });
}

/**
 * Delete document assignment mutation hook
 * DELETE /api/v1/documents/{document_id}/assignments/{user_id}
 * 
 * Removes a specific assignment by user ID.
 * Access is immediately revoked after successful deletion.
 * 
 * @returns React Query mutation with cache invalidation and ETag handling
 */
export function useDeleteDocumentAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      userId,
      etag,
    }: {
      documentId: string;
      userId: string;
      etag?: string;
    }) => DocumentAssignmentService.delete(documentId, userId, etag),
    onSuccess: (data, variables) => {
      // Invalidate assignment list queries to remove deleted assignment from list
      queryClient.invalidateQueries({
        queryKey: ["document-assignments", variables.documentId],
      });
      // Remove specific assignment from cache (it's deleted)
      queryClient.removeQueries({
        queryKey: [
          "document-assignment",
          variables.documentId,
          variables.userId,
        ],
      });
    },
  });
}

