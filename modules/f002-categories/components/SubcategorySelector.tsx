/**
 * Subcategory Selector Component
 * Feature-specific component for F-002 (Categories & Subcategories)
 * Based on R7, R12, R16 rules
 * 
 * Pure UI component - uses hooks for business logic
 */

"use client";

import React from "react";
import { Select, type SelectOption } from "@/components/ui/select";
import { useSubcategorySelector } from "../hooks/useSubcategorySelector";
import { cn } from "@/utils/cn";

export interface SubcategorySelectorProps {
  /**
   * Selected category ID (required for filtering subcategories)
   */
  selectedCategoryId: string | null;

  /**
   * Initial subcategory ID (optional)
   */
  initialSubcategoryId?: string | null;

  /**
   * Callback when subcategory selection changes
   */
  onSubcategoryChange?: (
    subcategoryId: string,
    subcategoryName: string
  ) => void;

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
 * SubcategorySelector component
 * 
 * Displays a dropdown/select for choosing a subcategory.
 * Options are automatically filtered by the selected category.
 * Uses useSubcategorySelector hook for business logic.
 * 
 * @param props - Component props
 * @returns Subcategory selector UI component
 */
export const SubcategorySelector = React.memo(function SubcategorySelector({
  selectedCategoryId,
  initialSubcategoryId,
  onSubcategoryChange,
  label = "Subcategory",
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = "Select a subcategory",
  className,
  fullWidth = false,
}: SubcategorySelectorProps) {
  const {
    selectedSubcategoryId,
    subcategoryOptions,
    selectSubcategory,
    hasOptions,
    isLoading,
  } = useSubcategorySelector({
    selectedCategoryId,
    initialSubcategoryId,
    onSubcategoryChange,
  });

  // Transform subcategory options to SelectOption format
  const selectOptions: SelectOption[] = React.useMemo(() => {
    return subcategoryOptions.map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
      disabled: false,
    }));
  }, [subcategoryOptions]);

  // Handle selection change
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const subcategoryId = e.target.value;
      if (subcategoryId) {
        selectSubcategory(subcategoryId);
      }
    },
    [selectSubcategory]
  );

  // Show message if no category selected
  if (!selectedCategoryId) {
    return (
      <div className={cn("w-full", className)}>
        <Select
          options={[]}
          value=""
          label={required ? `${label} *` : label}
          error={error}
          helperText={helperText || "Please select a category first"}
          placeholder={placeholder}
          disabled={true}
          fullWidth={fullWidth}
          required={required}
          aria-label={label}
          aria-required={required}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
    );
  }

  // Show message if no options available
  if (!hasOptions && !isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <Select
          options={[]}
          value=""
          label={required ? `${label} *` : label}
          error={error}
          helperText={helperText || "No subcategories available for this category"}
          placeholder={placeholder}
          disabled={true}
          fullWidth={fullWidth}
          required={required}
          aria-label={label}
          aria-required={required}
          aria-invalid={error ? "true" : "false"}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Select
        options={selectOptions}
        value={selectedSubcategoryId || ""}
        onChange={handleChange}
        label={required ? `${label} *` : label}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        disabled={disabled || isLoading || !hasOptions}
        fullWidth={fullWidth}
        required={required}
        aria-label={label}
        aria-required={required}
        aria-invalid={error ? "true" : "false"}
      />
    </div>
  );
});

