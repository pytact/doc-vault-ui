/**
 * Bulk Delete Document Assignments Hook
 * Based on R5 and R8 rules
 * Handles bulk deletion of multiple assignments
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentAssignmentService } from "@/services/documents/document-assignment.service";
import { useNotificationContext } from "@/contexts/notification.context";

interface BulkDeleteParams {
  documentId: string;
  userIds: string[];
}

interface BulkDeleteResult {
  success: string[];
  failed: Array<{ userId: string; error: string }>;
}

/**
 * Bulk delete document assignments mutation hook
 * Deletes multiple assignments by calling the delete API for each user ID
 * 
 * @returns React Query mutation with cache invalidation
 */
export function useBulkDeleteAssignments() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationContext();

  return useMutation({
    mutationFn: async ({ documentId, userIds }: BulkDeleteParams): Promise<BulkDeleteResult> => {
      const results: BulkDeleteResult = {
        success: [],
        failed: [],
      };

      // Delete all assignments in parallel
      const deletePromises = userIds.map(async (userId) => {
        try {
          await DocumentAssignmentService.delete(documentId, userId);
          results.success.push(userId);
          return { userId, success: true };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : typeof error === "object" && error !== null && "message" in error
              ? String(error.message)
              : "Unknown error";
          results.failed.push({ userId, error: errorMessage });
          return { userId, success: false, error: errorMessage };
        }
      });

      await Promise.allSettled(deletePromises);

      return results;
    },
    onSuccess: (data, variables) => {
      // Invalidate assignment list queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["document-assignments", variables.documentId],
      });

      // Remove specific assignment queries from cache
      variables.userIds.forEach((userId) => {
        queryClient.removeQueries({
          queryKey: ["document-assignment", variables.documentId, userId],
        });
      });

      // Show notification based on results
      const successCount = data.success.length;
      const failedCount = data.failed.length;

      if (failedCount === 0) {
        addNotification({
          type: "success",
          message: `Successfully removed access for ${successCount} ${successCount === 1 ? "user" : "users"}.`,
          title: "Access Removed",
        });
      } else if (successCount > 0) {
        addNotification({
          type: "warning",
          message: `Removed access for ${successCount} ${successCount === 1 ? "user" : "users"}, but ${failedCount} ${failedCount === 1 ? "failed" : "failed"}.`,
          title: "Partial Success",
        });
      } else {
        addNotification({
          type: "error",
          message: `Failed to remove access for all ${failedCount} ${failedCount === 1 ? "user" : "users"}.`,
          title: "Remove Failed",
        });
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove access. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Bulk Remove Failed",
      });
    },
  });
}

