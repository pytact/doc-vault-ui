/**
 * Invite Activation Validate Component
 * SCR_INVITE_ACTIVATION_VALIDATE - Loading/validation state
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui/card";

/**
 * Invite activation validate screen
 * Shows loading state while validating token
 */
export const InviteActivationValidate = React.memo(function InviteActivationValidate() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardBody className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="h-12 w-12 animate-spin text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">Validating invitation...</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

