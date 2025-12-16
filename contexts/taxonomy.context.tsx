/**
 * Taxonomy Context
 * Based on R6 context management rules
 * Provides global taxonomy data access for F-002 feature
 * 
 * NOTE: Taxonomy is immutable and cached via React Query with Infinity staleTime.
 * This context provides convenient global access to taxonomy data without prop drilling.
 */

"use client";

import React, { createContext, useContext } from "react";
import { useTaxonomyData, type CategoryOption, type SubcategoryOption } from "@/modules/f002-categories/hooks/useTaxonomyData";

interface TaxonomyContextValue {
  // Raw data
  taxonomy: ReturnType<typeof useTaxonomyData>["taxonomy"];
  categories: ReturnType<typeof useTaxonomyData>["categories"];
  isLoading: boolean;
  error: Error | null;

  // Transformed data
  categoryOptions: CategoryOption[];
  allSubcategories: SubcategoryOption[];

  // Helper functions
  getSubcategoriesByCategory: ReturnType<
    typeof useTaxonomyData
  >["getSubcategoriesByCategory"];
  getCategoryById: ReturnType<typeof useTaxonomyData>["getCategoryById"];
  getSubcategoryById: ReturnType<
    typeof useTaxonomyData
  >["getSubcategoryById"];
}

const TaxonomyContext = createContext<TaxonomyContextValue | undefined>(
  undefined
);

interface TaxonomyProviderProps {
  children: React.ReactNode;
}

/**
 * TaxonomyProvider component
 * Provides global access to taxonomy data
 * 
 * Taxonomy data is cached via React Query with Infinity staleTime,
 * so this context simply exposes the data globally without additional caching.
 * 
 * IMPORTANT: This provider fetches taxonomy data eagerly when mounted,
 * ensuring it's available immediately when document forms are loaded.
 */
export function TaxonomyProvider({ children }: TaxonomyProviderProps) {
  // This hook will automatically fetch taxonomy data when the provider mounts
  // Since it's in the root Providers component, taxonomy will be loaded on app startup
  const taxonomyData = useTaxonomyData();

  const value: TaxonomyContextValue = {
    taxonomy: taxonomyData.taxonomy,
    categories: taxonomyData.categories,
    isLoading: taxonomyData.isLoading,
    error: taxonomyData.error,
    categoryOptions: taxonomyData.categoryOptions,
    allSubcategories: taxonomyData.allSubcategories,
    getSubcategoriesByCategory: taxonomyData.getSubcategoriesByCategory,
    getCategoryById: taxonomyData.getCategoryById,
    getSubcategoryById: taxonomyData.getSubcategoryById,
  };

  return (
    <TaxonomyContext.Provider value={value}>
      {children}
    </TaxonomyContext.Provider>
  );
}

/**
 * useTaxonomyContext hook
 * Custom hook to consume TaxonomyContext
 * Must be used within TaxonomyProvider
 * 
 * @returns Taxonomy context value with data and helper functions
 * @throws Error if used outside TaxonomyProvider
 */
export function useTaxonomyContext(): TaxonomyContextValue {
  const context = useContext(TaxonomyContext);
  if (context === undefined) {
    throw new Error(
      "useTaxonomyContext must be used within a TaxonomyProvider"
    );
  }
  return context;
}

