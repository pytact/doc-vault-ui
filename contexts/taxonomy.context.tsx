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
import { usePathname } from "next/navigation";
import { useTaxonomyData, type CategoryOption, type SubcategoryOption } from "@/modules/f002-categories/hooks/useTaxonomyData";
import { useAuthContext } from "@/contexts/auth.context";
import { documentRoutes } from "@/utils/routing";

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
 * IMPORTANT: This provider only fetches taxonomy data when:
 * 1. User is authenticated
 * 2. User is on a Documents-related route
 * This prevents unauthorized API calls when the user is not logged in or not on Documents section.
 */
export function TaxonomyProvider({ children }: TaxonomyProviderProps) {
  // Check authentication status and current route
  const { isAuthenticated } = useAuthContext();
  const pathname = usePathname();
  
  // Check if we're on a Documents route
  const isOnDocumentsRoute = pathname?.startsWith(documentRoutes.list) ?? false;
  
  // Only enable taxonomy fetch when user is authenticated AND on Documents route
  // This prevents the API call from being made when user is not logged in or not on Documents section
  const shouldFetchTaxonomy = isAuthenticated && isOnDocumentsRoute;
  const taxonomyData = useTaxonomyData(shouldFetchTaxonomy);

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

