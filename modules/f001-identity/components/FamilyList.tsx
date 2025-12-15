/**
 * Family List Component
 * SCR_FAMILY_LIST - Pure UI component
 * Based on R7, R12, R16, R14 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { useFamilyListTransform } from "../hooks/useFamilyListTransform";
import type { FamilyResponse } from "../types/responses/family";
import Link from "next/link";
import { familyRoutes } from "@/utils/routing";

interface FamilyListProps {
  families: FamilyResponse[];
  isLoading?: boolean;
  onCreateFamily: () => void;
  canCreateFamily: boolean;
}

/**
 * Family list UI component
 * Pure presentation - no business logic
 */
export const FamilyList = React.memo(function FamilyList({
  families,
  isLoading = false,
  onCreateFamily,
  canCreateFamily,
}: FamilyListProps) {
  const { transformedFamilies } = useFamilyListTransform({ families });

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading families...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Families</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all families in the system
            </p>
          </div>
          {canCreateFamily && (
            <Button onClick={onCreateFamily} variant="primary">
              Create Family
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {transformedFamilies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No families found. Create a family to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedFamilies.map((family) => (
                <TableRow key={family.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link
                      href={familyRoutes.detail(family.id)}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {family.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {family.status === "Active" ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Deleted</Badge>
                    )}
                  </TableCell>
                  <TableCell>{family.createdAtFormatted}</TableCell>
                  <TableCell>{family.updatedAtFormatted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
});
