/**
 * Document Edit Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { DocumentEditForm } from "./DocumentEditForm";
import {
  DocumentUpdateSchema,
  getDocumentUpdateDefaultValues,
  type DocumentUpdateFormSchema,
} from "./document.schema";
import { useDocumentFormSubmit } from "./useDocumentFormSubmit";
import { useGetDocument } from "../hooks/useDocuments";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "./utils/errorMapper";
import { DocumentService } from "@/services/documents/document.service";
import { documentRoutes } from "@/utils/routing";
import { useDocumentDetailTransform } from "../hooks/useDocumentDetailTransform";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import { useMemo } from "react";

interface DocumentEditFormContainerProps {
  documentId: string;
  onSuccess?: () => void;
  onCancel: () => void;
}

/**
 * Document edit form container component
 * Handles business logic, API calls, and error mapping
 */
export function DocumentEditFormContainer({
  documentId,
  onSuccess,
  onCancel,
}: DocumentEditFormContainerProps) {
  const router = useRouter();
  const { addNotification } = useNotificationContext();
  const { data: documentData, isLoading: documentLoading, refetch: refetchDocument } = useGetDocument(documentId);
  const { submit, isLoading, error } = useDocumentFormSubmit({
    documentId,
  });
  const { categoryOptions, allSubcategories } = useTaxonomyContext();

  // Create category and subcategory maps for transformation
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categoryOptions.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categoryOptions]);

  const subcategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    allSubcategories.forEach((sub) => {
      map.set(sub.id, sub.name);
    });
    return map;
  }, [allSubcategories]);

  const { transformedDocument, canPreview } = useDocumentDetailTransform({
    document: documentData?.data?.data,
    categoryMap,
    subcategoryMap,
  });

  const form = useForm<DocumentUpdateFormSchema>({
    resolver: zodResolver(DocumentUpdateSchema),
    defaultValues: getDocumentUpdateDefaultValues(documentData?.data?.data),
    mode: "onChange",
  });

  // Update form when document data loads
  useEffect(() => {
    if (documentData?.data?.data) {
      form.reset(getDocumentUpdateDefaultValues(documentData.data.data));
    }
  }, [documentData, form]);

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSubmit = async (
    values: DocumentUpdateFormSchema,
    file: File | null
  ) => {
    try {
      // Use the eTag from the initial document load (no need to refetch)
      if (documentLoading) {
        addNotification({
          type: "error",
          message: "Please wait for document data to load before updating.",
          title: "Update Failed",
        });
        return;
      }

      // Use the eTag from the already-loaded document data
      // Refetching here can cause eTag mismatches if the document was modified
      const etag = documentData?.etag;
      
      if (!etag) {
        throw new Error("ETag is required for update operations. Please refresh the page and try again.");
      }

      // Step 1: Update document metadata using JSON (PATCH endpoint requires JSON)
      const updateResult = await submit(values, etag);

      // Step 2: Replace file if provided (using separate PUT endpoint)
      if (file) {
        try {
          // Get the new ETag from the update response (no need to refetch - avoid extra GET call)
          // The update response headers contain the new ETag after the document was modified
          const updatedEtag = (updateResult as any)?.etag;
          
          if (!updatedEtag) {
            // Fallback: if eTag not in response headers, refetch (shouldn't happen normally)
            console.warn("DocumentEditFormContainer - ETag not in update response, refetching...");
            const updatedDocumentData = await refetchDocument();
            const fallbackEtag = updatedDocumentData.data?.etag;
            
            if (!fallbackEtag) {
              throw new Error("ETag is required for file replacement. Please try again.");
            }
            
            await DocumentService.replaceFile(documentId, file, fallbackEtag);
          } else {
            // Use ETag from update response headers (no GET call needed)
            await DocumentService.replaceFile(documentId, file, updatedEtag);
          }
        } catch (fileError: unknown) {
          // If file replacement fails, metadata was still updated
          const errorMessage =
            fileError instanceof Error
              ? fileError.message
              : "Document metadata updated but file replacement failed. You can try again later.";
          addNotification({
            type: "error",
            message: errorMessage,
            title: "File Replacement Failed",
          });
        }
      }

      addNotification({
        type: "success",
        message: "Document updated successfully",
        title: "Update Successful",
      });

      form.reset();
      
      // Always redirect to document detail page after successful update
      router.push(documentRoutes.detail(documentId));
    } catch (err: unknown) {
      // Check if it's a PRECONDITION_FAILED error (ETag mismatch)
      const isPreconditionFailed =
        (err &&
          typeof err === "object" &&
          "error" in err &&
          err.error &&
          typeof err.error === "object" &&
          "code" in err.error &&
          err.error.code === "PRECONDITION_FAILED") ||
        (err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "error" in err.response.data &&
          err.response.data.error &&
          typeof err.response.data.error === "object" &&
          "code" in err.response.data.error &&
          err.response.data.error.code === "PRECONDITION_FAILED");

      if (isPreconditionFailed) {
        addNotification({
          type: "error",
          message:
            "The document was modified by another user. Please refresh the page and try again.",
          title: "Resource Modified",
        });
      } else {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update document. Please try again.";
        addNotification({
          type: "error",
          message: errorMessage,
          title: "Update Failed",
        });
      }
    }
  };

  if (documentLoading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading document...</div>
    );
  }

  if (!documentData?.data?.data) {
    return (
      <div className="text-center py-8 text-gray-500">
        Document not found
      </div>
    );
  }

  const handlePreview = useCallback(() => {
    router.push(documentRoutes.preview(documentId));
  }, [router, documentId]);

  return (
    <DocumentEditForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onPreview={canPreview && transformedDocument?.hasFile ? handlePreview : undefined}
      isLoading={isLoading}
      initialData={documentData.data.data}
    />
  );
}

