/**
 * Account Setup Form Submit Hook
 * Custom hook for account setup form submission
 * Based on R10 rules
 */

import { useActivateAccount } from "@/hooks/useInvitations";
import type { AccountSetupFormSchema } from "./accountSetup.schema";

/**
 * Account setup form submit hook
 * Handles account activation form submission logic
 */
export function useAccountSetupFormSubmit() {
  const activateMutation = useActivateAccount();

  async function submit(values: AccountSetupFormSchema) {
    return await activateMutation.mutateAsync({
      invite_token: values.invite_token,
      name: values.name,
      password: values.password,
    });
  }

  return {
    submit,
    isLoading: activateMutation.isPending,
    error: activateMutation.error,
  };
}

