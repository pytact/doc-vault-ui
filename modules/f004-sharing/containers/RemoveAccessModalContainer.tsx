/**
 * Remove Access Modal Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { RemoveAccessModal } from "../components/RemoveAccessModal";
import { useDeleteDocumentAssignment } from "../hooks/useDocumentAssignments";
import { useGetDocumentAssignment } from "../hooks/useDocumentAssignments";
import { useNotificationContext } from "@/contexts/notification.context";

interface RemoveAccessModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  userId: string | null;
  userInfo?: {
    userName: string;
    userEmail?: string;
    accessType?: "viewer" | "editor";
  } | null;
  onSuccess: () => void;
}

/**
 * Remove access modal container component
 * Handles business logic and API calls via hooks
 */
export function RemoveAccessModalContainer({
  isOpen,
  onClose,
  documentId,
  userId,
  userInfo,
  onSuccess,
}: RemoveAccessModalContainerProps) {
  const { addNotification } = useNotificationContext();

  const { data: assignmentData } = useGetDocumentAssignment(
    documentId,
    userId || null
  );

  const assignment = assignmentData?.data;
  const userEmail = userInfo?.userEmail || assignment?.user?.email;
  const userName = userInfo?.userName || assignment?.user?.name || userEmail || "this user";
  const accessType = userInfo?.accessType || assignment?.access_type;

  const etag = useMemo(() => {
    return assignmentData?.etag;
  }, [assignmentData]);

  // Delete mutation
  const deleteMutation = useDeleteDocumentAssignment();

  const handleConfirm = useCallback(async () => {
    if (!userId) {
      addNotification({
        type: "error",
        message: "User ID is missing.",
        title: "Remove Failed",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        documentId,
        userId,
        etag,
      });

      addNotification({
        type: "success",
        message: `Access has been removed for ${userName}.`,
        title: "Access Removed",
      });

      onSuccess();
    } catch (error: unknown) {
      const apiError = error as { message?: string; error?: { details?: string | Array<{ issue: string }> } };
      const errorMessage = 
        apiError?.message ||
        (Array.isArray(apiError?.error?.details) 
          ? apiError.error.details.map((d) => d.issue).join(", ")
          : typeof apiError?.error?.details === "string"
          ? apiError.error.details
          : undefined) ||
        "Failed to remove access. Please try again.";
      
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Remove Failed",
      });
    }
  }, [documentId, userId, etag, deleteMutation, userName, addNotification, onSuccess]);

  if (!userId) {
    return null;
  }

  return (
    <RemoveAccessModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
      userName={userName}
      userEmail={userEmail}
      accessType={accessType}
    />
  );
}

