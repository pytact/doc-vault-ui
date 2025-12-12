/**
 * Change Password Form Schema
 * Zod validation schema for change password form
 * Based on R10 rules
 */

import { z } from "zod";
import type { PasswordRules } from "@/types/responses/common.responses";

/**
 * Create schema with dynamic password rules
 */
export function createChangePasswordSchema(passwordRules?: PasswordRules) {
  const baseSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string(),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  });

  if (passwordRules) {
    return baseSchema
      .extend({
        new_password: z
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
      .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
  }

  // Default password rules
  return baseSchema
    .extend({
      new_password: z
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
    .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
}

export const ChangePasswordSchema = createChangePasswordSchema();

export type ChangePasswordFormSchema = z.infer<typeof ChangePasswordSchema>;

export const changePasswordDefaultValues: ChangePasswordFormSchema = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

