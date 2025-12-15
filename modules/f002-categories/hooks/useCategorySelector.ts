/**
 * Category Selector Hook
 * Based on R5-Custom Hooks rules
 * 
 * Manages category selection state and provides handlers for category selection.
 * Automatically resets subcategory when category changes.
 */

import { useState, useCallback, useMemo } from "react";
import { useTaxonomyData } from "./useTaxonomyData";

interface UseCategorySelectorParams {
  initialCategoryId?: string | null;
  onCategoryChange?: (categoryId: string, categoryName: string) => void;
}

interface UseCategorySelectorReturn {
  // State
  selectedCategoryId: string | null;
  selectedCategoryName: string | null;

  // Options
  categoryOptions: Array<{ id: string; name: string }>;

  // Handlers
  selectCategory: (categoryId: string) => void;
  clearSelection: () => void;

  // Computed
  hasSelection: boolean;
  selectedCategory: ReturnType<typeof useTaxonomyData>["getCategoryById"] extends (
    id: string
  ) => infer R
    ? R
    : never;
}

/**
 * Category selector hook
 * 
 * Manages category selection state with automatic subcategory reset
 * when category changes. Provides category options and selection handlers.
 * 
 * @param params - Initial category ID and change callback
 * @returns Category selection state and handlers
 */
export function useCategorySelector(
  params?: UseCategorySelectorParams
): UseCategorySelectorReturn {
  const { initialCategoryId, onCategoryChange } = params || {};
  const { categoryOptions, getCategoryById } = useTaxonomyData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId || null
  );

  // Get selected category name
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategoryId) return null;
    const category = getCategoryById(selectedCategoryId);
    return category?.name || null;
  }, [selectedCategoryId, getCategoryById]);

  // Get selected category object
  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return undefined;
    return getCategoryById(selectedCategoryId);
  }, [selectedCategoryId, getCategoryById]);

  // Select category handler
  const selectCategory = useCallback(
    (categoryId: string) => {
      const category = getCategoryById(categoryId);
      if (!category) return;

      setSelectedCategoryId(categoryId);
      onCategoryChange?.(categoryId, category.name);
    },
    [getCategoryById, onCategoryChange]
  );

  // Clear selection handler
  const clearSelection = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  // Check if category is selected
  const hasSelection = useMemo(() => {
    return selectedCategoryId !== null;
  }, [selectedCategoryId]);

  return {
    selectedCategoryId,
    selectedCategoryName,
    categoryOptions,
    selectCategory,
    clearSelection,
    hasSelection,
    selectedCategory,
  };
}

