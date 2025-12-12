/**
 * Login Form Schema
 * Zod validation schema for login form
 * Based on R10 rules
 */

import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchema = z.infer<typeof LoginSchema>;

export const loginDefaultValues: LoginFormSchema = {
  email: "",
  password: "",
};

