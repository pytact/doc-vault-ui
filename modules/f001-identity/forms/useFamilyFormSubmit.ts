/**
 * Family Form Submit Hook
 * Custom hook for family form submission
 * Based on R10 rules
 */

import { useCreateFamily, useUpdateFamily } from "../hooks/useFamilies";
import { useFamily } from "../hooks/useFamilies";
import type { FamilyFormSchema } from "./family.schema";

/**
 * Family form submit hook
 * Handles family create/edit form submission logic
 */
export function useFamilyFormSubmit(familyId?: string) {
  const createMutation = useCreateFamily();
  const updateMutation = useUpdateFamily();
  const { data: familyData, refetch: refetchFamily } = useFamily(familyId || null);

  async function submit(values: FamilyFormSchema) {
    if (familyId) {
      // Refetch to get the latest ETag before update
      console.log("useFamilyFormSubmit - Refetching family to get latest ETag...");
      const freshData = await refetchFamily();
      const etag = freshData.data?.etag || familyData?.etag;
      
      console.log("useFamilyFormSubmit - Family update - familyId:", familyId, "etag:", etag, "payload:", values);
      
      if (!etag) {
        throw new Error("ETag is required for update operations. Please refresh the page and try again.");
      }
      
      try {
        const result = await updateMutation.mutateAsync({
          familyId,
          payload: values,
          etag,
        });
        console.log("useFamilyFormSubmit - Family update successful:", result);
        return result;
      } catch (error) {
        console.error("useFamilyFormSubmit - Family update error:", error);
        throw error;
      }
    } else {
      // Create new family
      return await createMutation.mutateAsync(values);
    }
  }

  return {
    submit,
    isLoading: familyId ? updateMutation.isPending : createMutation.isPending,
    error: familyId ? updateMutation.error : createMutation.error,
  };
}

