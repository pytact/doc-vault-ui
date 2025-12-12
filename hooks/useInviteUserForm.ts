/**
 * Invite User Form Hook
 * Based on R5 and R10 rules
 * Encapsulates invite user form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Invite user form schema
const InviteUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less"),
});

export type InviteUserFormSchema = z.infer<typeof InviteUserSchema>;

interface UseInviteUserFormParams {
  defaultValues?: Partial<InviteUserFormSchema>;
}

/**
 * Invite user form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useInviteUserForm(params?: UseInviteUserFormParams) {
  const { defaultValues } = params || {};

  return useForm<InviteUserFormSchema>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      email: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

