/**
 * Document Sharing Component
 * SCR_DOCUMENT_SHARING - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import type { DocumentAssignmentResponse } from "../types/responses/document-assignment";

interface TransformedAssignmentItem extends DocumentAssignmentResponse {
  assignedAtFormatted: string;
  updatedAtFormatted: string;
  accessTypeLabel: string;
  accessTypeColor: "blue" | "green" | "gray";
  userDisplayName: string;
  userInitials: string;
}

interface DocumentSharingProps {
  assignments: TransformedAssignmentItem[];
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  accessTypeFilter: "viewer" | "editor" | "all";
  onAccessTypeFilterChange: (filter: "viewer" | "editor" | "all") => void;
  onAddPeople: () => void;
  onRemoveAssignment: (userId: string, assignment?: TransformedAssignmentItem) => void;
  onBulkRemove: (userIds: string[]) => void;
  selectedUserIds: string[];
  onToggleSelection: (userId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  canManageSharing: boolean;
  totalAssignments: number;
  viewerCount: number;
  editorCount: number;
}

/**
 * Document sharing UI component
 * Pure presentation - no business logic
 */
export const DocumentSharing = React.memo(function DocumentSharing({
  assignments,
  isLoading = false,
  searchQuery,
  onSearchChange,
  accessTypeFilter,
  onAccessTypeFilterChange,
  onAddPeople,
  onRemoveAssignment,
  onBulkRemove,
  selectedUserIds,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  canManageSharing,
  totalAssignments,
  viewerCount,
  editorCount,
}: DocumentSharingProps) {
  const accessTypeOptions: SelectOption[] = React.useMemo(() => [
    { value: "all", label: "All Access Types" },
    { value: "viewer", label: "Viewer Only" },
    { value: "editor", label: "Editor Only" },
  ], []);

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  const handleAccessTypeFilterChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onAccessTypeFilterChange(e.target.value as "viewer" | "editor" | "all");
  }, [onAccessTypeFilterChange]);

  const handleRemoveAssignment = React.useCallback((userId: string, assignment: TransformedAssignmentItem) => {
    onRemoveAssignment(userId, assignment);
  }, [onRemoveAssignment]);

  const getAccessTypeBadge = React.useCallback((accessType: "viewer" | "editor") => {
    if (accessType === "editor") {
      return <Badge variant="success">Editor</Badge>;
    }
    return <Badge variant="info">Viewer</Badge>;
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading assignments...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Sharing</h1>
            <p className="mt-1 text-sm text-gray-600">
              {totalAssignments === 0
                ? "No users have access to this document"
                : `${totalAssignments} ${totalAssignments === 1 ? "person has" : "people have"} access (${viewerCount} viewer${viewerCount !== 1 ? "s" : ""}, ${editorCount} editor${editorCount !== 1 ? "s" : ""})`}
            </p>
          </div>
          {canManageSharing && (
            <div className="flex gap-2">
              {selectedUserIds.length > 0 && (
                <Button
                  onClick={() => onBulkRemove(selectedUserIds)}
                  variant="danger"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Remove Selected ({selectedUserIds.length})
                </Button>
              )}
              <Button onClick={onAddPeople} variant="primary">
                Add People
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            />
          </div>
          <div className="w-48">
            <Select
              options={accessTypeOptions}
              value={accessTypeFilter}
              onChange={handleAccessTypeFilterChange}
              fullWidth
            />
          </div>
        </div>

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery || accessTypeFilter !== "all"
              ? "No assignments match your filters."
              : "No users have been assigned access to this document yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {canManageSharing && (
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length === assignments.length && assignments.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectAll();
                          } else {
                            onClearSelection();
                          }
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300"
                        aria-label="Select all users"
                      />
                    </TableHead>
                  )}
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead className="min-w-[120px]">Access Type</TableHead>
                  <TableHead className="min-w-[150px]">Assigned</TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const userId = assignment.assign_to_user_id || assignment.user?.id;
                  const isRowSelected = selectedUserIds.includes(userId);
                  
                  return (
                  <TableRow 
                    key={userId || assignment.id}
                    className={isRowSelected ? "bg-primary-50" : ""}
                  >
                    {canManageSharing && (
                      <TableCell className="w-12">
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => onToggleSelection(userId)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded border-gray-300"
                          aria-label={`Select ${assignment.userDisplayName}`}
                        />
                      </TableCell>
                    )}
                    <TableCell className="min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-medium text-sm flex-shrink-0">
                          {assignment.userInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {assignment.userDisplayName}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {assignment.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {getAccessTypeBadge(assignment.access_type)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 min-w-[150px]">
                      {assignment.assignedAtFormatted}
                    </TableCell>
                    <TableCell className="min-w-[100px] whitespace-nowrap">
                      {canManageSharing ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const userIdToRemove = assignment.assign_to_user_id || assignment.user?.id;
                            if (!userIdToRemove) {
                              return;
                            }
                            handleRemoveAssignment(userIdToRemove, assignment);
                          }}
                          className="min-w-[80px] bg-red-600 hover:bg-red-700 text-white"
                          disabled={!userId}
                        >
                          Remove
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
});

