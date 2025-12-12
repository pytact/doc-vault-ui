/**
 * Activation Status Business Logic Hook
 * Based on R5 rules
 * Encapsulates activation status calculation and labeling logic
 */

import { useMemo } from "react";

interface UseActivationStatusParams {
  status: "Active" | "PendingActivation" | "SoftDeleted" | null;
  inviteExpireAt: string | null;
}

interface UseActivationStatusReturn {
  activationStateLabel: string;
  isActivationExpired: boolean;
  isTokenValid: boolean;
  statusColor: "green" | "yellow" | "red" | "gray";
}

/**
 * Activation status business logic hook
 * Calculates activation state labels and expiration status
 */
export function useActivationStatus(
  params: UseActivationStatusParams
): UseActivationStatusReturn {
  const { status, inviteExpireAt } = params;

  const isActivationExpired = useMemo(() => {
    if (status !== "PendingActivation" || !inviteExpireAt) return false;
    const expireDate = new Date(inviteExpireAt);
    const now = new Date();
    return now > expireDate;
  }, [status, inviteExpireAt]);

  const activationStateLabel = useMemo(() => {
    if (status === "Active") return "Active";
    if (status === "SoftDeleted") return "Deleted";
    if (status === "PendingActivation") {
      return isActivationExpired ? "Expired" : "Pending";
    }
    return "Unknown";
  }, [status, isActivationExpired]);

  const isTokenValid = useMemo(() => {
    if (status !== "PendingActivation") return false;
    return !isActivationExpired;
  }, [status, isActivationExpired]);

  const statusColor = useMemo(() => {
    if (status === "Active") return "green" as const;
    if (status === "PendingActivation") {
      return isActivationExpired ? ("red" as const) : ("yellow" as const);
    }
    if (status === "SoftDeleted") return "gray" as const;
    return "gray" as const;
  }, [status, isActivationExpired]);

  return {
    activationStateLabel,
    isActivationExpired,
    isTokenValid,
    statusColor,
  };
}

