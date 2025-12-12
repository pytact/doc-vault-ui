/**
 * Account Setup Form Schema
 * Zod validation schema for account activation form
 * Based on R10 rules
 */

import { z } from "zod";
import type { PasswordRules } from "@/types/responses/common.responses";

/**
 * Create schema with dynamic password rules
 */
export function createAccountSetupSchema(passwordRules?: PasswordRules) {
  const baseSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(255, "Name must be 255 characters or less"),
    password: z.string(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    invite_token: z.string().min(1, "Invitation token is required"),
  });

  if (passwordRules) {
    return baseSchema
      .extend({
        password: z
          .string()
          .min(
            passwordRules.min_length,
            `Password must be at least ${passwordRules.min_length} characters`
          )
          .regex(
            passwordRules.uppercase ? /[A-Z]/ : /.*/,
            "Password must contain at least one uppercase letter"
          )
          .regex(
            passwordRules.lowercase ? /[a-z]/ : /.*/,
            "Password must contain at least one lowercase letter"
          )
          .regex(
            passwordRules.number ? /[0-9]/ : /.*/,
            "Password must contain at least one number"
          )
          .regex(
            passwordRules.special
              ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
              : /.*/,
            "Password must contain at least one special character"
          ),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
  }

  // Default password rules
  return baseSchema
    .extend({
      password: z
        .string()
        .min(12, "Password must be at least 12 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          "Password must contain at least one special character"
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
}

export const AccountSetupSchema = createAccountSetupSchema();

export type AccountSetupFormSchema = z.infer<typeof AccountSetupSchema>;

export const accountSetupDefaultValues: AccountSetupFormSchema = {
  name: "",
  password: "",
  confirmPassword: "",
  invite_token: "",
};

