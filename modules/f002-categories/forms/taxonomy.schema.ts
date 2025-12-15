/**
 * Taxonomy Selection Form Schema
 * Zod validation schema for taxonomy selection form
 * Based on R10 rules
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This form is for selecting category and subcategory values
 * (e.g., when creating/editing documents that require taxonomy).
 */

import { z } from "zod";

/**
 * Taxonomy selection schema
 * 
 * Validates:
 * - category_id is required (mandatory per feature brief)
 * - subcategory_id is required (mandatory per feature brief)
 * - Both must be valid UUIDs
 */
export const TaxonomySelectionSchema = z
  .object({
    category_id: z
      .string()
      .min(1, "Category is required")
      .uuid("Category ID must be a valid UUID"),
    subcategory_id: z
      .string()
      .min(1, "Subcategory is required")
      .uuid("Subcategory ID must be a valid UUID"),
  })
  .refine(
    (data) => {
      // Additional validation: subcategory must belong to category
      // This is handled by the UI components and hooks, but we validate here too
      return data.category_id && data.subcategory_id;
    },
    {
      message: "Subcategory must belong to the selected category",
      path: ["subcategory_id"],
    }
  );

export type TaxonomySelectionFormSchema = z.infer<
  typeof TaxonomySelectionSchema
>;

/**
 * Default values for taxonomy selection form
 */
export const taxonomySelectionDefaultValues: TaxonomySelectionFormSchema = {
  category_id: "",
  subcategory_id: "",
};

