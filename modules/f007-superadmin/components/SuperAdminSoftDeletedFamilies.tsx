/**
 * SuperAdmin Soft-Deleted Families Component
 * SCR_SA_SOFT_DELETED_FAMILIES - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FamilyResponse } from "../types/responses/family";
import { format } from "date-fns";

/**
 * Soft-deleted family row component
 * Memoized to prevent unnecessary re-renders
 */
const SoftDeletedFamilyRow = React.memo(function SoftDeletedFamilyRow({
  family,
  onViewDetail,
}: {
  family: FamilyResponse;
  onViewDetail?: (familyId: string) => void;
}) {
  const handleRowClick = useCallback(() => {
    onViewDetail?.(family.id);
  }, [family.id, onViewDetail]);

  const deletedAtFormatted = useMemo(() => {
    return family.deleted_at
      ? format(new Date(family.deleted_at), "MMM dd, yyyy")
      : "N/A";
  }, [family.deleted_at]);

  const createdAtFormatted = useMemo(() => {
    return family.created_at
      ? format(new Date(family.created_at), "MMM dd, yyyy")
      : "N/A";
  }, [family.created_at]);

  return (
    <TableRow
      className={onViewDetail ? "cursor-pointer hover:bg-gray-50" : ""}
      onClick={onViewDetail ? handleRowClick : undefined}
    >
      <TableCell className="font-medium text-gray-900">
        {family.name}
      </TableCell>
      <TableCell className="text-gray-600">{deletedAtFormatted}</TableCell>
      <TableCell className="text-gray-600">{createdAtFormatted}</TableCell>
      <TableCell>
        <Badge variant="danger">Soft-Deleted</Badge>
      </TableCell>
    </TableRow>
  );
});

interface SuperAdminSoftDeletedFamiliesProps {
  families: FamilyResponse[];
  isLoading?: boolean;
  onViewDetail?: (familyId: string) => void;
}

/**
 * SuperAdmin Soft-Deleted Families UI component
 * Pure presentation - no business logic (read-only)
 */
export function SuperAdminSoftDeletedFamilies({
  families,
  isLoading = false,
  onViewDetail,
}: SuperAdminSoftDeletedFamiliesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Loading soft-deleted families...
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Soft-Deleted Families
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View soft-deleted families (read-only, reactivation not allowed)
          </p>
        </div>
      </CardHeader>
      <CardBody>
        {families.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No soft-deleted families found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Name</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {families.map((family) => (
                <SoftDeletedFamilyRow
                  key={family.id}
                  family={family}
                  onViewDetail={onViewDetail}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

