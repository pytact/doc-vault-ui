/**
 * Invite Expired Page
 * Route: /invite/[token]/expired
 * Based on R11 rules
 */

"use client";

import { InviteExpired } from "@/modules/f001-identity/components/InviteExpired";
import { useParams } from "next/navigation";
import { useValidateInvitation } from "@/modules/f001-identity/hooks/useInvitations";

export default function InviteExpiredPage() {
  const params = useParams();
  const token = params?.token as string;
  const { data: validationData } = useValidateInvitation(token);

  const expiredReason = validationData?.data?.expired_reason as
    | "expired"
    | "invalid"
    | "family_soft_deleted"
    | "user_soft_deleted"
    | undefined;

  return <InviteExpired expiredReason={expiredReason} />;
}

