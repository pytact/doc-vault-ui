/**
 * Document Sharing Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentSharing } from "../components/DocumentSharing";
import { useListDocumentAssignments } from "../hooks/useDocumentAssignments";
import { useDocumentAssignmentListTransform } from "../hooks/useDocumentAssignmentListTransform";
import { useDocumentAssignmentPermissions } from "../hooks/useDocumentAssignmentPermissions";
import { useDocumentAssignmentFilters } from "../hooks/useDocumentAssignmentFilters";
import type { DocumentAssignmentResponse } from "../types/responses/document-assignment";

interface TransformedAssignmentItem extends DocumentAssignmentResponse {
  assignedAtFormatted: string;
  updatedAtFormatted: string;
  accessTypeLabel: string;
  accessTypeColor: "blue" | "green" | "gray";
  userDisplayName: string;
  userInitials: string;
}
import { useAuthContext } from "@/contexts/auth.context";
import { useGetDocument } from "@/modules/f003-documents/hooks/useDocuments";
import { useModalState } from "@/hooks/useModalState";
import { useNotificationContext } from "@/contexts/notification.context";
import { documentRoutes } from "@/utils/routing";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssignAccessModalContainer } from "./AssignAccessModalContainer";
import { RemoveAccessModalContainer } from "./RemoveAccessModalContainer";
import { useBulkRemoveAssignments } from "../hooks/useBulkRemoveAssignments";
import { useBulkDeleteAssignments } from "../hooks/useBulkDeleteAssignments";
import { BulkRemoveAccessModalContainer } from "./BulkRemoveAccessModalContainer";

/**
 * Document sharing container component
 * Handles business logic and API calls via hooks
 */
