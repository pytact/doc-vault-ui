/**
 * Invite Expired Component
 * SCR_INVITE_EXPIRED - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { authRoutes } from "@/utils/routing";

interface InviteExpiredProps {
  expiredReason?: "expired" | "invalid" | "family_soft_deleted" | "user_soft_deleted";
}

/**
 * Invite expired screen UI component
 * Pure presentation - no business logic
 */
export const InviteExpired = React.memo(function InviteExpired({
  expiredReason,
}: InviteExpiredProps) {
  const getMessage = () => {
    switch (expiredReason) {
      case "expired":
        return "This invitation link has expired. Invitations are valid for 24 hours.";
      case "invalid":
        return "This invitation link is invalid or has already been used.";
      case "family_soft_deleted":
        return "The family associated with this invitation is no longer active.";
      case "user_soft_deleted":
        return "The user account associated with this invitation is no longer active.";
      default:
        return "This invitation link is no longer valid.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Invitation Expired</h1>
        </CardHeader>

        <CardBody className="space-y-4">
          <Alert variant="warning" title="Cannot Complete Setup">
            {getMessage()}
          </Alert>

          <div className="space-y-2 text-sm text-gray-600">
            <p>To get a new invitation, please contact your Family Administrator.</p>
            <p>They can send you a new invitation link that will be valid for 24 hours.</p>
          </div>

          <div className="pt-4">
            <Link href={authRoutes.login}>
              <Button variant="outline" fullWidth>
                Return to Login
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

