/**
 * Account Setup Form Hook
 * Based on R5 and R10 rules
 * Encapsulates account activation form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Account setup form schema
const AccountSetupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
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
  confirmPassword: z.string().min(1, "Please confirm your password"),
  invite_token: z.string().min(1, "Invitation token is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type AccountSetupFormSchema = z.infer<typeof AccountSetupSchema>;

interface UseAccountSetupFormParams {
  defaultValues?: Partial<AccountSetupFormSchema>;
  passwordRules?: {
    min_length: number;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

/**
 * Account setup form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useAccountSetupForm(params?: UseAccountSetupFormParams) {
  const { defaultValues, passwordRules } = params || {};

  // Build schema dynamically based on password rules if provided
  let schema = AccountSetupSchema;
  if (passwordRules) {
    schema = z.object({
      name: z
        .string()
        .min(1, "Name is required")
        .max(255, "Name must be 255 characters or less"),
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
      confirmPassword: z.string().min(1, "Please confirm your password"),
      invite_token: z.string().min(1, "Invitation token is required"),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }

  return useForm<AccountSetupFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      invite_token: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

