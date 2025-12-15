/**
 * Taxonomy Form Hook
 * Based on R5 and R10 rules
 * Encapsulates taxonomy selection form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TaxonomySelectionSchema,
  taxonomySelectionDefaultValues,
  type TaxonomySelectionFormSchema,
} from "./taxonomy.schema";

interface UseTaxonomyFormParams {
  /**
   * Default values for the form
   */
  defaultValues?: Partial<TaxonomySelectionFormSchema>;

  /**
   * Form validation mode
   */
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";

  /**
   * Whether to revalidate on change
   */
  reValidateMode?: "onChange" | "onBlur" | "onSubmit";
}

/**
 * Taxonomy form hook
 * 
 * Provides React Hook Form instance with Zod validation
 * for taxonomy selection (category and subcategory).
 * 
 * @param params - Form configuration parameters
 * @returns React Hook Form instance
 */
export function useTaxonomyForm(params?: UseTaxonomyFormParams) {
  const {
    defaultValues = taxonomySelectionDefaultValues,
    mode = "onChange",
    reValidateMode = "onChange",
  } = params || {};

  const form = useForm<TaxonomySelectionFormSchema>({
    resolver: zodResolver(TaxonomySelectionSchema),
    defaultValues: {
      ...taxonomySelectionDefaultValues,
      ...defaultValues,
    },
    mode,
    reValidateMode,
  });

  return form;
}

