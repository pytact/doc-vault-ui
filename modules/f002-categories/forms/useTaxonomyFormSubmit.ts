/**
 * Taxonomy Form Submit Hook
 * Custom hook for taxonomy selection form submission
 * Based on R10 rules
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This hook validates and returns taxonomy selection values.
 * It can be extended when used in document creation/editing workflows.
 */

import type { TaxonomySelectionFormSchema } from "./taxonomy.schema";

interface UseTaxonomyFormSubmitReturn {
  /**
   * Submit function
   */
  submit: (values: TaxonomySelectionFormSchema) => Promise<TaxonomySelectionFormSchema>;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error: Error | null;
}

/**
 * Taxonomy form submit hook
 * 
 * Handles taxonomy selection form submission logic.
 * Since taxonomy is read-only, this hook primarily validates
 * and returns the selected values.
 * 
 * Can be extended when used in document creation/editing workflows
 * to actually submit the taxonomy selection to the document API.
 * 
 * @returns Submit function, loading state, and error state
 */
export function useTaxonomyFormSubmit(): UseTaxonomyFormSubmitReturn {
  // Since taxonomy is read-only, we just validate and return values
  // This can be extended when used in document creation/editing
  async function submit(
    values: TaxonomySelectionFormSchema
  ): Promise<TaxonomySelectionFormSchema> {
    // Validate that both category and subcategory are selected
    if (!values.category_id || !values.subcategory_id) {
      throw new Error("Both category and subcategory are required");
    }

    // Return validated values
    // In a real implementation, this would call the document API
    // to save the taxonomy selection
    return Promise.resolve(values);
  }

  return {
    submit,
    isLoading: false,
    error: null,
  };
}

