/**
 * Document Upload Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { DocumentUploadForm } from "./DocumentUploadForm";
import {
  DocumentCreateSchema,
  documentCreateDefaultValues,
  type DocumentCreateFormSchema,
} from "./document.schema";
import { useDocumentFormSubmit } from "./useDocumentFormSubmit";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { DocumentService } from "@/services/documents/document.service";
import { documentRoutes } from "@/utils/routing";

interface DocumentUploadFormContainerProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Document upload form container component
 * Handles business logic, API calls, and error mapping
 */
export function DocumentUploadFormContainer({
  onSuccess,
  onCancel,
}: DocumentUploadFormContainerProps) {
  const router = useRouter();
  const { addNotification } = useNotificationContext();
  const { submit, isLoading, error } = useDocumentFormSubmit();

  const form = useForm<DocumentCreateFormSchema>({
    resolver: zodResolver(DocumentCreateSchema),
    defaultValues: documentCreateDefaultValues,
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (
    values: DocumentCreateFormSchema,
    file: File | null
  ) => {
    try {
      // Create document with metadata and file in a single multipart/form-data request
      // Pass undefined for etag (not needed for create) and file as third parameter
      const createResult = await submit(values, undefined, file);
      
      // DocumentMutationResponse structure: { data: DocumentResponse, message: string }
      // DocumentResponse has the id field directly
      const documentId = createResult?.data?.id;

      if (!documentId) {
        throw new Error("Failed to create document. Document ID not returned.");
      }

      addNotification({
        type: "success",
        message: "Document uploaded successfully",
        title: "Upload Successful",
      });

      form.reset();
      
      // Always redirect to document detail page after successful upload
      router.push(documentRoutes.detail(documentId));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload document. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Upload Failed",
      });
    }
  };

  return (
    <DocumentUploadForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}

