/**
 * Login Form Hook
 * Based on R5 and R10 rules
 * Encapsulates login form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Login form schema
const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormSchema = z.infer<typeof LoginSchema>;

interface UseLoginFormParams {
  defaultValues?: Partial<LoginFormSchema>;
}

/**
 * Login form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useLoginForm(params?: UseLoginFormParams) {
  const { defaultValues } = params || {};

  return useForm<LoginFormSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

