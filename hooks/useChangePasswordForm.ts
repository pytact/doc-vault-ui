/**
 * Change Password Form Hook
 * Based on R5 and R10 rules
 * Encapsulates change password form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Change password form schema
const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
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
  confirm_password: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type ChangePasswordFormSchema = z.infer<typeof ChangePasswordSchema>;

interface UseChangePasswordFormParams {
  defaultValues?: Partial<ChangePasswordFormSchema>;
  passwordRules?: {
    min_length: number;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    disallow_last_5: boolean;
  };
}

/**
 * Change password form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useChangePasswordForm(params?: UseChangePasswordFormParams) {
  const { defaultValues, passwordRules } = params || {};

  // Build schema dynamically based on password rules if provided
  let schema = ChangePasswordSchema;
  if (passwordRules) {
    schema = z.object({
      current_password: z.string().min(1, "Current password is required"),
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
      confirm_password: z.string().min(1, "Please confirm your new password"),
    }).refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
  }

  return useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

