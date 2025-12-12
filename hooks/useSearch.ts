/**
 * Search Input State Hook
 * Based on R5 and R14 rules
 */

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";

interface UseSearchParams {
  initialValue?: string;
  debounceMs?: number;
}

interface UseSearchReturn {
  searchValue: string;
  debouncedSearchValue: string;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
  hasSearch: boolean;
}

/**
 * Search input state management hook
 * Handles search input value and clearing with debouncing
 */
export function useSearch(params?: UseSearchParams): UseSearchReturn {
  const { initialValue = "", debounceMs = 400 } = params || {};

  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, debounceMs);

  const hasSearch = useMemo(() => {
    return searchValue.trim().length > 0;
  }, [searchValue]);

  const clearSearch = useCallback(() => {
    setSearchValue("");
  }, []);

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
    clearSearch,
    hasSearch,
  };
}

