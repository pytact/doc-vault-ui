/**
 * Document Assignment Context
 * Based on R6 context management rules
 * Provides document assignment state management for F-004 feature
 * 
 * Manages cross-screen state for document assignment management:
 * - Assignment list refresh triggers
 * - Selected assignment state (for cross-component communication)
 * - Assignment list filters (optional, can be component state)
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DocumentAssignmentListParams } from "@/modules/f004-sharing/types/requests/document-assignment";

interface DocumentAssignmentContextValue {
  // Assignment list filters (optional, for persistence across navigation)
  listFilters: DocumentAssignmentListParams | null;
  setListFilters: (filters: DocumentAssignmentListParams | null) => void;
  clearFilters: () => void;
  
  // Selected assignment (for cross-component communication)
  selectedAssignmentUserId: string | null;
  setSelectedAssignmentUserId: (userId: string | null) => void;
  
  // Current document ID (for assignment operations)
  currentDocumentId: string | null;
  setCurrentDocumentId: (documentId: string | null) => void;
  
  // Refresh trigger
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const DocumentAssignmentContext = createContext<DocumentAssignmentContextValue | undefined>(undefined);

interface DocumentAssignmentProviderProps {
  children: React.ReactNode;
}

/**
 * DocumentAssignmentProvider component
 * Manages document assignment list filters, selected assignment, and refresh triggers
 * 
 * This context helps:
 * - Persist assignment list filters across navigation
 * - Manage selected assignment state for cross-screen interactions
 * - Trigger assignment list refreshes after mutations
 */
export function DocumentAssignmentProvider({ children }: DocumentAssignmentProviderProps) {
  const [listFilters, setListFiltersState] = useState<DocumentAssignmentListParams | null>(null);
  const [selectedAssignmentUserId, setSelectedAssignmentUserIdState] = useState<string | null>(null);
  const [currentDocumentId, setCurrentDocumentIdState] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setListFilters = useCallback((filters: DocumentAssignmentListParams | null) => {
    setListFiltersState(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setListFiltersState(null);
  }, []);

  const setSelectedAssignmentUserId = useCallback((userId: string | null) => {
    setSelectedAssignmentUserIdState(userId);
  }, []);

  const setCurrentDocumentId = useCallback((documentId: string | null) => {
    setCurrentDocumentIdState(documentId);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value: DocumentAssignmentContextValue = {
    listFilters,
    setListFilters,
    clearFilters,
    selectedAssignmentUserId,
    setSelectedAssignmentUserId,
    currentDocumentId,
    setCurrentDocumentId,
    refreshTrigger,
    triggerRefresh,
  };

  return (
    <DocumentAssignmentContext.Provider value={value}>
      {children}
    </DocumentAssignmentContext.Provider>
  );
}

/**
 * useDocumentAssignmentContext hook
 * Custom hook to consume DocumentAssignmentContext
 * Must be used within DocumentAssignmentProvider
 * 
 * @returns Document assignment context value with filters, selected assignment, and refresh trigger
 * @throws Error if used outside DocumentAssignmentProvider
 */
export function useDocumentAssignmentContext(): DocumentAssignmentContextValue {
  const context = useContext(DocumentAssignmentContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentAssignmentContext must be used within a DocumentAssignmentProvider"
    );
  }
  return context;
}

