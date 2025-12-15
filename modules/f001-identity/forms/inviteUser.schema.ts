/**
 * Invite User Form Schema
 * Zod validation schema for invite user form
 * Based on R10 rules
 */

import { z } from "zod";

export const InviteUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less"),
  role_id: z
    .string()
    .min(1, "Role is required"),
});

export type InviteUserFormSchema = z.infer<typeof InviteUserSchema>;

export const inviteUserDefaultValues: InviteUserFormSchema = {
  email: "",
  role_id: "",
};

