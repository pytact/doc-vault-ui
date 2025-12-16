/**
 * Document Assignment Form Submit Hook
 * Custom hook for document assignment form submission
 * Based on R10 rules
 */

import { useCreateDocumentAssignment } from "../hooks/useDocumentAssignments";
import type { DocumentAssignmentFormSchema } from "./document-assignment.schema";
import type { DocumentAssignmentCreate } from "../types/requests/document-assignment";

interface UseDocumentAssignmentFormSubmitParams {
  documentId: string;
}

/**
 * Document assignment form submit hook
 * Handles document assignment form submission logic
 */
export function useDocumentAssignmentFormSubmit({
  documentId,
}: UseDocumentAssignmentFormSubmitParams) {
  const createMutation = useCreateDocumentAssignment();

  async function submit(values: DocumentAssignmentFormSchema) {
    // Build payload matching API spec
    const payload: DocumentAssignmentCreate = {
      assignments: values.userIds.map((userId) => ({
        user_id: userId,
        access_type: values.accessType,
      })),
    };

    return await createMutation.mutateAsync({
      documentId,
      payload,
    });
  }

  return {
    submit,
    isLoading: createMutation.isPending,
    error: createMutation.error,
  };
}

