/**
 * Subcategory Selector Hook
 * Based on R5-Custom Hooks rules
 * 
 * Manages subcategory selection state filtered by selected category.
 * Provides subcategory options based on category selection.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTaxonomyData } from "./useTaxonomyData";

interface UseSubcategorySelectorParams {
  selectedCategoryId: string | null;
  initialSubcategoryId?: string | null;
  onSubcategoryChange?: (
    subcategoryId: string,
    subcategoryName: string
  ) => void;
}

interface UseSubcategorySelectorReturn {
  // State
  selectedSubcategoryId: string | null;
  selectedSubcategoryName: string | null;

  // Options (filtered by category)
  subcategoryOptions: Array<{ id: string; name: string }>;

  // Handlers
  selectSubcategory: (subcategoryId: string) => void;
  clearSelection: () => void;

  // Computed
  hasSelection: boolean;
  hasOptions: boolean;
  selectedSubcategory:
    | ReturnType<
        typeof useTaxonomyData
      >["getSubcategoryById"] extends (
        categoryId: string,
        subcategoryId: string
      ) => infer R
      ? R
      : never
    | undefined;
}

/**
 * Subcategory selector hook
 * 
 * Manages subcategory selection state. Options are automatically filtered
 * by the selected category. Selection is reset when category changes.
 * 
 * @param params - Selected category ID, initial subcategory ID, and change callback
 * @returns Subcategory selection state and handlers
 */
export function useSubcategorySelector(
  params: UseSubcategorySelectorParams
): UseSubcategorySelectorReturn {
  const {
    selectedCategoryId,
    initialSubcategoryId,
    onSubcategoryChange,
  } = params;

  const { getSubcategoriesByCategory, getSubcategoryById } =
    useTaxonomyData();

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(initialSubcategoryId || null);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategoryId(null);
  }, [selectedCategoryId]);

  // Get subcategory options filtered by category
  const subcategoryOptions = useMemo(() => {
    if (!selectedCategoryId) return [];
    return getSubcategoriesByCategory(selectedCategoryId);
  }, [selectedCategoryId, getSubcategoriesByCategory]);

  // Get selected subcategory name
  const selectedSubcategoryName = useMemo(() => {
    if (!selectedCategoryId || !selectedSubcategoryId) return null;
    const subcategory = getSubcategoryById(
      selectedCategoryId,
      selectedSubcategoryId
    );
    return subcategory?.name || null;
  }, [selectedCategoryId, selectedSubcategoryId, getSubcategoryById]);

  // Get selected subcategory object
  const selectedSubcategory = useMemo(() => {
    if (!selectedCategoryId || !selectedSubcategoryId) return undefined;
    return getSubcategoryById(selectedCategoryId, selectedSubcategoryId);
  }, [selectedCategoryId, selectedSubcategoryId, getSubcategoryById]);

  // Select subcategory handler
  const selectSubcategory = useCallback(
    (subcategoryId: string) => {
      if (!selectedCategoryId) return;

      const subcategory = getSubcategoryById(selectedCategoryId, subcategoryId);
      if (!subcategory) return;

      setSelectedSubcategoryId(subcategoryId);
      onSubcategoryChange?.(subcategoryId, subcategory.name);
    },
    [selectedCategoryId, getSubcategoryById, onSubcategoryChange]
  );

  // Clear selection handler
  const clearSelection = useCallback(() => {
    setSelectedSubcategoryId(null);
  }, []);

  // Check if subcategory is selected
  const hasSelection = useMemo(() => {
    return selectedSubcategoryId !== null;
  }, [selectedSubcategoryId]);

  // Check if options are available
  const hasOptions = useMemo(() => {
    return subcategoryOptions.length > 0;
  }, [subcategoryOptions]);

  return {
    selectedSubcategoryId,
    selectedSubcategoryName,
    subcategoryOptions,
    selectSubcategory,
    clearSelection,
    hasSelection,
    hasOptions,
    selectedSubcategory,
  };
}

