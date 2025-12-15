/**
 * Invite User Form Submit Hook
 * Custom hook for invite user form submission
 * Based on R10 rules
 */

import { useInviteUser } from "../hooks/useUsers";
import { useFamilyContext } from "@/contexts/family.context";
import type { InviteUserFormSchema } from "./inviteUser.schema";

/**
 * Invite user form submit hook
 * Handles invite user form submission logic
 */
export function useInviteUserFormSubmit() {
  const inviteMutation = useInviteUser();
  const { familyId } = useFamilyContext();

  async function submit(values: InviteUserFormSchema) {
    if (!familyId) {
      throw new Error("Family ID is required");
    }
    return await inviteMutation.mutateAsync({
      familyId,
      payload: values,
    });
  }

  return {
    submit,
    isLoading: inviteMutation.isPending,
    error: inviteMutation.error,
  };
}

