/**
 * Subcategory Search Component
 * Feature-specific component for F-002 (Categories & Subcategories)
 * Based on R7, R12, R16 rules
 * 
 * Pure UI component - uses hooks for business logic
 * Provides case-insensitive substring search across subcategories
 */

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useSubcategorySearch } from "../hooks/useSubcategorySearch";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { cn } from "@/utils/cn";

// Generate stable ID for search results
const SEARCH_RESULTS_ID = `subcategory-search-results-${Math.random()
  .toString(36)
  .substr(2, 9)}`;

export interface SubcategorySearchProps {
  /**
   * Selected category ID (optional - if provided, filters results to that category)
   */
  selectedCategoryId?: string | null;

  /**
   * Initial search query (optional)
   */
  initialSearchQuery?: string;

  /**
   * Callback when search query changes
   */
  onSearchChange?: (query: string) => void;

  /**
   * Callback when a search result is selected
   */
  onResultSelect?: (
    subcategoryId: string,
    subcategoryName: string,
    categoryId: string
  ) => void;

  /**
   * Label for the search input
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether to show search results
   */
  showResults?: boolean;

  /**
   * Maximum number of results to display
   */
  maxResults?: number;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Full width styling
   */
  fullWidth?: boolean;
}

/**
 * SubcategorySearch component
 * 
 * Provides a search input with case-insensitive substring matching.
 * Results are filtered by category if selectedCategoryId is provided.
 * Uses useSubcategorySearch hook for business logic.
 * Search input is debounced for performance.
 * 
 * @param props - Component props
 * @returns Subcategory search UI component
 */
export const SubcategorySearch = React.memo(function SubcategorySearch({
  selectedCategoryId,
  initialSearchQuery = "",
  onSearchChange,
  onResultSelect,
  label = "Search Subcategories",
  placeholder = "Search subcategories...",
  showResults = true,
  maxResults = 10,
  className,
  fullWidth = false,
}: SubcategorySearchProps) {
  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    searchResults,
    hasResults,
    hasSearchQuery,
    resultCount,
  } = useSubcategorySearch({
    selectedCategoryId,
    initialSearchQuery,
  });

  // Handle input change
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      onSearchChange?.(query);
    },
    [setSearchQuery, onSearchChange]
  );

  // Handle result selection - memoize per result
  const createResultClickHandler = React.useCallback(
    (result: {
      id: string;
      name: string;
      categoryId: string;
      categoryName: string;
    }) => () => {
      onResultSelect?.(result.id, result.name, result.categoryId);
    },
    [onResultSelect]
  );

  // Limit results to maxResults
  const displayedResults = React.useMemo(() => {
    return searchResults.slice(0, maxResults);
  }, [searchResults, maxResults]);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          label={label}
          placeholder={placeholder}
          fullWidth={fullWidth}
          aria-label={label}
          aria-describedby={hasSearchQuery ? SEARCH_RESULTS_ID : undefined}
        />
        {hasSearchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && hasSearchQuery && (
        <div
          id={SEARCH_RESULTS_ID}
          className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="Search results"
        >
          {hasResults ? (
            <>
              {displayedResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={createResultClickHandler(result)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  role="option"
                  aria-label={`${result.name} in ${result.categoryName}`}
                >
                  <div className="font-medium">{result.name}</div>
                  <div className="text-xs text-gray-500">
                    {result.categoryName}
                  </div>
                </button>
              ))}
              {resultCount > maxResults && (
                <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
                  Showing {maxResults} of {resultCount} results
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No subcategories found
            </div>
          )}
        </div>
      )}
    </div>
  );
});

