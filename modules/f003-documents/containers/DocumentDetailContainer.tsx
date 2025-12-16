/**
 * Document Detail Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetDocument } from "../hooks/useDocuments";
import { useDocumentDetailTransform } from "../hooks/useDocumentDetailTransform";
import { useDocumentPermissions } from "../hooks/useDocumentPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import { useDeleteDocument } from "../hooks/useDocuments";
import { DocumentService } from "@/services/documents/document.service";
import { useModalState } from "@/hooks/useModalState";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documentRoutes } from "@/utils/routing";
import { useNotificationContext } from "@/contexts/notification.context";
import { DeleteDocumentModal } from "../components/DeleteDocumentModal";
import { useDocumentAssignmentPermissions } from "@/modules/f004-sharing/hooks/useDocumentAssignmentPermissions";

/**
 * Document detail container component
 * Handles business logic and API calls via hooks
 */
export function DocumentDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;
  const { user } = useAuthContext();
  const { addNotification } = useNotificationContext();
  const { categoryOptions, allSubcategories } = useTaxonomyContext();
  const deleteModal = useModalState();

  const { data: documentData, isLoading, error } = useGetDocument(documentId);
  const deleteMutation = useDeleteDocument();

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

  const { transformedDocument, canEdit, canDelete, canPreview, canDownload } =
    useDocumentDetailTransform({
      document: documentData?.data?.data,
      categoryMap,
      subcategoryMap,
      currentUserRole: user?.role || null,
    });

  // F-004: Check permissions for document sharing
  const sharingPermissions = useDocumentAssignmentPermissions({
    currentUserId: user?.id || null,
    documentOwnerId: documentData?.data?.data?.owner_user_id || null,
    currentUserRole: (user?.role as "superadmin" | "familyadmin" | "member") || null,
    isDocumentDeleted: documentData?.data?.data?.is_del || false,
    isDocumentActive: documentData?.data?.data?.is_del === false,
  });

  // Show Manage Sharing button if user can manage sharing and document is active
  const canManageSharing = useMemo(() => {
    if (!transformedDocument) return false;
    return sharingPermissions.canManageSharing && !transformedDocument.is_del;
  }, [sharingPermissions.canManageSharing, transformedDocument]);


  const handleEdit = useCallback(() => {
    if (documentId) {
      router.push(documentRoutes.edit(documentId));
    }
  }, [router, documentId]);

  const handleDelete = useCallback(() => {
    deleteModal.open();
  }, [deleteModal]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!documentId) {
      addNotification({
        type: "error",
        message: "Document ID is missing",
        title: "Delete Failed",
      });
      return;
    }

    // Use existing ETag from already-loaded document data (no refetch needed)
    const etag = documentData?.etag;
    
    if (!etag) {
      addNotification({
        type: "error",
        message: "ETag is required for delete operations. Please refresh the page and try again.",
        title: "Delete Failed",
      });
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        documentId,
        etag,
      });
      addNotification({
        type: "success",
        message: "Document deleted successfully",
        title: "Delete Successful",
      });
      deleteModal.close();
      router.push(documentRoutes.list);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete document. Please try again.";
      addNotification({
        type: "error",
        message: errorMessage,
        title: "Delete Failed",
      });
    }
  }, [documentId, documentData?.etag, deleteMutation, deleteModal, router, addNotification]);

  const handleBackToList = useCallback(() => {
    router.push(documentRoutes.list);
  }, [router]);

  const handlePreview = useCallback(() => {
    if (documentId) {
      router.push(documentRoutes.preview(documentId));
    }
  }, [router, documentId]);

  const handleDownload = useCallback(async () => {
    if (!documentId || !transformedDocument) return;

    try {
      const blob = await DocumentService.getFile(documentId, "download");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${transformedDocument.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      addNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to download document",
        title: "Download Failed",
      });
    }
  }, [documentId, transformedDocument, addNotification]);

  // F-004: Handle navigation to sharing page
  const handleManageSharing = useCallback(() => {
    if (documentId) {
      router.push(documentRoutes.sharing(documentId));
    }
  }, [router, documentId]);

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading document...</div>
        </CardBody>
      </Card>
    );
  }

  if (error || !transformedDocument) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Failed to load document
            </p>
            <p className="mt-2 text-gray-600">
              {error?.message || "Document not found"}
            </p>
            <Button
              onClick={handleBackToList}
              variant="primary"
              className="mt-4"
            >
              Back to Documents
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (transformedDocument.is_del) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Document Not Accessible
            </p>
            <p className="mt-2 text-gray-600">
              This document has been deleted and is no longer accessible.
            </p>
            <Button
              onClick={handleBackToList}
              variant="primary"
              className="mt-4"
            >
              Back to Documents
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Button
                onClick={handleBackToList}
                variant="outline"
                className="mb-2 -ml-2"
              >
                ← Back to Documents
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {transformedDocument.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Document Details
              </p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <Button onClick={handleEdit} variant="primary">
                  Edit Document
                </Button>
              )}
              {canManageSharing && (
                <Button onClick={handleManageSharing} variant="outline">
                  Manage Sharing
                </Button>
              )}
              <Button 
                onClick={handleDelete} 
                variant="danger"
                disabled={!canDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                Delete Document
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="space-y-4">
            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="mt-1 text-sm text-gray-900">
                  {transformedDocument.categoryName || transformedDocument.category_id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subcategory</label>
                <p className="mt-1 text-sm text-gray-900">
                  {transformedDocument.subcategoryName || transformedDocument.subcategory_id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {transformedDocument.expiryDateFormatted || (
                    <span className="text-gray-400">—</span>
                  )}
                  {transformedDocument.isExpired && (
                    <Badge variant="danger" className="ml-2">
                      Expired
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Permission</label>
                <p className="mt-1">
                  <Badge variant="secondary">{transformedDocument.permissionLabel}</Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">File</label>
                <p className="mt-1 text-sm text-gray-900">
                  {transformedDocument.hasFile ? (
                    <>
                      <Badge variant="success">PDF Available</Badge>
                      {transformedDocument.fileSizeFormatted && (
                        <span className="ml-2 text-gray-600">
                          ({transformedDocument.fileSizeFormatted})
                        </span>
                      )}
                    </>
                  ) : (
                    <Badge variant="secondary">No File</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {transformedDocument.createdAtFormatted}
                </p>
              </div>
            </div>

            {/* Details JSON Section */}
            {transformedDocument.detailsJsonFormatted && (
              <div>
                <label className="text-sm font-medium text-gray-700">Details JSON</label>
                <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs overflow-auto">
                  {transformedDocument.detailsJsonFormatted}
                </pre>
              </div>
            )}

            {/* Actions Section */}
            <div className="flex gap-2 pt-4">
              {canPreview && (
                <Button
                  onClick={handlePreview}
                  variant="outline"
                >
                  Preview Document
                </Button>
              )}
              {canDownload && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                >
                  Download PDF
                </Button>
              )}
              {canManageSharing && (
                <Button
                  onClick={handleManageSharing}
                  variant="outline"
                >
                  Manage Sharing
                </Button>
              )}
              {canDelete && (
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  Delete Document
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete Document"
      >
        <DeleteDocumentModal
          documentTitle={transformedDocument.title}
          onConfirm={handleDeleteConfirm}
          onCancel={deleteModal.close}
          isLoading={deleteMutation.isPending}
        />
      </Modal>
    </>
  );
}

