/**
 * Manage Roles Modal Component
 * MODAL_MANAGE_USER_ROLES - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRoleManagement } from "../hooks/useRoleManagement";
import type { RoleInfo } from "../types/responses/user";

interface ManageRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (roleIds: string[]) => void;
  isLoading?: boolean;
  availableRoles: RoleInfo[];
  currentRoleIds: string[];
  userName?: string;
}

/**
 * Manage roles modal UI component
 * Pure presentation - no business logic
 */
export const ManageRolesModal = React.memo(function ManageRolesModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  availableRoles,
  currentRoleIds,
  userName,
}: ManageRolesModalProps) {
  const { selectedRoleIds, toggleRole, canSave } = useRoleManagement({
    availableRoles,
    currentRoleIds,
    canEdit: true,
  });

  const handleConfirm = () => {
    onConfirm(selectedRoleIds);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage User Roles">
      <div className="flex flex-col max-h-[70vh]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {userName && (
            <p className="text-sm text-slate-700">
              Select a role for <strong className="text-slate-900">{userName}</strong>:
            </p>
          )}

          <div className="space-y-3">
            {availableRoles.map((role) => {
              const isSelected = selectedRoleIds.includes(role.id);
              return (
                <label
                  key={role.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-border hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    checked={isSelected}
                    onChange={() => toggleRole(role.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 capitalize">
                      {role.name}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {role.name === "superadmin" && "Full system access"}
                      {role.name === "familyadmin" && "Manage family users and documents"}
                      {role.name === "member" && "View and manage own documents"}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
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
            variant="primary"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading || !canSave}
            size="md"
            className="min-w-[120px]"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

