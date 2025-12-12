/**
 * Family Form Hook
 * Based on R5 and R10 rules
 * Encapsulates family create/edit form logic using React Hook Form + Zod
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Family form schema
const FamilySchema = z.object({
  name: z
    .string()
    .min(1, "Family name is required")
    .max(255, "Family name must be 255 characters or less"),
});

export type FamilyFormSchema = z.infer<typeof FamilySchema>;

interface UseFamilyFormParams {
  defaultValues?: Partial<FamilyFormSchema>;
}

/**
 * Family form hook
 * Returns React Hook Form instance with Zod validation
 */
export function useFamilyForm(params?: UseFamilyFormParams) {
  const { defaultValues } = params || {};

  return useForm<FamilyFormSchema>({
    resolver: zodResolver(FamilySchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    mode: "onChange",
  });
}

