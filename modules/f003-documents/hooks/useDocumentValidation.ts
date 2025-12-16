/**
 * Document Validation Business Logic Hook
 * Based on R5 rules
 * Encapsulates validation logic for document forms
 */

import { useMemo, useCallback } from "react";
import { DocumentCreate, DocumentUpdate } from "../types/requests/document";

interface UseDocumentValidationParams {
  title?: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  expiryDate?: string | null;
  detailsJson?: Record<string, any> | null;
  selectedSubcategories?: Map<string, string[]>; // Map of category_id -> subcategory_ids[]
}

interface UseDocumentValidationReturn {
  isTitleValid: boolean;
  isCategoryValid: boolean;
  isSubcategoryValid: boolean;
  isCategorySubcategoryPairValid: boolean;
  isExpiryDateValid: boolean;
  isDetailsJsonValid: boolean;
  isFormValid: boolean;
  titleError: string | null;
  categoryError: string | null;
  subcategoryError: string | null;
  expiryDateError: string | null;
  detailsJsonError: string | null;
  validateTitle: (title: string) => string | null;
  validateCategory: (categoryId: string | null) => string | null;
  validateSubcategory: (
    categoryId: string | null,
    subcategoryId: string | null
  ) => string | null;
  validateExpiryDate: (expiryDate: string | null) => string | null;
  validateDetailsJson: (detailsJson: Record<string, any> | null) => string | null;
}

/**
 * Validate document title
 */
function validateTitleValue(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return "Title is required";
  }
  if (title.length > 255) {
    return "Title must be 255 characters or less";
  }
  if (title.length < 1) {
    return "Title must be at least 1 character";
  }
  return null;
}

/**
 * Validate category selection
 */
function validateCategoryValue(categoryId: string | null): string | null {
  if (!categoryId || categoryId.trim().length === 0) {
    return "Category is required";
  }
  // UUID format validation (basic check)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(categoryId)) {
    return "Category must be a valid UUID";
  }
  return null;
}

/**
 * Validate subcategory selection and pairing with category
 */
function validateSubcategoryValue(
  categoryId: string | null,
  subcategoryId: string | null,
  selectedSubcategories?: Map<string, string[]>
): string | null {
  if (!subcategoryId || subcategoryId.trim().length === 0) {
    return "Subcategory is required";
  }
  
  // UUID format validation (basic check)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(subcategoryId)) {
    return "Subcategory must be a valid UUID";
  }
  
  // Validate category-subcategory pairing if taxonomy map is provided
  if (categoryId && selectedSubcategories) {
    const validSubcategories = selectedSubcategories.get(categoryId);
    if (validSubcategories && !validSubcategories.includes(subcategoryId)) {
      return "Subcategory does not belong to the selected category";
    }
  }
  
  return null;
}

/**
 * Validate expiry date format
 */
function validateExpiryDateValue(expiryDate: string | null): string | null {
  if (!expiryDate) return null; // Expiry date is optional
  
  // ISO 8601 date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(expiryDate)) {
    return "Expiry date must be in YYYY-MM-DD format";
  }
  
  // Check if date is valid
  const date = new Date(expiryDate);
  if (isNaN(date.getTime())) {
    return "Expiry date must be a valid date";
  }
  
  return null;
}

/**
 * Validate details JSON structure
 */
function validateDetailsJsonValue(
  detailsJson: Record<string, any> | null
): string | null {
  if (!detailsJson) return null; // Details JSON is optional
  
  // Check if it's a valid object (not array, not null, not primitive)
  if (typeof detailsJson !== "object" || Array.isArray(detailsJson)) {
    return "Details JSON must be a valid JSON object";
  }
  
  // Try to stringify to ensure it's serializable
  try {
    JSON.stringify(detailsJson);
  } catch (error) {
    return "Details JSON must be a valid JSON object";
  }
  
  return null;
}

/**
 * Document validation business logic hook
 * Provides validation functions and computed validation state
 */
