/**
 * Document Assignment Form Schema
 * Zod validation schema for document assignment form
 * Based on R10 rules
 */

import { z } from "zod";

export const DocumentAssignmentSchema = z.object({
  userIds: z
    .array(z.string().uuid("Each user ID must be a valid UUID"))
    .min(1, "Please select at least one user to assign access"),
  accessType: z.enum(["viewer", "editor"], {
    required_error: "Access type is required",
    invalid_type_error: "Access type must be either 'viewer' or 'editor'",
  }),
});

export type DocumentAssignmentFormSchema = z.infer<typeof DocumentAssignmentSchema>;

/**
 * Get default values for document assignment form
 */
export function getDocumentAssignmentDefaultValues(): DocumentAssignmentFormSchema {
  return {
    userIds: [],
    accessType: "viewer",
  };
}

