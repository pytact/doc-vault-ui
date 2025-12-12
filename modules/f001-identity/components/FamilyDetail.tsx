/**
 * Family Detail Component
 * SCR_FAMILY_DETAIL - Pure UI component
 * Based on R7, R12, R16, R14 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import type { FamilyResponse } from "@/types/responses/family.responses";
import Link from "next/link";
import { format } from "date-fns";
import { familyRoutes } from "@/utils/routing";

interface FamilyDetailProps {
  family: FamilyResponse;
  canEditFamily: boolean;
  canSoftDeleteFamily: boolean;
  onEditFamily: () => void;
  onSoftDeleteFamily: () => void;
}

/**
 * Family detail UI component
 * Pure presentation - no business logic
 */
export const FamilyDetail = React.memo(function FamilyDetail({
  family,
  canEditFamily,
  canSoftDeleteFamily,
  onEditFamily,
  onSoftDeleteFamily,
}: FamilyDetailProps) {
  const formattedCreatedAt = React.useMemo(
    () => format(new Date(family.created_at), "MMM dd, yyyy HH:mm"),
    [family.created_at]
  );

  const formattedUpdatedAt = React.useMemo(
    () => format(new Date(family.updated_at), "MMM dd, yyyy HH:mm"),
    [family.updated_at]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={familyRoutes.list}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            ← Back to Families
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{family.name}</h1>
        </div>
        {family.status === "Active" ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Deleted</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Family Information</h2>
          <p className="mt-1 text-sm text-gray-600">View and manage family details</p>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{family.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              {family.status === "Active" ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="secondary">Deleted</Badge>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1 text-gray-900">{formattedCreatedAt}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Updated At</label>
            <p className="mt-1 text-gray-900">{formattedUpdatedAt}</p>
          </div>
        </CardBody>

        {family.status === "Active" && (canEditFamily || canSoftDeleteFamily) && (
          <CardFooter className="flex gap-2">
            {canEditFamily && (
              <Button onClick={onEditFamily} variant="outline">
                Edit Family Name
              </Button>
            )}
            {canSoftDeleteFamily && (
              <Button onClick={onSoftDeleteFamily} variant="danger">
                Soft Delete Family
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
});