export function DocumentSharingContainer() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;
  const { user } = useAuthContext();
  const { addNotification } = useNotificationContext();
  
  const assignModal = useModalState();
  const removeModal = useModalState();
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] = React.useState<{
    userId: string;
    userName: string;
    userEmail?: string;
    accessType?: "viewer" | "editor";
  } | null>(null);

  // Get document data for owner check
  const { data: documentData } = useGetDocument(documentId);

  // Get assignments list
  const {
    data: assignmentsData,
    isLoading,
    error,
    refetch,
  } = useListDocumentAssignments(documentId);

  // Calculate permissions
  const permissions = useDocumentAssignmentPermissions({
    currentUserId: user?.id || null,
    documentOwnerId: documentData?.data?.data?.owner_user_id || null,
    currentUserRole: (user?.role as "superadmin" | "familyadmin" | "member") || null,
    isDocumentDeleted: documentData?.data?.data?.is_del || false,
    isDocumentActive: documentData?.data?.data?.is_del === false,
  });

  // Transform assignments data
  const { transformedAssignments, totalAssignments, viewerCount, editorCount } =
    useDocumentAssignmentListTransform({
      assignments: assignmentsData?.data?.items,
      documentOwnerId: documentData?.data?.data?.owner_user_id || null,
    });

  // Apply filters
  const {
    searchQuery,
    setSearchQuery,
    accessTypeFilter,
    setAccessTypeFilter,
    filteredAssignments,
    clearFilters,
  } = useDocumentAssignmentFilters({
    assignments: transformedAssignments,
  });

  // Bulk removal selection state
  const bulkRemove = useBulkRemoveAssignments({
    assignments: filteredAssignments,
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useBulkDeleteAssignments();

  // Bulk remove modal state
  const bulkRemoveModal = useModalState();

  // Redirect if no permission
  useEffect(() => {
    if (!isLoading && !permissions.canViewAssignments) {
      addNotification({
        type: "error",
        message: "You do not have permission to view document assignments.",
        title: "Access Denied",
      });
      router.push(documentRoutes.detail(documentId));
    }
  }, [isLoading, permissions.canViewAssignments, router, documentId, addNotification]);

  // Redirect if document is deleted
  useEffect(() => {
    if (documentData?.data?.data?.is_del) {
      addNotification({
        type: "error",
        message: "Cannot access sharing for a deleted document.",
        title: "Document Not Accessible",
      });
      router.push(documentRoutes.list);
    }
  }, [documentData?.data?.data?.is_del, router, addNotification]);

  const handleAddPeople = useCallback(() => {
    assignModal.open();
  }, [assignModal]);

  const handleBulkRemove = useCallback(
    (userIds: string[]) => {
      bulkRemoveModal.open();
    },
    [bulkRemoveModal]
  );

  const handleRemoveAssignment = useCallback(
    (userId: string, assignment?: TransformedAssignmentItem) => {
      // Get user info from the assignment if available
      if (assignment) {
        setSelectedAssignment({
          userId,
          userName: assignment.userDisplayName,
          userEmail: assignment.user.email,
          accessType: assignment.access_type,
        });
      } else {
        // Fallback: find assignment from the list
        const foundAssignment = transformedAssignments.find(
          (a) => (a.assign_to_user_id || a.user?.id) === userId
        );
        if (foundAssignment) {
          setSelectedAssignment({
            userId,
            userName: foundAssignment.userDisplayName,
            userEmail: foundAssignment.user.email,
            accessType: foundAssignment.access_type,
          });
        } else {
          setSelectedAssignment({
            userId,
            userName: "this user",
            userEmail: undefined,
            accessType: undefined,
          });
        }
      }
      
      setSelectedUserId(userId);
      removeModal.open();
    },
    [removeModal, transformedAssignments]
  );

  const handleBack = useCallback(() => {
    router.push(documentRoutes.detail(documentId));
  }, [router, documentId]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">
                {error?.message || "Failed to load assignments"}
              </p>
              <Button onClick={handleRetry} variant="outline">
                Retry
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!permissions.canViewAssignments) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <Button variant="outline" onClick={handleBack} size="sm">
            ← Back to Document
          </Button>
        </div>
        <DocumentSharing
          assignments={filteredAssignments}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          accessTypeFilter={accessTypeFilter}
          onAccessTypeFilterChange={setAccessTypeFilter}
          onAddPeople={handleAddPeople}
          onRemoveAssignment={handleRemoveAssignment}
          onBulkRemove={handleBulkRemove}
          selectedUserIds={bulkRemove.selectedUserIds}
          onToggleSelection={bulkRemove.toggleSelection}
          onSelectAll={bulkRemove.selectAll}
          onClearSelection={bulkRemove.clearSelection}
          canManageSharing={permissions.canManageSharing}
          totalAssignments={totalAssignments}
          viewerCount={viewerCount}
          editorCount={editorCount}
        />
      </div>

      {/* Modals */}
      <AssignAccessModalContainer
        isOpen={assignModal.isOpen}
        onClose={assignModal.close}
        documentId={documentId}
        onSuccess={() => {
          refetch();
          assignModal.close();
        }}
      />

      <RemoveAccessModalContainer
        isOpen={removeModal.isOpen}
        onClose={() => {
          removeModal.close();
          setSelectedUserId(null);
          setSelectedAssignment(null);
        }}
        documentId={documentId}
        userId={selectedUserId}
        userInfo={selectedAssignment ? {
          userName: selectedAssignment.userName,
          userEmail: selectedAssignment.userEmail,
          accessType: selectedAssignment.accessType,
        } : null}
        onSuccess={() => {
          refetch();
          removeModal.close();
          setSelectedUserId(null);
          setSelectedAssignment(null);
          bulkRemove.clearSelection();
        }}
      />

      <BulkRemoveAccessModalContainer
        isOpen={bulkRemoveModal.isOpen}
        onClose={() => {
          bulkRemoveModal.close();
        }}
        documentId={documentId}
        selectedAssignments={bulkRemove.selectedAssignments}
        onConfirm={async (userIds: string[]) => {
          try {
            await bulkDeleteMutation.mutateAsync({
              documentId,
              userIds,
            });
            refetch();
            bulkRemoveModal.close();
            bulkRemove.clearSelection();
          } catch (error) {
            // Error handling is done in the mutation hook
          }
        }}
        isLoading={bulkDeleteMutation.isPending}
      />
    </>
  );
}

