/**
 * Family Form Submit Hook
 * Custom hook for family form submission
 * Based on R10 rules
 */

import { useCreateFamily, useUpdateFamily } from "@/hooks/useFamilies";
import { useFamily } from "@/hooks/useFamilies";
import type { FamilyFormSchema } from "./family.schema";

/**
 * Family form submit hook
 * Handles family create/edit form submission logic
 */
export function useFamilyFormSubmit(familyId?: string) {
  const createMutation = useCreateFamily();
  const updateMutation = useUpdateFamily();
  const { data: familyData } = useFamily(familyId || null);

  async function submit(values: FamilyFormSchema) {
    if (familyId) {
      // Update existing family
      const etag = familyData?.data ? undefined : undefined; // ETag would come from response headers
      return await updateMutation.mutateAsync({
        familyId,
        payload: values,
        etag,
      });
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

