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
import type { FamilyResponse } from "../types/responses/family";
import Link from "next/link";
import { format } from "date-fns";
import { familyRoutes, userRoutes } from "@/utils/routing";

interface FamilyDetailProps {
  family: FamilyResponse;
  canEditFamily: boolean;
  canSoftDeleteFamily: boolean;
  canViewUsers: boolean;
  canInviteUsers: boolean;
  onEditFamily: () => void;
  onSoftDeleteFamily: () => void;
  onViewUsers?: () => void;
  onInviteUser?: () => void;
}

/**
 * Family detail UI component
 * Pure presentation - no business logic
 */
export const FamilyDetail = React.memo(function FamilyDetail({
  family,
  canEditFamily,
  canSoftDeleteFamily,
  canViewUsers,
  canInviteUsers,
  onEditFamily,
  onSoftDeleteFamily,
  onViewUsers,
  onInviteUser,
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

        {family.status === "Active" && (canViewUsers || canInviteUsers) && (
          <CardFooter className="border-t border-border bg-primary-50">
            <div className="flex items-center gap-3 w-full">
              {canViewUsers && (
                <Link
                  href={userRoutes.listForFamily(family.id)}
                  className="flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-primary-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  View All Users in This Family
                </Link>
              )}
              {canInviteUsers && (
                <Button onClick={onInviteUser} variant="primary" size="md" className="ml-auto">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Invite User
                </Button>
              )}
            </div>
          </CardFooter>
        )}

        {family.status === "Active" && (canEditFamily || canSoftDeleteFamily) && (
          <CardFooter className="flex items-center justify-between gap-4 border-t-2 border-border bg-background-secondary pt-6 pb-6">
            <div className="flex gap-3">
            {canEditFamily && (
                <Button onClick={onEditFamily} variant="outline" size="md">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                Edit Family Name
              </Button>
            )}
            </div>
            {canSoftDeleteFamily && (
              <Button 
                onClick={onSoftDeleteFamily} 
                variant="danger" 
                size="md"
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold shadow-md hover:shadow-lg transition-all min-w-[140px]"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Family
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
});
