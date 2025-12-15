/**
 * Account Setup Container Component
 * SCR_ACCOUNT_SETUP - Container with hooks
 * Based on R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AccountSetupForm } from "../components/AccountSetupForm";
import { useActivateAccount } from "../hooks/useInvitations";
import { useValidateInvitation } from "../hooks/useInvitations";
import { useNotificationContext } from "@/contexts/notification.context";
import { InviteActivationValidate } from "../components/InviteActivationValidate";
import { InviteExpired } from "../components/InviteExpired";
import { authRoutes } from "@/utils/routing";
import type { AccountSetupFormSchema } from "../hooks/useAccountSetupForm";

/**
 * Account setup container component
 * Handles business logic and API calls via hooks
 */
export function AccountSetupContainer() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const { addNotification } = useNotificationContext();

  const { data: validationData, isLoading: isValidating } = useValidateInvitation(token);
  const activateMutation = useActivateAccount();

  // Redirect based on validation result
  useEffect(() => {
    if (!isValidating && validationData?.data) {
      const { redirect_target, is_token_valid, is_token_expired } = validationData.data;

      if (!is_token_valid || is_token_expired || redirect_target === "invite_expired") {
        router.replace(`/invite/${token}/expired`);
      }
    }
  }, [validationData, isValidating, token, router]);

  const handleSubmit = async (data: AccountSetupFormSchema) => {
    try {
      await activateMutation.mutateAsync({
        token: token,
        name: data.name,
        password: data.password,
      });

      addNotification({
        type: "success",
        message: "Account activated successfully. Please log in to continue.",
        title: "Welcome!",
      });

      // Redirect to login after a short delay to show the notification
      setTimeout(() => {
        router.replace(authRoutes.login);
      }, 500);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to activate account. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Activation Failed",
      });
    }
  };

  if (isValidating) {
    return <InviteActivationValidate />;
  }

  if (!validationData?.data?.is_token_valid || validationData.data.is_token_expired) {
    return <InviteExpired expiredReason={validationData?.data?.expired_reason || undefined} />;
  }

  return (
    <AccountSetupForm
      onSubmit={handleSubmit}
      isLoading={activateMutation.isPending}
      error={activateMutation.error?.message || null}
      passwordRules={validationData.data.password_rules || undefined}
      email={validationData.data.email || undefined}
    />
  );
}

