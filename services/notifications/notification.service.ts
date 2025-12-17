/**
 * Notification Service
 * Based on R4-HTTP Client and R8-API Calls & Error Handling rules
 * 
 * NOTE: Notifications are created automatically by the scheduler (not via API).
 * Create, update, and delete operations are not supported by the API.
 * These functions are included for type consistency with R8 rules.
 */

import { httpClient as http } from "@/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import {
  NotificationListParams,
  NotificationMarkReadRequest,
  NotificationMarkAllReadRequest,
} from "@/modules/f005-notifications/types/requests/notification";
import {
  NotificationListResponse,
  NotificationMarkReadResponse,
  NotificationMarkAllReadResponse,
  UpcomingExpiryListResponse,
} from "@/modules/f005-notifications/types/responses/notification";

const basePath = "/v1/notifications";

/**
 * Convert updated_at timestamp to ETag format
 * 
 * Format: YYYYMMDDTHHMMSSZ (basic ISO-8601 timestamp-derived ETag)
 * Example: "20240120T103000Z" (for "2024-01-20T10:30:00Z")
 * 
 * This format is used for concurrency control via If-Match headers.
 * The eTag represents the notification's last modification time.
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

export const NotificationService = {
  /**
   * List notifications with pagination and sorting
   * GET /v1/notifications
   * 
   * Returns paginated list of notifications for the current authenticated user.
   * Sorted by createdAt DESC by default.
   * Returns only notifications for Owner and FamilyAdmin roles.
   * 
   * @param params - Query parameters for pagination and sorting
   * @returns Paginated list of notifications
   */
  list: async (params?: NotificationListParams): Promise<NotificationListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.page_size)
        searchParams.append("page_size", params.page_size.toString());
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const response = await http.get<NotificationListResponse>(url);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get notification by ID
   * 
   * NOTE: Individual notification retrieval (GET /v1/notifications/{notification_id}) 
   * is NOT provided by the API. Clients should use the list endpoint and filter by ID 
   * if needed, or access notification details through the document link.
   * 
   * This function is included for type consistency with R8 rules but will throw an error
   * indicating the endpoint is not available.
   * 
   * @param notificationId - Notification UUID
   * @throws Error indicating endpoint is not available
   */
  getById: async (notificationId: string): Promise<never> => {
    throw new Error(
      "GET /v1/notifications/{notification_id} is not supported. Use list() and filter by ID, or access notification details through the document link."
    );
  },

 
  /**
   * Update notification
   * 
   * NOTE: Notifications are NOT updated via API. The only update operation available 
   * is marking as read (use markAsRead() instead). This function is included for 
   * type consistency with R8 rules but will throw an error indicating the operation 
   * is not supported.
   * 
   * @throws Error indicating operation is not supported
   */
  update: async (): Promise<never> => {
    throw new Error(
      "Notifications cannot be updated via API. Use markAsRead() to mark a notification as read."
    );
  },

 

  /**
   * Mark a single notification as read
   * PATCH /v1/notifications/{notification_id}/read
   * 
   * Marks a single notification as read for the current authenticated user.
   * Requires If-Match header for concurrency control (ETag from GET response).
   * Sends { is_read: true } in the request body.
   * 
   * @param notificationId - Notification UUID
   * @param etag - ETag from previous GET response (required for concurrency control)
   * @returns Notification mark read response with id and read_at timestamp
   */
  markAsRead: async (
    notificationId: string,
    etag?: string
  ): Promise<NotificationMarkReadResponse & { etag?: string }> => {
    try {
      if (!etag) {
        throw new Error("ETag is required for notification mark-as-read operations");
      }

      // Clean eTag: remove any existing quotes and whitespace
      const cleanEtag = String(etag).replace(/^"|"$/g, "").trim();
      
      const ifMatchValue = cleanEtag;
      
      // Headers with If-Match for concurrency control
      const headers: Record<string, string> = {
        "If-Match": ifMatchValue,
      };

      // Request body with is_read: true
      const payload: NotificationMarkReadRequest = {
        is_read: true,
      };

      const response = await http.patch<NotificationMarkReadResponse>(
        `${basePath}/${notificationId}/read`,
        payload,
        { headers }
      );
      
      // Extract new ETag from response headers (notification was just updated)
      let newEtag: string | undefined;
      if (response.headers) {
        const rawEtag = (response.headers as any)["etag"] || 
                        (response.headers as any)["ETag"] ||
                        (response.headers as any)["ETAG"];
        if (rawEtag) {
          newEtag = String(rawEtag).replace(/^"|"$/g, "").trim();
        }
      }
      
      // If no ETag in headers, try to derive from response data
      if (!newEtag && response.data?.data?.read_at) {
        // Use read_at timestamp to generate ETag (approximation)
        // Note: This is not ideal, but works if backend doesn't send ETag
        newEtag = convertUpdatedAtToETag(response.data.data.read_at);
      }
      
      return {
        ...response.data,
        etag: newEtag,
      } as NotificationMarkReadResponse & { etag?: string };
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Mark all notifications as read
   * PATCH /v1/notifications/read-all
   * 
   * Marks all notifications as read for the current authenticated user.
   * Sends { is_read: true } in the request body.
   * No ETag required.
   * 
   * @returns Notification mark all read response with marked_count
   */
  markAllAsRead: async (): Promise<NotificationMarkAllReadResponse> => {
    try {
      // Request body with is_read: true
      const payload: NotificationMarkAllReadRequest = {
        is_read: true,
      };

      const response = await http.patch<NotificationMarkAllReadResponse>(
        `${basePath}/read-all`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get upcoming expiries for dashboard widget
   * GET /v1/notifications/upcoming-expiries
   * 
   * Returns list of documents expiring within the next 30 days for dashboard widget.
   * Owner sees only their own documents.
   * FamilyAdmin sees all documents in the family.
   * 
   * @returns List of documents expiring in next 30 days
   */
  getUpcomingExpiries: async (): Promise<UpcomingExpiryListResponse> => {
    try {
      const response = await http.get<UpcomingExpiryListResponse>(
        `${basePath}/upcoming-expiries`
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

