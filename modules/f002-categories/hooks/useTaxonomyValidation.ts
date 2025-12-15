/**
 * Taxonomy Validation Hook
 * Based on R5-Custom Hooks rules
 * 
 * Provides validation logic for category-subcategory pairing
 * and mandatory field validation.
 */

import { useMemo } from "react";
import { useTaxonomyData } from "./useTaxonomyData";

interface UseTaxonomyValidationParams {
  categoryId: string | null;
  subcategoryId: string | null;
}

interface ValidationError {
  field: "category" | "subcategory" | "pairing";
  message: string;
}

interface UseTaxonomyValidationReturn {
  // Validation state
  isValid: boolean;
  errors: ValidationError[];

  // Validation functions
  validateCategory: () => ValidationError | null;
  validateSubcategory: () => ValidationError | null;
  validatePairing: () => ValidationError | null;
  validateAll: () => ValidationError[];
}

/**
 * Taxonomy validation hook
 * 
 * Provides validation for:
 * - Mandatory category selection
 * - Mandatory subcategory selection
 * - Category-subcategory pairing validation
 * 
 * @param params - Selected category and subcategory IDs
 * @returns Validation state and validation functions
 */
export function useTaxonomyValidation(
  params: UseTaxonomyValidationParams
): UseTaxonomyValidationReturn {
  const { categoryId, subcategoryId } = params;
  const { getCategoryById, getSubcategoryById } = useTaxonomyData();

  // Validate category is selected
  const validateCategory = useMemo(
    () => (): ValidationError | null => {
      if (!categoryId) {
        return {
          field: "category",
          message: "Category is required.",
        };
      }

      // Validate category exists
      const category = getCategoryById(categoryId);
      if (!category) {
        return {
          field: "category",
          message: "Selected category is invalid.",
        };
      }

      return null;
    },
    [categoryId, getCategoryById]
  );

  // Validate subcategory is selected
  const validateSubcategory = useMemo(
    () => (): ValidationError | null => {
      if (!subcategoryId) {
        return {
          field: "subcategory",
          message: "Subcategory is required.",
        };
      }

      if (!categoryId) {
        // Can't validate subcategory without category
        return {
          field: "subcategory",
          message: "Category must be selected first.",
        };
      }

      // Validate subcategory exists
      const subcategory = getSubcategoryById(categoryId, subcategoryId);
      if (!subcategory) {
        return {
          field: "subcategory",
          message: "Selected subcategory is invalid.",
        };
      }

      return null;
    },
    [categoryId, subcategoryId, getSubcategoryById]
  );

  // Validate category-subcategory pairing
  const validatePairing = useMemo(
    () => (): ValidationError | null => {
      if (!categoryId || !subcategoryId) {
        return null; // Pairing validation only applies when both are selected
      }

      const subcategory = getSubcategoryById(categoryId, subcategoryId);
      if (!subcategory) {
        return {
          field: "pairing",
          message:
            "Selected subcategory does not belong to the chosen category.",
        };
      }

      return null;
    },
    [categoryId, subcategoryId, getSubcategoryById]
  );

  // Validate all fields
  const validateAll = useMemo(
    (): (() => ValidationError[]) => {
      return () => {
        const errors: ValidationError[] = [];

        const categoryError = validateCategory();
        if (categoryError) errors.push(categoryError);

        const subcategoryError = validateSubcategory();
        if (subcategoryError) errors.push(subcategoryError);

        const pairingError = validatePairing();
        if (pairingError) errors.push(pairingError);

        return errors;
      };
    },
    [validateCategory, validateSubcategory, validatePairing]
  );

  // Current validation state
  const errors = useMemo(() => {
    return validateAll();
  }, [validateAll]);

  // Overall validity
  const isValid = useMemo(() => {
    return errors.length === 0;
  }, [errors]);

  return {
    isValid,
    errors,
    validateCategory,
    validateSubcategory,
    validatePairing,
    validateAll,
  };
}

