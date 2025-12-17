/**
 * Taxonomy Data Transformation Hook
 * Based on R5-Custom Hooks rules
 * 
 * Transforms taxonomy API response into UI-ready data structures:
 * - Category options list
 * - Flattened subcategories with category context
 * - Category-subcategory mappings
 */

import { useMemo } from "react";
import { useListTaxonomy } from "./useTaxonomy";
import type {
  TaxonomyResponse,
  CategoryResponse,
  SubcategoryResponse,
} from "../types/responses";

/**
 * Category option for UI selectors
 */
export interface CategoryOption {
  id: string;
  name: string;
}

/**
 * Subcategory option with category context for search
 */
export interface SubcategoryOption {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

/**
 * Subcategory option for UI selectors (without category context)
 */
export interface SubcategoryOptionSimple {
  id: string;
  name: string;
}

interface UseTaxonomyDataReturn {
  // Raw taxonomy data
  taxonomy: TaxonomyResponse | undefined;
  categories: CategoryResponse[];
  isLoading: boolean;
  error: Error | null;

  // Transformed data
  categoryOptions: CategoryOption[];
  allSubcategories: SubcategoryOption[];
  categoryMap: Map<string, CategoryResponse>;

  // Helper functions
  getSubcategoriesByCategory: (
    categoryId: string
  ) => SubcategoryOptionSimple[];
  getCategoryById: (categoryId: string) => CategoryResponse | undefined;
  getSubcategoryById: (
    categoryId: string,
    subcategoryId: string
  ) => SubcategoryResponse | undefined;
}

/**
 * Taxonomy data transformation hook
 * 
 * Transforms taxonomy API response into UI-ready structures:
 * - Extracts category options for dropdowns
 * - Flattens subcategories with category context for search
 * - Creates lookup maps for efficient access
 * 
 * @param enabled - Whether the query should run (defaults to false to prevent unauthorized calls)
 * @returns Transformed taxonomy data and helper functions
 */
export function useTaxonomyData(enabled: boolean = false): UseTaxonomyDataReturn {
  const { data: taxonomy, isLoading, error } = useListTaxonomy(undefined, enabled);

  // Extract categories array
  const categories = useMemo(() => {
    return taxonomy?.data?.taxonomy?.categories || [];
  }, [taxonomy]);

  // Transform categories to options format
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }, [categories]);

  // Flatten all subcategories with category context
  const allSubcategories = useMemo(() => {
    const flattened: SubcategoryOption[] = [];
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        flattened.push({
          id: subcategory.id,
          name: subcategory.name,
          categoryId: category.id,
          categoryName: category.name,
        });
      });
    });
    // Sort alphabetically by name
    return flattened.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
  }, [categories]);

  // Create category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryResponse>();
    categories.forEach((category) => {
      map.set(category.id, category);
    });
    return map;
  }, [categories]);

  // Get subcategories for a specific category
  const getSubcategoriesByCategory = useMemo(
    () => (categoryId: string): SubcategoryOptionSimple[] => {
      const category = categoryMap.get(categoryId);
      if (!category) return [];

      return category.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
      }));
    },
    [categoryMap]
  );

  // Get category by ID
  const getCategoryById = useMemo(
    () => (categoryId: string): CategoryResponse | undefined => {
      return categoryMap.get(categoryId);
    },
    [categoryMap]
  );

  // Get subcategory by ID within a category
  const getSubcategoryById = useMemo(
    () => (
      categoryId: string,
      subcategoryId: string
    ): SubcategoryResponse | undefined => {
      const category = categoryMap.get(categoryId);
      if (!category) return undefined;

      return category.subcategories.find((sub) => sub.id === subcategoryId);
    },
    [categoryMap]
  );

  return {
    taxonomy,
    categories,
    isLoading,
    error: error as Error | null,
    categoryOptions,
    allSubcategories,
    categoryMap,
    getSubcategoriesByCategory,
    getCategoryById,
    getSubcategoryById,
  };
}

