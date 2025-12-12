/**
 * Invite Expired Page
 * Route: /invite/[token]/expired
 * Based on R11 rules
 */

"use client";

import { InviteExpired } from "@/modules/f001-identity/components/InviteExpired";
import { useParams } from "next/navigation";
import { useValidateInvitation } from "@/hooks/useInvitations";

export default function InviteExpiredPage() {
  const params = useParams();
  const token = params?.token as string;
  const { data: validationData } = useValidateInvitation(token);

  return (
    <InviteExpired
      expiredReason={validationData?.data?.expired_reason || undefined}
    />
  );
}

