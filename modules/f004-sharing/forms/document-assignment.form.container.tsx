/**
 * Document Assignment Form Container Component
 * Container with hooks and error handling
 * Based on R10, R7 rules
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentAssignmentForm } from "./document-assignment.form";
import {
  DocumentAssignmentSchema,
  getDocumentAssignmentDefaultValues,
  type DocumentAssignmentFormSchema,
} from "./document-assignment.schema";
import { useDocumentAssignmentFormSubmit } from "./useDocumentAssignmentFormSubmit";
import { useNotificationContext } from "@/contexts/notification.context";
import { mapApiErrorsToForm } from "@/modules/f001-identity/forms/utils/errorMapper";
import { useDebounce } from "@/utils/hooks/useDebounce";
import type { UserSummary } from "../types/responses/document-assignment";

interface DocumentAssignmentFormContainerProps {
  documentId: string;
  availableUsers: UserSummary[];
  selectableUsers: UserSummary[];
  disabledUserIds: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Document assignment form container component
 * Handles business logic, API calls, and error mapping
 */
export function DocumentAssignmentFormContainer({
  documentId,
  availableUsers,
  selectableUsers,
  disabledUserIds,
  onSuccess,
  onCancel,
}: DocumentAssignmentFormContainerProps) {
  const { addNotification } = useNotificationContext();
  const [searchQuery, setSearchQuery] = useState("");
  // Debounce search query for performance (R14: Debouncing rules)
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const { submit, isLoading, error } = useDocumentAssignmentFormSubmit({
    documentId,
  });

  const form = useForm<DocumentAssignmentFormSchema>({
    resolver: zodResolver(DocumentAssignmentSchema),
    defaultValues: getDocumentAssignmentDefaultValues(),
    mode: "onChange",
  });

  // Map API errors to form fields
  useEffect(() => {
    if (error) {
      // React Query mutation errors are already normalized APIErrorResponse
      mapApiErrorsToForm(error, form.setError);
    }
  }, [error, form.setError]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSubmit = useCallback(async (values: DocumentAssignmentFormSchema) => {
    try {
      const response = await submit(values);

      // Check for partial failures
      const failedCount = response.data?.failed?.length || 0;
      const createdCount = response.data?.created?.length || 0;
      const updatedCount = response.data?.updated?.length || 0;

      if (failedCount > 0) {
        addNotification({
          type: "warning",
          message: `${createdCount + updatedCount} assignment(s) succeeded, but ${failedCount} failed.`,
          title: "Partial Success",
        });
      } else {
        addNotification({
          type: "success",
          message: `Successfully assigned ${createdCount + updatedCount} user(s) as ${values.accessType}(s).`,
          title: "Access Assigned",
        });
      }

      // Reset form
      form.reset(getDocumentAssignmentDefaultValues());
      setSearchQuery("");

      // Call onSuccess after a small delay to ensure notification is shown
      setTimeout(() => {
        onSuccess();
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to assign access. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Assignment Failed",
      });
    }
  }, [submit, form, addNotification, onSuccess]);

  return (
    <DocumentAssignmentForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      availableUsers={availableUsers}
      selectableUsers={selectableUsers}
      disabledUserIds={disabledUserIds}
      searchQuery={searchQuery}
      debouncedSearchQuery={debouncedSearchQuery}
      onSearchChange={handleSearchChange}
    />
  );
}

