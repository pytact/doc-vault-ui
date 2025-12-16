/**
 * Document Context
 * Based on R6 context management rules
 * Provides document list filters and selected document state for F-003 feature
 * 
 * Manages cross-screen state for document management:
 * - Document list filters (persist across navigation)
 * - Selected document state
 * - Document list refresh triggers
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DocumentListParams } from "@/modules/f003-documents/types/requests/document";

interface DocumentContextValue {
  // Document list filters
  listFilters: DocumentListParams | null;
  setListFilters: (filters: DocumentListParams | null) => void;
  clearFilters: () => void;
  
  // Selected document
  selectedDocumentId: string | null;
  setSelectedDocumentId: (documentId: string | null) => void;
  
  // Refresh trigger
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const DocumentContext = createContext<DocumentContextValue | undefined>(undefined);

interface DocumentProviderProps {
  children: React.ReactNode;
}

/**
 * DocumentProvider component
 * Manages document list filters and selected document state
 * 
 * This context helps persist document list filters across navigation
 * and manage selected document state for cross-screen interactions.
 */
export function DocumentProvider({ children }: DocumentProviderProps) {
  const [listFilters, setListFiltersState] = useState<DocumentListParams | null>(null);
  const [selectedDocumentId, setSelectedDocumentIdState] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setListFilters = useCallback((filters: DocumentListParams | null) => {
    setListFiltersState(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setListFiltersState(null);
  }, []);

  const setSelectedDocumentId = useCallback((documentId: string | null) => {
    setSelectedDocumentIdState(documentId);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value: DocumentContextValue = {
    listFilters,
    setListFilters,
    clearFilters,
    selectedDocumentId,
    setSelectedDocumentId,
    refreshTrigger,
    triggerRefresh,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

/**
 * useDocumentContext hook
 * Custom hook to consume DocumentContext
 * Must be used within DocumentProvider
 * 
 * @returns Document context value with filters, selected document, and refresh trigger
 * @throws Error if used outside DocumentProvider
 */
export function useDocumentContext(): DocumentContextValue {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentContext must be used within a DocumentProvider"
    );
  }
  return context;
}

