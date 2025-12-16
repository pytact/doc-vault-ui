/**
 * Delete Document Modal Component
 * MODAL_DELETE_DOCUMENT - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface DeleteDocumentModalProps {
  documentTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Delete document modal UI component
 * Pure presentation - no business logic
 */
export const DeleteDocumentModal = React.memo(function DeleteDocumentModal({
  documentTitle,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteDocumentModalProps) {
  return (
    <div className="space-y-6">
      <div>
        <Alert variant="warning" title="Warning: Permanent Action">
          <p className="mt-2 text-gray-700">
            You are about to permanently delete the document:{" "}
            <strong className="text-gray-900 font-semibold">{documentTitle}</strong>
          </p>
          <ul className="mt-3 list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Deletion is permanent and cannot be undone</li>
            <li>The document will be removed from all listings</li>
            <li>Preview and download will no longer be available</li>
            <li>The document will disappear from the system</li>
          </ul>
        </Alert>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
          className="min-w-[140px] bg-red-600 hover:bg-red-700 text-white border-red-600"
        >
          {isLoading ? "Deleting..." : "Delete Document"}
        </Button>
      </div>
    </div>
  );
});

