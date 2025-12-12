/**
 * Login Form Submit Hook
 * Custom hook for login form submission
 * Based on R10 rules
 */

import { useLogin } from "@/hooks/useAuth";
import type { LoginFormSchema } from "./login.schema";

/**
 * Login form submit hook
 * Handles login form submission logic
 */
export function useLoginFormSubmit() {
  const loginMutation = useLogin();

  async function submit(values: LoginFormSchema) {
    return await loginMutation.mutateAsync(values);
  }

  return {
    submit,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}

