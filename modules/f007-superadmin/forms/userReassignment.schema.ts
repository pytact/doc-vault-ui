/**
 * User Reassignment Form Schema
 * Zod validation schema for user reassignment form
 * Based on R10 rules
 */

import { z } from "zod";

export const UserReassignmentSchema = z.object({
  family_id: z
    .string()
    .uuid("Family ID must be a valid UUID")
    .min(1, "Target family is required"),
  role_id: z
    .string()
    .uuid("Role ID must be a valid UUID")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});

export type UserReassignmentFormSchema = z.infer<typeof UserReassignmentSchema>;

export function getUserReassignmentDefaultValues(
  familyId?: string | null,
  roleId?: string | null
): UserReassignmentFormSchema {
  return {
    family_id: familyId || "",
    role_id: roleId || null,
  };
}

