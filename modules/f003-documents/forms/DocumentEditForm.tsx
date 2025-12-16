/**
 * Document Edit Form Component
 * Pure UI form component for editing documents
 * Based on R10 rules
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import {
  DocumentUpdateSchema,
  type DocumentUpdateFormSchema,
} from "./document.schema";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import { cn } from "@/utils/cn";
import { FileInfoDisplay } from "../components/FileInfoDisplay";

interface DocumentEditFormProps {
  onSubmit: (
    values: DocumentUpdateFormSchema,
    file: File | null
  ) => Promise<void>;
  onCancel: () => void;
  onPreview?: () => void;
  isLoading?: boolean;
  initialData?: {
    title?: string;
    category_id?: string;
    subcategory_id?: string;
    expiry_date?: string | null;
    details_json?: Record<string, any> | null;
    file_path?: string | null;
    file_size?: number | null;
  };
}

/**
 * Document edit form UI component
 * Pure presentation - no business logic
 */
export const DocumentEditForm = React.memo(function DocumentEditForm({
  onSubmit,
  onCancel,
  onPreview,
  isLoading = false,
  initialData,
}: DocumentEditFormProps) {
  const { categoryOptions, getSubcategoriesByCategory } = useTaxonomyContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [detailsJsonText, setDetailsJsonText] = useState<string>("");

  const form = useForm<DocumentUpdateFormSchema>({
    resolver: zodResolver(DocumentUpdateSchema),
    defaultValues: {
      title: initialData?.title || "",
      category_id: initialData?.category_id || "",
      subcategory_id: initialData?.subcategory_id || "",
      expiry_date: initialData?.expiry_date || null,
      details_json: initialData?.details_json || null,
    },
    mode: "onChange",
  });

  // Initialize details JSON text from initial data
  useEffect(() => {
    if (initialData?.details_json) {
      setDetailsJsonText(JSON.stringify(initialData.details_json, null, 2));
    }
  }, [initialData]);

  const selectedCategoryId = form.watch("category_id");
  const selectedSubcategoryId = form.watch("subcategory_id");

  // Get subcategories for selected category
  const subcategoryOptions = React.useMemo(() => {
    if (!selectedCategoryId) return [];
    const subcategories = getSubcategoriesByCategory(selectedCategoryId);
    return subcategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));
  }, [selectedCategoryId, getSubcategoriesByCategory]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileError(null);

      if (!file) {
        setSelectedFile(null);
        return;
      }

      // Validate file type
      if (file.type !== "application/pdf") {
        setFileError("File must be a PDF");
        setSelectedFile(null);
        return;
      }

      // Validate file size (5 MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError("File size must be 5 MB or less");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    },
    []
  );

  const handleDetailsJsonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setDetailsJsonText(text);

      if (!text.trim()) {
        form.setValue("details_json", null);
        return;
      }

      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          form.setValue("details_json", parsed);
          form.clearErrors("details_json");
        } else {
          form.setError("details_json", {
            type: "manual",
            message: "Details JSON must be a valid JSON object",
          });
        }
      } catch (error) {
        form.setError("details_json", {
          type: "manual",
          message: "Invalid JSON format",
        });
      }
    },
    [form]
  );

  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data, selectedFile);
    }),
    [form, onSubmit, selectedFile]
  );

  const categorySelectOptions = React.useMemo(() => {
    return categoryOptions.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categoryOptions]);

  const hasExistingFile = initialData?.file_path && initialData?.file_size;

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold text-gray-900">Edit Document</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update document metadata and optionally replace the PDF file
        </p>
      </CardHeader>

      <CardBody>
        <Form form={form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter document title"
                      disabled={isLoading}
                      error={fieldState.error?.message}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                        fieldState.error
                          ? "border-danger-500"
                          : "border-gray-300",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <option value="">Select a category</option>
                      {categorySelectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-danger-600 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Subcategory Field */}
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Subcategory *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={isLoading || !selectedCategoryId}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                        fieldState.error
                          ? "border-danger-500"
                          : "border-gray-300",
                        (isLoading || !selectedCategoryId) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <option value="">
                        {!selectedCategoryId
                          ? "Select a category first"
                          : "Select a subcategory"}
                      </option>
                      {subcategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-sm text-danger-600 mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                  {!selectedCategoryId && (
                    <FormDescription>
                      Please select a category first
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {/* Expiry Date Field */}
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      placeholder="YYYY-MM-DD"
                      disabled={isLoading}
                      error={fieldState.error?.message}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Optional expiry date for the document. Leave empty to clear.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Details JSON Field */}
            <FormField
              control={form.control}
              name="details_json"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Details JSON (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      value={detailsJsonText}
                      onChange={handleDetailsJsonChange}
                      placeholder='{"key": "value"}'
                      disabled={isLoading}
                      rows={4}
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
                        fieldState.error
                          ? "border-danger-500 text-danger-900 focus:border-danger-500 focus:ring-danger-500"
                          : "border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Optional free-form JSON metadata (must be valid JSON object). Leave empty to clear.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* File Replacement Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                PDF File (Optional - Replace existing file)
              </label>
              {hasExistingFile && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <p>Current file: {initialData.file_path}</p>
                  <p>
                    Size:{" "}
                    {initialData.file_size
                      ? `${(initialData.file_size / 1024 / 1024).toFixed(2)} MB`
                      : "Unknown"}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {selectedFile && (
                  <FileInfoDisplay fileName={selectedFile.name} fileSize={selectedFile.size} />
                )}
                {fileError && (
                  <p className="text-sm text-danger-600" role="alert">
                    {fileError}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="flex justify-between gap-2 pt-4 px-0">
              <div>
                {onPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onPreview}
                    disabled={isLoading}
                  >
                    Preview Document
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
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
                Save Changes
              </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
});

