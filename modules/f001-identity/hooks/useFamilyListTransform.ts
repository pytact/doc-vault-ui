/**
 * Family List Data Transformation Hook
 * Based on R5 rules
 * Encapsulates data transformation logic for family list display
 */

import { useMemo } from "react";
import { FamilyResponse } from "../types/responses/family";
import { format } from "date-fns";

interface TransformedFamilyItem extends FamilyResponse {
  statusLabel: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  deletedAtFormatted: string | null;
  statusColor: "green" | "gray";
}

interface UseFamilyListTransformParams {
  families: FamilyResponse[] | undefined;
}

interface UseFamilyListTransformReturn {
  transformedFamilies: TransformedFamilyItem[];
  activeFamiliesCount: number;
  deletedFamiliesCount: number;
}

/**
 * Family list transformation hook
 * Transforms family list data with derived fields and formatting
 */
export function useFamilyListTransform(
  params: UseFamilyListTransformParams
): UseFamilyListTransformReturn {
  const { families = [] } = params;

  const transformedFamilies = useMemo(() => {
    return families.map((family) => {
      // Status label
      const statusLabel = family.status === "Active" ? "Active" : "Deleted";

      // Format dates
      const createdAtFormatted = family.created_at
        ? format(new Date(family.created_at), "MMM dd, yyyy")
        : "";
      const updatedAtFormatted = family.updated_at
        ? format(new Date(family.updated_at), "MMM dd, yyyy")
        : "";
      const deletedAtFormatted = family.deleted_at
        ? format(new Date(family.deleted_at), "MMM dd, yyyy")
        : null;

      // Status color
      const statusColor =
        family.status === "Active" ? ("green" as const) : ("gray" as const);

      return {
        ...family,
        statusLabel,
        createdAtFormatted,
        updatedAtFormatted,
        deletedAtFormatted,
        statusColor,
      };
    });
  }, [families]);

  const activeFamiliesCount = useMemo(() => {
    return transformedFamilies.filter((f) => f.status === "Active").length;
  }, [transformedFamilies]);

  const deletedFamiliesCount = useMemo(() => {
    return transformedFamilies.filter((f) => f.status === "SoftDeleted")
      .length;
  }, [transformedFamilies]);

  return {
    transformedFamilies,
    activeFamiliesCount,
    deletedFamiliesCount,
  };
}

