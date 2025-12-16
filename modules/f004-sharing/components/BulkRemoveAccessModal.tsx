/**
 * Bulk Remove Access Modal Component
 * Pure UI component for bulk removal confirmation
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

interface BulkRemoveAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  selectedCount: number;
  selectedUsers: Array<{ userName: string; userEmail?: string; accessType?: "viewer" | "editor" }>;
}

/**
 * Bulk remove access modal UI component
 * Pure presentation - no business logic
 */
export const BulkRemoveAccessModal = React.memo(function BulkRemoveAccessModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  selectedCount,
  selectedUsers,
}: BulkRemoveAccessModalProps) {
  const getAccessTypeBadge = (type: "viewer" | "editor") => {
    if (type === "editor") {
      return <Badge variant="success">Editor</Badge>;
    }
    return <Badge variant="info">Viewer</Badge>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Access (Bulk)"
      size="lg"
    >
      <div className="flex flex-col">
        {/* Warning Message */}
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            Warning: Immediate Revocation
          </h3>
          <p className="text-sm text-yellow-800">
            This action will immediately revoke access for {selectedCount} {selectedCount === 1 ? "user" : "users"}. 
            They will no longer be able to view, preview, or edit this document.
          </p>
        </div>

        {/* Selected Users List */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Users to Remove ({selectedCount}):
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[300px] overflow-y-auto space-y-2">
            {selectedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-xs flex-shrink-0">
                  {(() => {
                    const displayName = user.userName !== "this user" ? user.userName : user.userEmail || "TU";
                    const parts = displayName.split(" ");
                    if (parts.length >= 2) {
                      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
                    } else if (displayName.includes("@")) {
                      return displayName.substring(0, 2).toUpperCase();
                    } else {
                      return displayName.substring(0, 2).toUpperCase();
                    }
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    {user.userName !== "this user" ? user.userName : user.userEmail || "this user"}
                  </div>
                  {user.userEmail && (
                    <div className="text-xs text-gray-500 truncate">{user.userEmail}</div>
                  )}
                </div>
                {user.accessType && (
                  <div className="flex-shrink-0">
                    {getAccessTypeBadge(user.accessType)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Note */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            This action is <strong>irreversible</strong>. Are you sure you want to
            remove access for {selectedCount} {selectedCount === 1 ? "user" : "users"}?
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="md"
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
            size="md"
            className="min-w-[140px] bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            {isLoading ? "Removing..." : `Remove ${selectedCount} ${selectedCount === 1 ? "User" : "Users"}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

