/**
 * Category Selector Component
 * Feature-specific component for F-002 (Categories & Subcategories)
 * Based on R7, R12, R16 rules
 * 
 * Pure UI component - uses hooks for business logic
 */

"use client";

import React from "react";
import { Select, type SelectOption } from "@/components/ui/select";
import { useCategorySelector } from "../hooks/useCategorySelector";
import { cn } from "@/utils/cn";

export interface CategorySelectorProps {
  /**
   * Initial category ID (optional)
   */
  initialCategoryId?: string | null;

  /**
   * Callback when category selection changes
   */
  onCategoryChange?: (categoryId: string, categoryName: string) => void;

  /**
   * Label for the select field
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display
   */
  helperText?: string;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether the field is disabled
   */
  disabled?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

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
 * CategorySelector component
 * 
 * Displays a dropdown/select for choosing a category.
 * Uses useCategorySelector hook for business logic.
 * Automatically resets subcategory when category changes.
 * 
 * @param props - Component props
 * @returns Category selector UI component
 */
export const CategorySelector = React.memo(function CategorySelector({
  initialCategoryId,
  onCategoryChange,
  label = "Category",
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = "Select a category",
  className,
  fullWidth = false,
}: CategorySelectorProps) {
  const {
    selectedCategoryId,
    categoryOptions,
    selectCategory,
    isLoading,
  } = useCategorySelector({
    initialCategoryId,
    onCategoryChange,
  });

  // Transform category options to SelectOption format
  const selectOptions: SelectOption[] = React.useMemo(() => {
    return categoryOptions.map((category) => ({
      value: category.id,
      label: category.name,
      disabled: false,
    }));
  }, [categoryOptions]);

  // Handle selection change
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const categoryId = e.target.value;
      if (categoryId) {
        selectCategory(categoryId);
      }
    },
    [selectCategory]
  );

  return (
    <div className={cn("w-full", className)}>
      <Select
        options={selectOptions}
        value={selectedCategoryId || ""}
        onChange={handleChange}
        label={required ? `${label} *` : label}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        fullWidth={fullWidth}
        required={required}
        aria-label={label}
        aria-required={required}
        aria-invalid={error ? "true" : "false"}
      />
    </div>
  );
});

