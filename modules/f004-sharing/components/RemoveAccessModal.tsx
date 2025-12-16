/**
 * Remove Access Modal Component
 * MODAL_REMOVE_ACCESS - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

interface RemoveAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  userName?: string;
  userEmail?: string;
  accessType?: "viewer" | "editor";
}

/**
 * Remove access modal UI component
 * Pure presentation - no business logic
 */
export const RemoveAccessModal = React.memo(function RemoveAccessModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  userName = "this user",
  userEmail,
  accessType,
}: RemoveAccessModalProps) {
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
      title="Remove Access"
      size="md"
    >
      <div className="flex flex-col">
        {/* Warning Message */}
        <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            Warning: Immediate Revocation
          </h3>
          <p className="text-sm text-yellow-800">
            This action will immediately revoke access. The user will no longer be
            able to view, preview, or edit this document.
          </p>
        </div>

        {/* User Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            User to Remove:
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm flex-shrink-0">
                {(() => {
                  const displayName = userName !== "this user" ? userName : userEmail || "TU";
                  const parts = displayName.split(" ");
                  if (parts.length >= 2) {
                    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
                  } else if (displayName.includes("@")) {
                    // If it's an email, use first two letters
                    return displayName.substring(0, 2).toUpperCase();
                  } else {
                    return displayName.substring(0, 2).toUpperCase();
                  }
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {userName !== "this user" ? userName : userEmail || "this user"}
                </div>
                {userEmail && (
                  <div className="text-sm text-gray-500 truncate">{userEmail}</div>
                )}
                {!userEmail && userName === "this user" && (
                  <div className="text-sm text-gray-400 italic">Email not available</div>
                )}
              </div>
            </div>
            {accessType && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600 mr-2">Access Type:</span>
                {getAccessTypeBadge(accessType)}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Note */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            This action is <strong>irreversible</strong>. Are you sure you want to
            remove access for {userName !== "this user" ? userName : userEmail || "this user"}?
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
            {isLoading ? "Removing..." : "Remove Access"}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

