/**
 * Subcategory Search Hook
 * Based on R5-Custom Hooks rules
 * 
 * Provides case-insensitive substring search across all subcategories.
 * Results are filtered and sorted alphabetically.
 */

import { useState, useCallback, useMemo } from "react";
import { useTaxonomyData } from "./useTaxonomyData";
import { useDebounce } from "@/utils/hooks/useDebounce";
import type { SubcategoryOption } from "./useTaxonomyData";

interface UseSubcategorySearchParams {
  selectedCategoryId?: string | null;
  initialSearchQuery?: string;
}

interface UseSubcategorySearchReturn {
  // State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Results
  searchResults: SubcategoryOption[];
  hasResults: boolean;
  hasSearchQuery: boolean;

  // Computed
  resultCount: number;
}

/**
 * Subcategory search hook
 * 
 * Provides case-insensitive substring search across all subcategories.
 * If a category is selected, results are filtered to that category.
 * Results are sorted alphabetically.
 * 
 * @param params - Selected category ID and initial search query
 * @returns Search state, results, and handlers
 */
export function useSubcategorySearch(
  params?: UseSubcategorySearchParams
): UseSubcategorySearchReturn {
  const { selectedCategoryId, initialSearchQuery = "" } = params || {};
  const { allSubcategories } = useTaxonomyData();

  const [searchQuery, setSearchQueryState] = useState<string>(
    initialSearchQuery
  );

  // Debounce search query for performance (400ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Set search query handler
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query.trim());
  }, []);

  // Clear search handler
  const clearSearch = useCallback(() => {
    setSearchQueryState("");
  }, []);

  // Filter and search subcategories (using debounced query)
  const searchResults = useMemo(() => {
    const trimmedQuery = debouncedSearchQuery.trim().toLowerCase();

    // If no search query, return empty or all (depending on category filter)
    if (!trimmedQuery) {
      if (selectedCategoryId) {
        // Return subcategories for selected category only
        return allSubcategories
          .filter((sub) => sub.categoryId === selectedCategoryId)
          .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
          );
      }
      return [];
    }

    // Filter by category if selected
    let filtered = allSubcategories;
    if (selectedCategoryId) {
      filtered = allSubcategories.filter(
        (sub) => sub.categoryId === selectedCategoryId
      );
    }

    // Case-insensitive substring search
    const results = filtered.filter((sub) =>
      sub.name.toLowerCase().includes(trimmedQuery)
    );

    // Sort alphabetically
    return results.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [debouncedSearchQuery, allSubcategories, selectedCategoryId]);

  // Check if has results
  const hasResults = useMemo(() => {
    return searchResults.length > 0;
  }, [searchResults]);

  // Check if has search query
  const hasSearchQuery = useMemo(() => {
    return searchQuery.trim().length > 0;
  }, [searchQuery]);

  // Result count
  const resultCount = useMemo(() => {
    return searchResults.length;
  }, [searchResults]);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    searchResults,
    hasResults,
    hasSearchQuery,
    resultCount,
  };
}

