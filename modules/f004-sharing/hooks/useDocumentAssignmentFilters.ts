/**
 * Document Assignment Filters Hook
 * Based on R5 and R14 rules
 * Encapsulates filtering and search logic for document assignments
 * Includes debouncing for search performance
 */

import { useState, useMemo, useCallback } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { DocumentAssignmentResponse } from "../types/responses/document-assignment";

// Extended type for transformed assignments (includes derived fields)
interface TransformedAssignmentItem extends DocumentAssignmentResponse {
  assignedAtFormatted: string;
  updatedAtFormatted: string;
  accessTypeLabel: string;
  accessTypeColor: "blue" | "green" | "gray";
  userDisplayName: string;
  userInitials: string;
}

interface UseDocumentAssignmentFiltersParams {
  assignments: TransformedAssignmentItem[] | undefined;
}

interface UseDocumentAssignmentFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  accessTypeFilter: "viewer" | "editor" | "all";
  setAccessTypeFilter: (filter: "viewer" | "editor" | "all") => void;
  filteredAssignments: TransformedAssignmentItem[];
  filteredCount: number;
  clearFilters: () => void;
}

/**
 * Document assignment filters hook
 * Manages search and filter state for assignment list
 */
export function useDocumentAssignmentFilters(
  params: UseDocumentAssignmentFiltersParams
): UseDocumentAssignmentFiltersReturn {
  const { assignments = [] } = params;

  const [searchQuery, setSearchQuery] = useState("");
  const [accessTypeFilter, setAccessTypeFilter] = useState<
    "viewer" | "editor" | "all"
  >("all");

  // Debounce search query for performance (R14: Debouncing rules)
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];

    // Filter by access type
    if (accessTypeFilter !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.access_type === accessTypeFilter
      );
    }

    // Filter by debounced search query (name or email)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((assignment) => {
        const name = assignment.user.name?.toLowerCase() || "";
        const email = assignment.user.email?.toLowerCase() || "";
        return name.includes(query) || email.includes(query);
      });
    }

    return filtered;
  }, [assignments, accessTypeFilter, debouncedSearchQuery]);

  const filteredCount = useMemo(() => {
    return filteredAssignments.length;
  }, [filteredAssignments]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setAccessTypeFilter("all");
  }, []);

  const setSearchQueryHandler = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const setAccessTypeFilterHandler = useCallback((filter: "viewer" | "editor" | "all") => {
    setAccessTypeFilter(filter);
  }, []);

  return {
    searchQuery,
    setSearchQuery: setSearchQueryHandler,
    debouncedSearchQuery,
    accessTypeFilter,
    setAccessTypeFilter: setAccessTypeFilterHandler,
    filteredAssignments,
    filteredCount,
    clearFilters,
  };
}

