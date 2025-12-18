/**
 * User Reassignment Form Submit Hook
 * Custom hook for user reassignment form submission
 * Based on R10 rules
 */

import { useReassignUser } from "../hooks/useSuperAdminUsers";
import type { UserReassignmentFormSchema } from "./userReassignment.schema";

interface UseUserReassignmentFormSubmitParams {
  userId: string;
  etag: string;
}

/**
 * User reassignment form submit hook
 * Handles user reassignment form submission logic
 */
export function useUserReassignmentFormSubmit({
  userId,
  etag,
}: UseUserReassignmentFormSubmitParams) {
  const reassignMutation = useReassignUser();

  async function submit(values: UserReassignmentFormSchema) {
    if (!etag) {
      throw new Error(
        "ETag is required for reassignment operations. Please refresh the page and try again."
      );
    }

    try {
      const result = await reassignMutation.mutateAsync({
        userId,
        payload: {
          family_id: values.family_id,
          role_id: values.role_id || null,
        },
        etag,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  return {
    submit,
    isLoading: reassignMutation.isPending,
    error: reassignMutation.error,
  };
}

