/**
 * Change Password Form Submit Hook
 * Custom hook for change password form submission
 * Based on R10 rules
 */

import { useChangePassword } from "@/hooks/useProfile";
import type { ChangePasswordFormSchema } from "./changePassword.schema";

/**
 * Change password form submit hook
 * Handles password change form submission logic
 */
export function useChangePasswordFormSubmit() {
  const changePasswordMutation = useChangePassword();

  async function submit(values: ChangePasswordFormSchema) {
    return await changePasswordMutation.mutateAsync({
      current_password: values.current_password,
      new_password: values.new_password,
    });
  }

  return {
    submit,
    isLoading: changePasswordMutation.isPending,
    error: changePasswordMutation.error,
  };
}

