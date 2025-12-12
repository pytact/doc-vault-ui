/**
 * Table Filters UI State Hook
 * Based on R5 rules
 */

import { useState, useCallback, useMemo } from "react";

interface UseTableFiltersParams {
  initialStatus?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
  initialSearch?: string;
}

interface UseTableFiltersReturn {
  status: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  setStatus: (status: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Table filters state management hook
 * Handles status filter, sorting, and search
 */
export function useTableFilters(
  params?: UseTableFiltersParams
): UseTableFiltersReturn {
  const {
    initialStatus = null,
    initialSortBy = "created_at",
    initialSortOrder = "desc",
    initialSearch = "",
  } = params || {};

  const [status, setStatus] = useState<string | null>(initialStatus);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [search, setSearch] = useState(initialSearch);

  const hasActiveFilters = useMemo(() => {
    return status !== null || search !== "";
  }, [status, search]);

  const clearFilters = useCallback(() => {
    setStatus(null);
    setSearch("");
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  }, [initialSortBy, initialSortOrder]);

  return {
    status,
    sortBy,
    sortOrder,
    search,
    setStatus,
    setSortBy,
    setSortOrder,
    setSearch,
    clearFilters,
    hasActiveFilters,
  };
}

