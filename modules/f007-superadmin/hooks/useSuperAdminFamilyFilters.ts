/**
 * SuperAdmin Family Filters Hook
 * Based on R5 rules
 * Encapsulates family list filtering business logic
 */

import { useState, useCallback, useMemo } from "react";
import { FamilyListParams } from "../types/requests/family";

interface UseSuperAdminFamilyFiltersParams {
  initialSearch?: string;
  initialStatus?: string[];
}

interface UseSuperAdminFamilyFiltersReturn {
  search: string;
  debouncedSearch: string;
  status: string[];
  setSearch: (search: string) => void;
  setStatus: (status: string[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  buildListParams: (skip?: number, take?: number, sortBy?: string, sortOrder?: "asc" | "desc") => FamilyListParams;
}

/**
 * Family filters state management hook
 * Handles search and status filter
 */
export function useSuperAdminFamilyFilters(
  params?: UseSuperAdminFamilyFiltersParams
): UseSuperAdminFamilyFiltersReturn {
  const {
    initialSearch = "",
    initialStatus = [],
  } = params || {};

  const [search, setSearchState] = useState(initialSearch);
  const [status, setStatus] = useState<string[]>(initialStatus);

  // Debounce search input to prevent excessive API calls (R14)
  const debouncedSearch = useDebounce(search, 400);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return debouncedSearch !== "" || status.length > 0;
  }, [debouncedSearch, status]);

  const clearFilters = useCallback(() => {
    setSearchState("");
    setStatus([]);
  }, []);

  const buildListParams = useCallback((
    skip?: number,
    take?: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): FamilyListParams => {
    return {
      skip,
      take,
      search: debouncedSearch || null, // Use debounced search value
      status: status.length > 0 ? status : [],
      sortBy,
      sortOrder,
    };
  }, [debouncedSearch, status]);

  return {
    search,
    debouncedSearch,
    status,
    setSearch,
    setStatus,
    clearFilters,
    hasActiveFilters,
    buildListParams,
  };
}

