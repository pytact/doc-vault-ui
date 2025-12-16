/**
 * Document Service
 * Based on R4-HTTP Client and R8-API Calls & Error Handling rules
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  DocumentCreate,
  DocumentUpdate,
  DocumentListParams,
} from "@/modules/f003-documents/types/requests/document";
import {
  DocumentListResponse,
  DocumentDetailResponse,
  DocumentMutationResponse,
  FileUploadResponse,
} from "@/modules/f003-documents/types/responses/document";

const basePath = "/v1/documents";

/**
 * Convert updated_at timestamp to ETag format
 * 
 * Format: YYYYMMDDTHHMMSSZ (basic ISO-8601 timestamp-derived ETag)
 * Example: "20240120T103000Z" (for "2024-01-20T10:30:00Z")
 * 
 * This format is used for concurrency control via If-Match headers.
 * The eTag represents the document's last modification time.
 * 
 * @param updatedAt - ISO 8601 timestamp string (e.g., "2024-01-20T10:30:00Z")
 * @returns ETag string in YYYYMMDDTHHMMSSZ format (e.g., "20240120T103000Z")
 */
function convertUpdatedAtToETag(updatedAt: string): string {
  try {
    const date = new Date(updatedAt);
    
    // Validate the date is valid
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${updatedAt}`);
    }
    
    // Extract UTC components and format as YYYYMMDDTHHMMSSZ
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    
    const etag = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    
    // Validate format: should be exactly 16 characters (YYYYMMDDTHHMMSSZ)
    if (etag.length !== 16) {
      throw new Error(`Invalid ETag format length: ${etag.length}, expected 16`);
    }
    
    return etag;
  } catch (error) {
    return "";
  }
}

export const DocumentService = {
  /**
   * List documents with pagination, filtering, search, and sorting
   * GET /v1/documents
   * 
   * Returns only documents the user has access to (own documents, shared documents via F-004,
   * or all family documents for FamilyAdmin).
   * 
   * @param params - Query parameters for filtering, pagination, search, and sorting
   * @returns Paginated list of documents
   */
  list: async (params?: DocumentListParams): Promise<DocumentListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.page_size)
        searchParams.append("page_size", params.page_size.toString());
      if (params?.category_id) searchParams.append("category_id", params.category_id);
      if (params?.subcategory_id)
        searchParams.append("subcategory_id", params.subcategory_id);
      if (params?.owner_user_id)
        searchParams.append("owner_user_id", params.owner_user_id);
      if (params?.expiry_date) searchParams.append("expiry_date", params.expiry_date);
      if (params?.search) searchParams.append("search", params.search);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const response = await http.get<DocumentListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get document by ID
   * GET /v1/documents/{document_id}
   * 
   * Returns single document with full metadata, including user's permission level.
   * Also extracts ETag from response headers for concurrency control.
   * 
   * @param documentId - Document UUID
   * @returns Document data and optional ETag from response headers
   */
  getById: async (
    documentId: string
  ): Promise<{ data: DocumentDetailResponse; etag?: string }> => {
    try {
      const response = await http.get<DocumentDetailResponse>(
        `${basePath}/${documentId}`
      );
      
      // Try to get ETag from response headers first
      let etag: string | undefined;
      
      if (response.headers) {
        // Check all possible header name variations
        const rawEtag = (response.headers as any)["etag"] || 
                        (response.headers as any)["ETag"] ||
                        (response.headers as any)["ETAG"];
        
        if (rawEtag) {
          // Clean up ETag from header: remove quotes and whitespace
          // ETag format should be: YYYYMMDDTHHMMSSZ (e.g., "20240120T103000Z")
          etag = String(rawEtag).replace(/^"|"$/g, "").trim();
          
          if (etag.length !== 16 || !/^\d{8}T\d{6}Z$/.test(etag)) {
            // ETag format may be invalid, but continue anyway
          }
        }
      }
      
      if (!etag && response.data?.data?.updated_at) {
        etag = convertUpdatedAtToETag(response.data.data.updated_at);
      }
      
      return {
        data: response.data,
        etag: etag || undefined,
      };
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Create new document with metadata and file
   * POST /v1/documents
   * 
   * Creates a new document with metadata and file in a single multipart/form-data request.
   * 
   * @param payload - Document creation payload (title, category_id, subcategory_id, etc.)
   * @param file - Optional PDF file to upload
   * @returns Created document with metadata
   */
  create: async (
    payload: DocumentCreate,
    file?: File | Blob | null
  ): Promise<DocumentMutationResponse> => {
    try {
      // Always use FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("category_id", payload.category_id);
      formData.append("subcategory_id", payload.subcategory_id);
      formData.append("family_id", payload.family_id);
      
      if (payload.expiry_date) {
        formData.append("expiry_date", payload.expiry_date);
      }
      
      if (payload.details_json) {
        formData.append("details_json", JSON.stringify(payload.details_json));
      }
      
      // Append file if provided
      if (file) {
        formData.append("file", file);
      }
      
      // Don't pass headers - let browser set Content-Type with boundary for multipart/form-data
      // The interceptor will handle removing the default Content-Type header
      const response = await http.post<DocumentMutationResponse>(
        basePath,
        formData
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update document metadata
   * PATCH /v1/documents/{document_id}
   * 
   * Updates document metadata (title, category, subcategory, expiry date, details JSON).
   * All editable metadata fields are editable by Owner, Editor, and FamilyAdmin.
   * 
   * @param documentId - Document UUID
   * @param payload - Document update payload (all fields optional)
   * @param etag - ETag from previous GET request (required for concurrency control)
   * @returns Updated document with metadata
   */
  update: async (
    documentId: string,
    payload: DocumentUpdate,
    etag?: string
  ): Promise<DocumentMutationResponse & { etag?: string }> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for document update operations");
      }

      // Clean eTag: remove any existing quotes and whitespace
      const cleanEtag = String(etag).replace(/^"|"$/g, "").trim();
      
      const ifMatchValue = cleanEtag;
      // Build JSON payload, only including fields that are defined
      const jsonPayload: Record<string, any> = {};
      
      if (payload.title !== undefined) {
        jsonPayload.title = payload.title;
      }
      if (payload.category_id !== undefined) {
        jsonPayload.category_id = payload.category_id;
      }
      if (payload.subcategory_id !== undefined) {
        jsonPayload.subcategory_id = payload.subcategory_id;
      }
      if (payload.expiry_date !== undefined) {
        jsonPayload.expiry_date = payload.expiry_date;
      }
      if (payload.details_json !== undefined) {
        jsonPayload.details_json = payload.details_json;
      }
      
      // Headers with If-Match for concurrency control and Content-Type for JSON
      const headers: Record<string, string> = {
        "If-Match": ifMatchValue,
        "Content-Type": "application/json",
      };

      // Update metadata using JSON
      const response = await http.patch<DocumentMutationResponse>(
        `${basePath}/${documentId}`,
        jsonPayload,
        { headers }
      );
      
      // Extract new ETag from response headers (document was just updated)
      // This avoids needing to make a separate GET request after update
      let newEtag: string | undefined;
      if (response.headers) {
        const rawEtag = (response.headers as any)["etag"] || 
                        (response.headers as any)["ETag"] ||
                        (response.headers as any)["ETAG"];
        if (rawEtag) {
          newEtag = String(rawEtag).replace(/^"|"$/g, "").trim();
        }
      }
      
      // Return response data with new ETag attached
      // This allows the caller to use the new ETag for file replacement without refetching
      return {
        ...response.data,
        etag: newEtag,
      } as DocumentMutationResponse & { etag?: string };
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Soft delete document
   * DELETE /v1/documents/{document_id}
   * 
   * Soft delete document (permanent and irreversible).
   * Sets is_del=true, removes document from access and listings.
   * 
   * @param documentId - Document UUID
   * @param etag - ETag from previous GET request (required for concurrency control)
   * @returns Empty response (204 No Content) or success message
   */
  delete: async (
    documentId: string,
    etag?: string
  ): Promise<void> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for document delete operations");
      }

      // Clean eTag: remove any existing quotes and whitespace
      const cleanEtag = String(etag).replace(/^"|"$/g, "").trim();
      
      const ifMatchValue = cleanEtag;
      
      const headers: Record<string, string> = { "If-Match": ifMatchValue };

      await http.delete(`${basePath}/${documentId}`, { headers });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Upload PDF file for a newly created document
   * POST /v1/documents/{document_id}/file
   * 
   * Two-step workflow: create document first, then upload file.
   * Request body is raw binary PDF file data (NOT JSON-wrapped, NOT multipart/form-data).
   * 
   * @param documentId - Document UUID
   * @param file - PDF file as Blob or File object
   * @returns File upload response with file_path, file_url, file_size, etc.
   */
  uploadFile: async (
    documentId: string,
    file: Blob | File
  ): Promise<FileUploadResponse> => {
    try {
      // Set Content-Type header to application/pdf
      const headers = {
        "Content-Type": "application/pdf",
      };

      const response = await http.post<FileUploadResponse>(
        `${basePath}/${documentId}/file`,
        file,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Replace existing PDF file
   * PUT /v1/documents/{document_id}/file
   * 
   * Replace existing PDF file (overwrite behavior, no versioning).
   * Request body is raw binary PDF file data (NOT JSON-wrapped, NOT multipart/form-data).
   * 
   * @param documentId - Document UUID
   * @param file - PDF file as Blob or File object
   * @param etag - ETag from previous GET request (required for concurrency control)
   * @returns File replacement response with file_path, file_url, file_size, etc.
   */
  replaceFile: async (
    documentId: string,
    file: Blob | File,
    etag?: string
  ): Promise<FileUploadResponse> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for file replacement operations");
      }

      // Clean eTag: remove any existing quotes and whitespace
      const cleanEtag = String(etag).replace(/^"|"$/g, "").trim();
      
      // Use eTag without quotes in If-Match header
      const ifMatchValue = cleanEtag;
      
      // Use FormData for multipart/form-data (matching Swagger behavior)
      const formData = new FormData();
      formData.append("file", file);
      
      const headers: Record<string, string> = {
        "If-Match": ifMatchValue,
      };

      const response = await http.put<FileUploadResponse>(
        `${basePath}/${documentId}/file`,
        formData,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get document file (preview or download)
   * GET /v1/documents/{document_id}/file
   * 
   * Preview or download PDF file (inline viewing or downloadable file access).
   * 
   * @param documentId - Document UUID
   * @param mode - File access mode: "preview" (inline viewing) or "download" (attachment download), default: "preview"
   * @returns Raw binary PDF file data (Blob)
   */
  getFile: async (
    documentId: string,
    mode: "preview" | "download" = "preview"
  ): Promise<Blob> => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("mode", mode);

      const response = await http.get<Blob>(
        `${basePath}/${documentId}/file?${searchParams.toString()}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

