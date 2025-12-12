/**
 * Family Not Accessible Component
 * SCR_FAMILY_NOT_ACCESSIBLE - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import { familyRoutes } from "@/utils/routing";

/**
 * Family not accessible screen UI component
 * Pure presentation - no business logic
 */
export const FamilyNotAccessible = React.memo(function FamilyNotAccessible() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Family Not Accessible</h1>
        </CardHeader>

        <CardBody className="space-y-4">
          <Alert variant="warning" title="Access Denied">
            This family has been deactivated and is no longer accessible.
          </Alert>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              The family you are trying to access has been soft-deleted and is no longer
              available.
            </p>
            <p>
              All users, documents, and resources associated with this family have been
              deactivated.
            </p>
          </div>

          <div className="pt-4">
            <Link href={familyRoutes.list}>
              <Button variant="outline" fullWidth>
                Return to Family List
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

