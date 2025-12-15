/**
 * Delete Family Modal Component
 * MODAL_DELETE_FAMILY - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface DeleteFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  familyName?: string;
}

/**
 * Delete family modal UI component
 * Pure presentation - no business logic
 */
export const DeleteFamilyModal = React.memo(function DeleteFamilyModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  familyName,
}: DeleteFamilyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Family">
      <div className="flex flex-col max-h-[70vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="rounded-lg bg-danger-50 border border-danger-200 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-danger-900 mb-2">
                  This action cannot be undone
                </h3>
                <p className="text-sm text-danger-700">
                  Deleting this family will permanently deactivate it and all associated resources:
                </p>
                <ul className="mt-2 text-sm text-danger-700 list-disc list-inside space-y-1">
                  <li>All users in the family will lose access</li>
                  <li>All documents will be deleted</li>
                  <li>All user roles will be removed</li>
                  <li>No user will be able to log in to this family</li>
                </ul>
              </div>
            </div>
          </div>

          {familyName && (
            <p className="text-sm font-medium text-slate-900">
              Are you sure you want to delete <strong className="text-danger-600">{familyName}</strong>?
            </p>
          )}
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            size="md"
            className="min-w-[120px] bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

