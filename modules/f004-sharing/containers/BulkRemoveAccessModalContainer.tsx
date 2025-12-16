/**
 * Bulk Remove Access Modal Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback } from "react";
import { BulkRemoveAccessModal } from "../components/BulkRemoveAccessModal";

interface BulkRemoveAccessModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  selectedAssignments: Array<{ userId: string; userName: string; userEmail?: string; accessType?: "viewer" | "editor" }>;
  onConfirm: (userIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Bulk remove access modal container component
 * Handles business logic and API calls via hooks
 */
export function BulkRemoveAccessModalContainer({
  isOpen,
  onClose,
  documentId,
  selectedAssignments,
  onConfirm,
  isLoading = false,
}: BulkRemoveAccessModalContainerProps) {
  const handleConfirm = useCallback(async () => {
    const userIds = selectedAssignments.map((a) => a.userId).filter((id): id is string => !!id);
    if (userIds.length === 0) {
      return;
    }
    await onConfirm(userIds);
  }, [selectedAssignments, onConfirm]);

  const selectedUsers = selectedAssignments.map((a) => ({
    userName: a.userName,
    userEmail: a.userEmail,
    accessType: a.accessType,
  }));

  return (
    <BulkRemoveAccessModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isLoading}
      selectedCount={selectedAssignments.length}
      selectedUsers={selectedUsers}
    />
  );
}

