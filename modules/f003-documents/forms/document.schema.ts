/**
 * Document Form Schema
 * Zod validation schema for document create and update forms
 * Based on R10 rules
 */

import { z } from "zod";

/**
 * Document Create Schema
 * Validates document creation form data
 */
export const DocumentCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  category_id: z
    .string()
    .min(1, "Category is required")
    .uuid("Category must be a valid UUID"),
  subcategory_id: z
    .string()
    .min(1, "Subcategory is required")
    .uuid("Subcategory must be a valid UUID"),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  details_json: z
    .record(z.any())
    .optional()
    .nullable(),
});

/**
 * Document Update Schema
 * Validates document update form data
 * All fields are optional for updates
 */
export const DocumentUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character")
    .max(255, "Title must be 255 characters or less")
    .optional()
    .nullable(),
  category_id: z
    .string()
    .uuid("Category must be a valid UUID")
    .optional()
    .nullable(),
  subcategory_id: z
    .string()
    .uuid("Subcategory must be a valid UUID")
    .optional()
    .nullable(),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  details_json: z
    .record(z.any())
    .optional()
    .nullable(),
});

export type DocumentCreateFormSchema = z.infer<typeof DocumentCreateSchema>;
export type DocumentUpdateFormSchema = z.infer<typeof DocumentUpdateSchema>;

/**
 * Default values for document create form
 */
export const documentCreateDefaultValues: DocumentCreateFormSchema = {
  title: "",
  category_id: "",
  subcategory_id: "",
  expiry_date: null,
  details_json: null,
};

/**
 * Get default values for document update form
 * Populates form with existing document data
 */
export function getDocumentUpdateDefaultValues(
  document?: {
    title?: string;
    category_id?: string;
    subcategory_id?: string;
    expiry_date?: string | null;
    details_json?: Record<string, any> | null;
  } | null
): DocumentUpdateFormSchema {
  return {
    title: document?.title || "",
    category_id: document?.category_id || "",
    subcategory_id: document?.subcategory_id || "",
    expiry_date: document?.expiry_date || null,
    details_json: document?.details_json || null,
  };
}