export function useDocumentValidation(
  params: UseDocumentValidationParams
): UseDocumentValidationReturn {
  const {
    title,
    categoryId,
    subcategoryId,
    expiryDate,
    detailsJson,
    selectedSubcategories,
  } = params;

  const validateTitle = useCallback(
    (titleValue: string) => validateTitleValue(titleValue),
    []
  );

  const validateCategory = useCallback(
    (categoryIdValue: string | null) => validateCategoryValue(categoryIdValue),
    []
  );

  const validateSubcategory = useCallback(
    (categoryIdValue: string | null, subcategoryIdValue: string | null) =>
      validateSubcategoryValue(
        categoryIdValue,
        subcategoryIdValue,
        selectedSubcategories
      ),
    [selectedSubcategories]
  );

  const validateExpiryDate = useCallback(
    (expiryDateValue: string | null) => validateExpiryDateValue(expiryDateValue),
    []
  );

  const validateDetailsJson = useCallback(
    (detailsJsonValue: Record<string, any> | null) =>
      validateDetailsJsonValue(detailsJsonValue),
    []
  );

  const titleError = useMemo(() => {
    if (title === undefined) return null;
    return validateTitleValue(title);
  }, [title]);

  const categoryError = useMemo(() => {
    if (categoryId === undefined) return null;
    return validateCategoryValue(categoryId);
  }, [categoryId]);

  const subcategoryError = useMemo(() => {
    if (subcategoryId === undefined) return null;
    return validateSubcategoryValue(
      categoryId || null,
      subcategoryId,
      selectedSubcategories
    );
  }, [subcategoryId, categoryId, selectedSubcategories]);

  const expiryDateError = useMemo(() => {
    if (expiryDate === undefined) return null;
    return validateExpiryDateValue(expiryDate);
  }, [expiryDate]);

  const detailsJsonError = useMemo(() => {
    if (detailsJson === undefined) return null;
    return validateDetailsJsonValue(detailsJson);
  }, [detailsJson]);

  const isTitleValid = useMemo(() => titleError === null, [titleError]);
  const isCategoryValid = useMemo(() => categoryError === null, [categoryError]);
  const isSubcategoryValid = useMemo(
    () => subcategoryError === null,
    [subcategoryError]
  );
  const isCategorySubcategoryPairValid = useMemo(() => {
    if (!categoryId || !subcategoryId) return false;
    if (categoryError || subcategoryError) return false;
    if (selectedSubcategories) {
      const validSubcategories = selectedSubcategories.get(categoryId);
      return validSubcategories?.includes(subcategoryId) ?? false;
    }
    return true; // If no taxonomy map, assume valid (will be validated by backend)
  }, [categoryId, subcategoryId, categoryError, subcategoryError, selectedSubcategories]);
  const isExpiryDateValid = useMemo(
    () => expiryDateError === null,
    [expiryDateError]
  );
  const isDetailsJsonValid = useMemo(
    () => detailsJsonError === null,
    [detailsJsonError]
  );

  const isFormValid = useMemo(() => {
    // For create: title, category, subcategory are required
    // For update: all fields are optional, but if provided must be valid
    return (
      isTitleValid &&
      (categoryId === null || isCategoryValid) &&
      (subcategoryId === null || isSubcategoryValid) &&
      isCategorySubcategoryPairValid &&
      isExpiryDateValid &&
      isDetailsJsonValid
    );
  }, [
    isTitleValid,
    categoryId,
    isCategoryValid,
    subcategoryId,
    isSubcategoryValid,
    isCategorySubcategoryPairValid,
    isExpiryDateValid,
    isDetailsJsonValid,
  ]);

  return {
    isTitleValid,
    isCategoryValid,
    isSubcategoryValid,
    isCategorySubcategoryPairValid,
    isExpiryDateValid,
    isDetailsJsonValid,
    isFormValid,
    titleError,
    categoryError,
    subcategoryError,
    expiryDateError,
    detailsJsonError,
    validateTitle,
    validateCategory,
    validateSubcategory,
    validateExpiryDate,
    validateDetailsJson,
  };
}

