/**
 * Taxonomy Selector Component
 * Feature-specific composite component for F-002 (Categories & Subcategories)
 * Based on R7, R12, R16 rules
 * 
 * Combines CategorySelector and SubcategorySelector into a single component.
 * Pure UI component - uses hooks for business logic and validation.
 */

"use client";

import React from "react";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { useCategorySelector } from "../hooks/useCategorySelector";
import { useTaxonomyValidation } from "../hooks/useTaxonomyValidation";
import { useTaxonomyData } from "../hooks/useTaxonomyData";
import { cn } from "@/utils/cn";

export interface TaxonomySelectorProps {
  /**
   * Initial category ID (optional)
   */
  initialCategoryId?: string | null;

  /**
   * Initial subcategory ID (optional)
   */
  initialSubcategoryId?: string | null;

  /**
   * Callback when category selection changes
   */
  onCategoryChange?: (categoryId: string, categoryName: string) => void;

  /**
   * Callback when subcategory selection changes
   */
  onSubcategoryChange?: (
    subcategoryId: string,
    subcategoryName: string
  ) => void;

  /**
   * Callback when both selections are valid
   */
  onSelectionValid?: (
    categoryId: string,
    subcategoryId: string,
    categoryName: string,
    subcategoryName: string
  ) => void;

  /**
   * Label for category field
   */
  categoryLabel?: string;

  /**
   * Label for subcategory field
   */
  subcategoryLabel?: string;

  /**
   * Error message for category field
   */
  categoryError?: string;

  /**
   * Error message for subcategory field
   */
  subcategoryError?: string;

  /**
   * Helper text for category field
   */
  categoryHelperText?: string;

  /**
   * Helper text for subcategory field
   */
  subcategoryHelperText?: string;

  /**
   * Whether fields are required
   */
  required?: boolean;

  /**
   * Whether fields are disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Full width styling
   */
  fullWidth?: boolean;

  /**
   * Show validation errors
   */
  showValidationErrors?: boolean;
}

/**
 * TaxonomySelector component
 * 
 * Composite component that combines category and subcategory selection.
 * Automatically handles:
 * - Category selection
 * - Subcategory filtering by category
 * - Validation of category-subcategory pairing
 * - Automatic subcategory reset when category changes
 * 
 * Uses hooks for all business logic (no API calls, no transformations).
 * 
 * @param props - Component props
 * @returns Taxonomy selector UI component
 */
export const TaxonomySelector = React.memo(function TaxonomySelector({
  initialCategoryId,
  initialSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
  onSelectionValid,
  categoryLabel = "Category",
  subcategoryLabel = "Subcategory",
  categoryError,
  subcategoryError,
  categoryHelperText,
  subcategoryHelperText,
  required = true,
  disabled = false,
  className,
  fullWidth = false,
  showValidationErrors = true,
}: TaxonomySelectorProps) {
  const {
    selectedCategoryId,
    selectedCategoryName,
    selectCategory,
  } = useCategorySelector({
    initialCategoryId,
    onCategoryChange,
  });

  // Get taxonomy data for helper functions
  const { getCategoryById } = useTaxonomyData();

  // Track subcategory selection state (needed for validation)
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    React.useState<string | null>(initialSubcategoryId || null);

  // Validation
  const validation = useTaxonomyValidation({
    categoryId: selectedCategoryId,
    subcategoryId: selectedSubcategoryId,
  });

  // Handle category change with validation reset
  const handleCategoryChange = React.useCallback(
    (categoryId: string, categoryName: string) => {
      selectCategory(categoryId);
      onCategoryChange?.(categoryId, categoryName);
    },
    [selectCategory, onCategoryChange]
  );

  // Handle subcategory change with validation
  const handleSubcategoryChange = React.useCallback(
    (subcategoryId: string, subcategoryName: string) => {
      setSelectedSubcategoryId(subcategoryId);
      onSubcategoryChange?.(subcategoryId, subcategoryName);

      // If both are selected and valid, call onSelectionValid
      if (selectedCategoryId && subcategoryId && selectedCategoryName) {
        onSelectionValid?.(
          selectedCategoryId,
          subcategoryId,
          selectedCategoryName,
          subcategoryName
        );
      }
    },
    [
      selectedCategoryId,
      selectedCategoryName,
      onSubcategoryChange,
      onSelectionValid,
    ]
  );

  // Get validation errors
  const categoryValidationError = React.useMemo(() => {
    if (!showValidationErrors) return categoryError;
    const error = validation.validateCategory();
    return error ? error.message : categoryError;
  }, [showValidationErrors, validation, categoryError]);

  const subcategoryValidationError = React.useMemo(() => {
    if (!showValidationErrors) return subcategoryError;
    const error = validation.validateSubcategory();
    return error ? error.message : subcategoryError;
  }, [showValidationErrors, validation, subcategoryError]);

  return (
    <div className={cn("space-y-4", fullWidth && "w-full", className)}>
      <CategorySelector
        initialCategoryId={initialCategoryId}
        onCategoryChange={handleCategoryChange}
        label={categoryLabel}
        error={categoryValidationError}
        helperText={categoryHelperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
      />

      <SubcategorySelector
        selectedCategoryId={selectedCategoryId}
        initialSubcategoryId={initialSubcategoryId}
        onSubcategoryChange={handleSubcategoryChange}
        label={subcategoryLabel}
        error={subcategoryValidationError}
        helperText={subcategoryHelperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
      />
    </div>
  );
});

