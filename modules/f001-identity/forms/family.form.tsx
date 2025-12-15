/**
 * Family Form Component
 * Pure UI form component for family create/edit
 * Based on R10 rules
 */

"use client";

import React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
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
  showCard?: boolean;
  form?: UseFormReturn<FamilyFormSchema>;
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
  showCard = true,
  form: formProp,
}: FamilyFormProps) {
  const internalForm = useForm<FamilyFormSchema>({
    resolver: zodResolver(FamilySchema),
    defaultValues: getFamilyDefaultValues(initialName),
    mode: "onChange",
  });

  // Use provided form instance or create internal one
  const form = formProp || internalForm;

  const handleSubmit = form.handleSubmit(
    async (data) => {
    console.log("FamilyForm.handleSubmit - Form data:", data);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("FamilyForm.handleSubmit - Error:", error);
        // Re-throw error so container can handle it properly
        throw error;
    }
    },
    (errors) => {
      // Handle validation errors
      console.error("FamilyForm validation errors:", errors);
    }
  );

  const formContent = (
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
                  value={field.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
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

  if (!showCard) {
    return formContent;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <h2 className="text-xl font-semibold text-slate-900">
          {initialName ? "Edit Family" : "Family Information"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {initialName
            ? "Update the family name below"
            : "Enter the name for the new family"}
        </p>
      </CardHeader>
      <CardBody>
        {formContent}
      </CardBody>
    </Card>
  );
}

