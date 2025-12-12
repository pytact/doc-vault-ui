/**
 * Invite Activation Validate Container Component
 * SCR_INVITE_ACTIVATION_VALIDATE - Container with hooks
 * Based on R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useValidateInvitation } from "@/hooks/useInvitations";
import { InviteActivationValidate } from "../components/InviteActivationValidate";
import { InviteExpired } from "../components/InviteExpired";

/**
 * Invite activation validate container
 * Validates token and redirects appropriately
 */
export function InviteActivationValidateContainer() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const { data: validationData, isLoading } = useValidateInvitation(token);

  useEffect(() => {
    if (!isLoading && validationData?.data) {
      const { redirect_target, is_token_valid, is_token_expired } = validationData.data;

      if (!is_token_valid || is_token_expired || redirect_target === "invite_expired") {
        router.replace(`/invite/${token}/expired`);
      } else if (redirect_target === "account_setup") {
        router.replace(`/invite/${token}/setup`);
      }
    }
  }, [validationData, isLoading, token, router]);

  if (!isLoading && validationData?.data && (!validationData.data.is_token_valid || validationData.data.is_token_expired)) {
    return <InviteExpired expiredReason={validationData.data.expired_reason || undefined} />;
  }

  return <InviteActivationValidate />;
}

