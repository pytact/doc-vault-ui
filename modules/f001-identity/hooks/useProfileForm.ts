/**
 * Profile Form Hook
 * Based on R5 and R10 rules
 * Encapsulates profile update form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Profile form schema
const ProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
});

export type ProfileFormSchema = z.infer<typeof ProfileSchema>;

interface UseProfileFormParams {
  defaultValues?: Partial<ProfileFormSchema>;
}

/**
 * Profile form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useProfileForm(params?: UseProfileFormParams) {
  const { defaultValues } = params || {};

  return useForm<ProfileFormSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

