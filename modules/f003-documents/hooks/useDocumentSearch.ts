/**
 * Document Search Hook
 * Provides debounced search functionality for document list
 * Based on R14 performance optimization rules
 */

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { DocumentListParams } from "../types/requests/document";

interface UseDocumentSearchParams {
  initialSearch?: string;
  debounceMs?: number;
}

interface UseDocumentSearchReturn {
  searchValue: string;
  debouncedSearchValue: string;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
  hasSearch: boolean;
  searchParams: Pick<DocumentListParams, "search">;
}

/**
 * Document search hook with debouncing
 * Debounces search input to prevent excessive API calls
 * 
 * @param params - Initial search value and debounce delay
 * @returns Search state, handlers, and debounced search params
 */
export function useDocumentSearch(
  params?: UseDocumentSearchParams
): UseDocumentSearchReturn {
  const { initialSearch = "", debounceMs = 400 } = params || {};

  const [searchValue, setSearchValueState] = useState(initialSearch);
  const debouncedSearchValue = useDebounce(searchValue, debounceMs);

  const setSearchValue = useCallback((value: string) => {
    setSearchValueState(value.trim());
  }, []);

  const clearSearch = useCallback(() => {
    setSearchValueState("");
  }, []);

  const hasSearch = useMemo(() => {
    return searchValue.trim().length > 0;
  }, [searchValue]);

  const searchParams = useMemo(() => {
    return {
      search: debouncedSearchValue.trim() || null,
    };
  }, [debouncedSearchValue]);

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
    clearSearch,
    hasSearch,
    searchParams,
  };
}

