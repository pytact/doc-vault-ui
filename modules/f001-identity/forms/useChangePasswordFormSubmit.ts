/**
 * Change Password Form Submit Hook
 * Custom hook for change password form submission
 * Based on R10 rules
 */

import { useChangePassword } from "../hooks/useProfile";
import { useProfile } from "../hooks/useProfile";
import type { ChangePasswordFormSchema } from "./changePassword.schema";

/**
 * Change password form submit hook
 * Handles password change form submission logic
 */
export function useChangePasswordFormSubmit() {
  const changePasswordMutation = useChangePassword();
  const { data: profileData } = useProfile();

  async function submit(values: ChangePasswordFormSchema) {
    // Use existing ETag from already-loaded profile data (no refetch needed)
    const etag = profileData?.etag;
    if (!etag) {
      throw new Error("ETag is required for password change. Please refresh the page and try again.");
    }

    // Get current name from profile data to include in update (prevents name from being changed)
    const currentName = profileData?.data?.data?.name;
    if (!currentName) {
      throw new Error("Could not retrieve current profile name. Please refresh the page and try again.");
    }

    return await changePasswordMutation.mutateAsync({
      current_password: values.current_password,
      new_password: values.new_password,
      etag,
      currentName,
    });
  }

  return {
    submit,
    isLoading: changePasswordMutation.isPending,
    error: changePasswordMutation.error,
  };
}

