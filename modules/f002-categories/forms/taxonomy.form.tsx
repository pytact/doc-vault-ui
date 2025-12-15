/**
 * Taxonomy Selection Form Component
 * Pure UI form component for selecting category and subcategory
 * Based on R10 rules
 */

"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TaxonomySelector } from "../components/TaxonomySelector";
import type { TaxonomySelectionFormSchema } from "./taxonomy.schema";

interface TaxonomyFormProps {
  /**
   * React Hook Form instance
   */
  form: UseFormReturn<TaxonomySelectionFormSchema>;

  /**
   * Submit handler
   */
  onSubmit: (values: TaxonomySelectionFormSchema) => Promise<void>;

  /**
   * Cancel handler (optional)
   */
  onCancel?: () => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Submit button label
   */
  submitLabel?: string;

  /**
   * Cancel button label
   */
  cancelLabel?: string;

  /**
   * Show cancel button
   */
  showCancel?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Taxonomy selection form UI component
 * Pure presentation - no business logic
 * 
 * Allows users to select category and subcategory.
 * Validates that both are selected and that subcategory belongs to category.
 */
export const TaxonomyForm = React.memo(function TaxonomyForm({
  form,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  showCancel = false,
  className,
}: TaxonomyFormProps) {
  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data);
    }),
    [form, onSubmit]
  );

  // Watch form values for category and subcategory
  const selectedCategoryId = form.watch("category_id");
  const selectedSubcategoryId = form.watch("subcategory_id");

  // Handle category change with subcategory reset
  const handleCategoryChange = React.useCallback(
    (categoryId: string, categoryName: string) => {
      form.setValue("category_id", categoryId, { shouldValidate: true });
      // Reset subcategory when category changes
      form.setValue("subcategory_id", "");
      form.trigger("subcategory_id");
    },
    [form]
  );

  // Handle subcategory change
  const handleSubcategoryChange = React.useCallback(
    (subcategoryId: string, subcategoryName: string) => {
      form.setValue("subcategory_id", subcategoryId);
      form.trigger("subcategory_id");
    },
    [form]
  );

  return (
    <Form form={form}>
      <form onSubmit={handleSubmit} className={className}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <TaxonomySelector
                    initialCategoryId={field.value || null}
                    initialSubcategoryId={selectedSubcategoryId || null}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={handleSubcategoryChange}
                    categoryLabel="Category"
                    subcategoryLabel="Subcategory"
                    categoryError={fieldState.error?.message}
                    subcategoryError={
                      form.formState.errors.subcategory_id?.message
                    }
                    required={true}
                    disabled={isLoading}
                    showValidationErrors={true}
                  />
                </FormControl>
                <FormMessage fieldName="category_id" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory_id"
            render={({ field }) => (
              <FormItem className="hidden">
                {/* Hidden field - actual UI is in TaxonomySelector */}
                <FormControl>
                  <input
                    type="hidden"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage fieldName="subcategory_id" />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            {showCancel && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
});

