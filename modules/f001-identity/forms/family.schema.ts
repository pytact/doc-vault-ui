/**
 * Family Form Schema
 * Zod validation schema for family create/edit form
 * Based on R10 rules
 */

import { z } from "zod";

export const FamilySchema = z.object({
  name: z
    .string()
    .min(1, "Family name is required")
    .max(255, "Family name must be 255 characters or less"),
});

export type FamilyFormSchema = z.infer<typeof FamilySchema>;

export function getFamilyDefaultValues(name?: string): FamilyFormSchema {
  return {
    name: name || "",
  };
}

