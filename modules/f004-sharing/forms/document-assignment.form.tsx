/**
 * Document Assignment Form Component
 * Pure UI form component for assigning document access
 * Based on R10 rules
 */

"use client";

import React, { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectOption } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { DocumentAssignmentFormSchema } from "./document-assignment.schema";
import type { UserSummary } from "../types/responses/document-assignment";

interface DocumentAssignmentFormProps {
  form: UseFormReturn<DocumentAssignmentFormSchema>;
  onSubmit: (values: DocumentAssignmentFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  availableUsers: UserSummary[];
  selectableUsers: UserSummary[];
  disabledUserIds: string[];
  searchQuery: string;
  debouncedSearchQuery?: string;
  onSearchChange: (query: string) => void;
}

/**
 * Document assignment form UI component
 * Pure presentation - no business logic
 */
export const DocumentAssignmentForm = React.memo(function DocumentAssignmentForm({
  form,
  onSubmit,
  onCancel,
  isLoading = false,
  availableUsers,
  selectableUsers,
  disabledUserIds,
  searchQuery,
  debouncedSearchQuery,
  onSearchChange,
}: DocumentAssignmentFormProps) {
  const accessTypeOptions: SelectOption[] = [
    { value: "viewer", label: "Viewer (Read-only)" },
    { value: "editor", label: "Editor (Edit metadata + replace file)" },
  ];

  const selectedUserIds = form.watch("userIds") || [];

  // Filter users based on debounced search query (R14: Performance optimization)
  const filteredUsers = useMemo(() => {
    const query = (debouncedSearchQuery || searchQuery).trim();
    if (!query) {
      return selectableUsers;
    }
    const queryLower = query.toLowerCase();
    return selectableUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(queryLower) ||
        user.email.toLowerCase().includes(queryLower)
    );
  }, [selectableUsers, debouncedSearchQuery, searchQuery]);

  const handleToggleUser = React.useCallback((userId: string) => {
    const currentIds = form.getValues("userIds") || [];
    const newIds = currentIds.includes(userId)
      ? currentIds.filter((id) => id !== userId)
      : [...currentIds, userId];
    form.setValue("userIds", newIds, { shouldValidate: true });
  }, [form]);

  const handleSelectAll = React.useCallback(() => {
    const selectableIds = filteredUsers.map((user) => user.id);
    form.setValue("userIds", selectableIds, { shouldValidate: true });
  }, [filteredUsers, form]);

  const handleClearSelection = React.useCallback(() => {
    form.setValue("userIds", [], { shouldValidate: true });
  }, [form]);

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleAccessTypeChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "viewer" | "editor";
    form.setValue("accessType", value, { shouldValidate: true });
  }, [form]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Form form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Search Input */}
        <div>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
          />
        </div>

        {/* Access Type Field */}
        <FormField
          control={form.control}
          name="accessType"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Access Type *</FormLabel>
              <FormControl>
                <Select
                  options={accessTypeOptions}
                  value={field.value}
                  onChange={handleAccessTypeChange}
                  error={fieldState.error?.message}
                  fullWidth
                />
              </FormControl>
              <FormMessage fieldName="accessType" />
              <FormDescription>
                Select the access level for all selected users
              </FormDescription>
            </FormItem>
          )}
        />

        {/* User Selection */}
        <FormField
          control={form.control}
          name="userIds"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Select Users *</FormLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={filteredUsers.length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    disabled={selectedUserIds.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <FormControl>
                <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto space-y-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery.trim()
                        ? "No users match your search."
                        : "No users available to assign."}
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = field.value?.includes(user.id) || false;
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
                            onChange={() => handleToggleUser(user.id)}
                            disabled={isDisabled || isLoading}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300"
                            aria-label={`Select ${user.name}`}
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
              </FormControl>
              <FormMessage fieldName="userIds" />
              <FormDescription>
                {selectedUserIds.length > 0
                  ? `${selectedUserIds.length} ${selectedUserIds.length === 1 ? "user" : "users"} selected`
                  : "Select at least one user to assign access"}
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            size="md"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || selectedUserIds.length === 0}
            size="md"
            className="min-w-[120px]"
          >
            {isLoading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </form>
    </Form>
  );
});

