/**
 * Account Setup Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountSetupForm } from "./accountSetup.form";
import {
  createAccountSetupSchema,
  accountSetupDefaultValues,
  type AccountSetupFormSchema,
} from "./accountSetup.schema";
import { useAccountSetupFormSubmit } from "./useAccountSetupFormSubmit";
import { useValidateInvitation } from "../hooks/useInvitations";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { InviteActivationValidate } from "../components/InviteActivationValidate";
import { InviteExpired } from "../components/InviteExpired";
import { authRoutes, invitationRoutes } from "@/utils/routing";

/**
 * Account setup form container component
 * Handles business logic, API calls, and error mapping
 */
export function AccountSetupFormContainer() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;
  const { addNotification } = useNotificationContext();

  const { data: validationData, isLoading: isValidating } = useValidateInvitation(token);
  const { submit, isLoading, error } = useAccountSetupFormSubmit();

  const schema = createAccountSetupSchema(validationData?.data?.password_rules || undefined);
  const form = useForm<AccountSetupFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...accountSetupDefaultValues,
      invite_token: token,
    },
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  // Redirect based on validation result
  useEffect(() => {
    if (!isValidating && validationData?.data) {
      const { redirect_target, is_token_valid, is_token_expired } = validationData.data;

      if (!is_token_valid || is_token_expired || redirect_target === "invite_expired") {
        router.replace(invitationRoutes.expired(token));
      }
    }
  }, [validationData, isValidating, token, router]);

  const handleSubmit = async (values: AccountSetupFormSchema) => {
    try {
      await submit(values);
      addNotification({
        type: "success",
        message: "Account activated successfully. Please log in to continue.",
        title: "Welcome!",
      });
      
      // Redirect to login after a short delay to show the notification
      setTimeout(() => {
        router.replace(authRoutes.login);
      }, 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
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
      isLoading={isLoading}
      error={error?.message || null}
      passwordRules={validationData.data.password_rules || undefined}
      email={validationData.data.email || undefined}
      inviteToken={token}
    />
  );
}

