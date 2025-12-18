/**
 * User Reassignment Form Component
 * Pure UI form component for user reassignment
 * Based on R10 rules
 */

"use client";

import React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
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
import { Select } from "@/components/ui/select";
import {
  UserReassignmentSchema,
  type UserReassignmentFormSchema,
} from "./userReassignment.schema";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface UserReassignmentFormProps {
  form: UseFormReturn<UserReassignmentFormSchema>;
  onSubmit: (values: UserReassignmentFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  familyOptions: SelectOption[];
  roleOptions: SelectOption[];
  currentFamilyId?: string | null;
}

/**
 * User reassignment form UI component
 * Pure presentation - no business logic
 */
export function UserReassignmentForm({
  form,
  onSubmit,
  onCancel,
  isLoading = false,
  familyOptions,
  roleOptions,
  currentFamilyId,
}: UserReassignmentFormProps) {
  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        await onSubmit(data);
      } catch (error) {
        throw error;
      }
    },
    (errors) => {
      // Form validation errors are handled by FormMessage components
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="family_id"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Target Family</FormLabel>
              <FormControl>
                <Select
                  options={familyOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  placeholder="Select target family"
                  fullWidth
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>New Role (Optional)</FormLabel>
              <FormControl>
                <Select
                  options={roleOptions}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? null : value);
                  }}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  placeholder="Keep current role"
                  fullWidth
                />
              </FormControl>
              <FormMessage />
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
            Reassign
          </Button>
        </div>
      </form>
    </Form>
  );
}

