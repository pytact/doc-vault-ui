/**
 * Document Form Submit Hook
 * Custom hook for document form submission
 * Based on R10 rules
 */

import { useCreateDocument, useUpdateDocument } from "../hooks/useDocuments";
import type { DocumentCreateFormSchema } from "./document.schema";
import type { DocumentUpdateFormSchema } from "./document.schema";
import type { DocumentCreate } from "../types/requests/document";
import type { DocumentUpdate } from "../types/requests/document";
import { useAuthContext } from "@/contexts/auth.context";
import { useFamilyContext } from "@/contexts/family.context";

interface UseDocumentFormSubmitParams {
  documentId?: string;
}

/**
 * Document form submit hook
 * Handles document form submission logic for both create and update
 */
export function useDocumentFormSubmit(params?: UseDocumentFormSubmitParams) {
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const { documentId } = params || {};
  const { user } = useAuthContext();
  const { familyId } = useFamilyContext();

  async function submitCreate(
    values: DocumentCreateFormSchema,
    file?: File | null
  ) {
    // Validate required fields are not empty strings
    if (!values.title || values.title.trim() === "") {
      throw new Error("Title is required");
    }
    if (!values.category_id || values.category_id.trim() === "") {
      throw new Error("Category is required");
    }
    if (!values.subcategory_id || values.subcategory_id.trim() === "") {
      throw new Error("Subcategory is required");
    }

    // Get family_id from context or user
    const familyIdToUse = familyId || user?.family_id;
    if (!familyIdToUse) {
      throw new Error("Family ID is required. Please ensure you are part of a family.");
    }

    const payload: DocumentCreate = {
      title: values.title.trim(),
      category_id: values.category_id.trim(),
      subcategory_id: values.subcategory_id.trim(),
      family_id: familyIdToUse,
      expiry_date: values.expiry_date && values.expiry_date.trim() !== "" ? values.expiry_date : null,
      details_json: values.details_json || null,
    };
    return await createMutation.mutateAsync({ payload, file });
  }

  async function submitUpdate(values: DocumentUpdateFormSchema, etag: string) {
    if (!documentId) {
      throw new Error("Document ID is required for update");
    }

    if (!etag) {
      throw new Error("ETag is required for update operations. Please refresh the page and try again.");
    }

    const payload: DocumentUpdate = {
      title: values.title || null,
      category_id: values.category_id || null,
      subcategory_id: values.subcategory_id || null,
      expiry_date: values.expiry_date || null,
      details_json: values.details_json || null,
    };

    // Note: File replacement is handled separately in the container
    return await updateMutation.mutateAsync({
      documentId,
      payload,
      etag,
    });
  }

  async function submit(
    values: DocumentCreateFormSchema | DocumentUpdateFormSchema,
    etag?: string,
    file?: File | null
  ) {
    if (documentId) {
      // For updates, etag is required
      // Note: File is handled separately in the container, not passed here
      if (!etag) {
        throw new Error("ETag is required for update operations. Please refresh the page and try again.");
      }
      return await submitUpdate(values as DocumentUpdateFormSchema, etag);
    } else {
      // For creates, file is optional and included in the same request
      return await submitCreate(values as DocumentCreateFormSchema, file);
    }
  }

  return {
    submit,
    submitCreate,
    submitUpdate,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
}

