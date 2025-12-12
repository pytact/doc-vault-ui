/**
 * Family Form Component
 * Pure UI form component for family create/edit
 * Based on R10 rules
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FamilySchema,
  getFamilyDefaultValues,
  type FamilyFormSchema,
} from "./family.schema";

interface FamilyFormProps {
  initialName?: string;
  onSubmit: (values: FamilyFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Family form UI component
 * Pure presentation - no business logic
 */
export function FamilyForm({
  initialName,
  onSubmit,
  onCancel,
  isLoading = false,
}: FamilyFormProps) {
  const form = useForm<FamilyFormSchema>({
    resolver: zodResolver(FamilySchema),
    defaultValues: getFamilyDefaultValues(initialName),
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <Form form={form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter family name"
                  disabled={isLoading}
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {initialName ? "Update Family" : "Create Family"}
          </Button>
        </div>
      </form>
    </Form>
  );
});

