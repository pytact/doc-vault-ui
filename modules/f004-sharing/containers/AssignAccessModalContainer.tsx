/**
 * Assign Access Modal Container Component
 * Container with hooks and context
 * Based on R7, R10 rules
 */

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { DocumentAssignmentFormContainer } from "../forms/document-assignment.form.container";
import { useListDocumentAssignments } from "../hooks/useDocumentAssignments";
import { useGetDocument } from "@/modules/f003-documents/hooks/useDocuments";
import { useUserList } from "@/modules/f001-identity/hooks/useUsers";
import { useFamilyContext } from "@/contexts/family.context";
import { useAuthContext } from "@/contexts/auth.context";
import { useDocumentAssignmentSelection } from "../hooks/useDocumentAssignmentSelection";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import type { UserSummary } from "../types/responses/document-assignment";

interface AssignAccessModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  onSuccess: () => void;
}

/**
 * Assign access modal container component
 * Handles business logic and API calls via hooks
 * Uses form-based approach following R10 rules
 */
export function AssignAccessModalContainer({
  isOpen,
  onClose,
  documentId,
  onSuccess,
}: AssignAccessModalContainerProps) {
  const { user } = useAuthContext();
  const { familyId } = useFamilyContext();

  // Get document data for owner check
  const { data: documentData } = useGetDocument(documentId);
  const documentOwnerId = documentData?.data?.data?.owner_user_id || null;

  // Only FamilyAdmin and SuperAdmin can list users - Members should not call this API
  const canListUsers = user?.role === UserRole.FamilyAdmin || user?.role === UserRole.SuperAdmin;
  
  // Get family members (only if user has permission)
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUserList(
    canListUsers ? (familyId || null) : null
  );

  // Get existing assignments to filter out already-assigned users
  const { data: assignmentsData } = useListDocumentAssignments(documentId);

  const alreadyAssignedUserIds = useMemo(() => {
    if (!assignmentsData?.data?.items) {
      return [];
    }
    return assignmentsData.data.items
      .filter((assignment) => !assignment.is_del)
      .map((assignment) => assignment.assign_to_user_id);
  }, [assignmentsData]);

  const availableUsers: UserSummary[] = useMemo(() => {
    if (!usersData?.data?.items) {
      return [];
    }
    
    return usersData.data.items
      .filter((user) => {
        const isActive = user.status === "Active";
        const isNotDeleted = !user.is_del;
        return isActive && isNotDeleted;
      })
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        family_id: user.family_id || familyId || "",
        status: user.status as "Active" | "PendingActivation" | "SoftDeleted",
      }));
  }, [usersData, familyId]);

  const { selectableUsers, disabledUserIds } = useDocumentAssignmentSelection({
    availableUsers,
    alreadyAssignedUserIds,
    documentOwnerId,
    currentUserId: user?.id || null,
  });

  const handleSuccess = React.useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const handleCancel = React.useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Access"
      size="lg"
    >
      <div className="p-1">
        {isLoadingUsers ? (
          <div className="text-center py-8 text-gray-500">Loading users...</div>
        ) : usersError ? (
          <div className="text-center py-8 text-red-500">
            Error loading users: {usersError instanceof Error ? usersError.message : "Unknown error"}
          </div>
        ) : !familyId ? (
          <div className="text-center py-8 text-gray-500">Family ID is required to load users.</div>
        ) : (
          <DocumentAssignmentFormContainer
            documentId={documentId}
            availableUsers={availableUsers}
            selectableUsers={selectableUsers}
            disabledUserIds={disabledUserIds}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </Modal>
  );
}

