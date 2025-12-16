/**
 * Document Hooks
 * Based on R5-Custom Hooks and R9-Caching rules
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { DocumentService } from "@/services/documents/document.service";
import {
  DocumentCreate,
  DocumentUpdate,
  DocumentListParams,
} from "../types/requests/document";
import {
  DocumentListResponse,
  DocumentDetailResponse,
  DocumentMutationResponse,
} from "../types/responses/document";

/**
 * Document list query hook
 * GET /v1/documents
 * 
 * Returns paginated list of documents with filtering, search, and sorting.
 * Returns only documents the user has access to (own documents, shared documents via F-004,
 * or all family documents for FamilyAdmin).
 * 
 * @param params - Query parameters for filtering, pagination, search, and sorting
 * @returns React Query result with paginated document list
 */
export function useListDocuments(params?: DocumentListParams) {
  return useQuery({
    queryKey: [
      "documents",
      params?.page,
      params?.page_size,
      params?.category_id,
      params?.subcategory_id,
      params?.owner_user_id,
      params?.expiry_date,
      params?.search,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => DocumentService.list(params),
    staleTime: 30_000, // 30 seconds - lists update frequently (R14: List Data = 30 seconds)
    gcTime: 5 * 60 * 1000, // 5 minutes (R14: Standard gcTime)
    placeholderData: keepPreviousData, // Keep previous data while fetching new page (R14: Pagination)
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

/**
 * Document detail query hook
 * GET /v1/documents/{document_id}
 * 
 * Returns single document with full metadata, including user's permission level.
 * Also extracts ETag from response headers for concurrency control.
 * 
 * @param documentId - Document UUID
 * @returns React Query result with document data and ETag
 */
export function useGetDocument(documentId: string | null) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) throw new Error("Document ID is required");
      const result = await DocumentService.getById(documentId);
      return {
        data: result.data,
        etag: result.etag,
      };
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - document details are relatively stable (R14: Detail Data = 5 minutes)
    gcTime: 10 * 60 * 1000, // 10 minutes (R14: Standard gcTime for detail views)
    refetchOnWindowFocus: true, // Refetch on focus to get latest changes (important for document details)
  });
}

/**
 * Create document mutation hook
 * POST /v1/documents
 * 
 * Creates a new document with metadata (without file).
 * Client must immediately call uploadFile() to upload the PDF.
 * 
 * @returns React Query mutation with cache invalidation
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      file,
    }: {
      payload: DocumentCreate;
      file?: File | Blob | null;
    }) => DocumentService.create(payload, file),
    onSuccess: () => {
      // Invalidate document list queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

/**
 * Update document mutation hook
 * PATCH /v1/documents/{document_id}
 * 
 * Updates document metadata (title, category, subcategory, expiry date, details JSON).
 * All editable metadata fields are editable by Owner, Editor, and FamilyAdmin.
 * 
 * @returns React Query mutation with cache invalidation and ETag handling
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      payload,
      etag,
    }: {
      documentId: string;
      payload: DocumentUpdate;
      etag?: string;
    }) => DocumentService.update(documentId, payload, etag),
    onSuccess: (data, variables) => {
      // Invalidate document list queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      // Invalidate specific document query to refresh detail view
      queryClient.invalidateQueries({ queryKey: ["document", variables.documentId] });
    },
  });
}

/**
 * Delete document mutation hook
 * DELETE /v1/documents/{document_id}
 * 
 * Soft delete document (permanent and irreversible).
 * Sets is_del=true, removes document from access and listings.
 * 
 * @returns React Query mutation with cache invalidation and ETag handling
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      etag,
    }: {
      documentId: string;
      etag?: string;
    }) => DocumentService.delete(documentId, etag),
    onSuccess: (data, variables) => {
      // Invalidate document list queries to remove deleted document from list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      // Remove specific document from cache (it's deleted)
      queryClient.removeQueries({ queryKey: ["document", variables.documentId] });
    },
  });
}

