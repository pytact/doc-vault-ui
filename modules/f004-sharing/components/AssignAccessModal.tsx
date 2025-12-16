/**
 * Assign Access Modal Component
 * MODAL_ASSIGN_ACCESS - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import type { UserSummary } from "../types/responses/document-assignment";

interface AssignAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userIds: string[], accessType: "viewer" | "editor") => void;
  isLoading?: boolean;
  availableUsers: UserSummary[];
  selectableUsers: UserSummary[];
  disabledUserIds: string[];
  selectedUserIds: string[];
  onToggleUserSelection: (userId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  accessType: "viewer" | "editor";
  onAccessTypeChange: (accessType: "viewer" | "editor") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
}

/**
 * Assign access modal UI component
 * Pure presentation - no business logic
 */
export const AssignAccessModal = React.memo(function AssignAccessModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  availableUsers,
  selectableUsers,
  disabledUserIds,
  selectedUserIds,
  onToggleUserSelection,
  onSelectAll,
  onClearSelection,
  accessType,
  onAccessTypeChange,
  searchQuery,
  onSearchChange,
  selectedCount,
}: AssignAccessModalProps) {
  const accessTypeOptions: SelectOption[] = [
    { value: "viewer", label: "Viewer (Read-only)" },
    { value: "editor", label: "Editor (Edit metadata + replace file)" },
  ];

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return selectableUsers;
    }
    const query = searchQuery.toLowerCase();
    return selectableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }, [selectableUsers, searchQuery]);

  const handleConfirm = () => {
    if (selectedCount > 0) {
      onConfirm(selectedUserIds, accessType);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Access"
      size="lg"
    >
      <div className="flex flex-col max-h-[70vh]">
        {/* Search and Access Type Selection */}
        <div className="space-y-4 mb-4 flex-shrink-0">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
          />
          <Select
            options={accessTypeOptions}
            value={accessType}
            onChange={(e) =>
              onAccessTypeChange(e.target.value as "viewer" | "editor")
            }
            label="Access Type"
            fullWidth
          />
        </div>

        {/* Selection Actions */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="text-sm text-gray-600">
            {selectedCount > 0
              ? `${selectedCount} ${selectedCount === 1 ? "user" : "users"} selected`
              : "No users selected"}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={filteredUsers.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              disabled={selectedCount === 0}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Scrollable User List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 border border-gray-200 rounded-lg p-4 min-h-[200px] max-h-[300px]">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery.trim()
                ? "No users match your search."
                : "No users available to assign."}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUserIds.includes(user.id);
              const isDisabled = disabledUserIds.includes(user.id);
              const isAlreadyAssigned = disabledUserIds.includes(user.id);

              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : isDisabled
                      ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                      : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleUserSelection(user.id)}
                    disabled={isDisabled || isLoading}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    {isAlreadyAssigned && (
                      <span className="text-xs text-gray-500 italic">
                        Already assigned
                      </span>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 flex-shrink-0">
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
            disabled={isLoading || selectedCount === 0}
            size="md"
            className="min-w-[120px]"
          >
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

