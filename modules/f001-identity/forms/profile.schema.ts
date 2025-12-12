/**
 * Profile Form Schema
 * Zod validation schema for profile update form
 * Based on R10 rules
 */

import { z } from "zod";

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
});

export type ProfileFormSchema = z.infer<typeof ProfileSchema>;

export function getProfileDefaultValues(name?: string): ProfileFormSchema {
  return {
    name: name || "",
  };
}

