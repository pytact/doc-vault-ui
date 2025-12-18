/**
 * SuperAdmin Context
 * Based on R6 context management rules
 * Provides SuperAdmin-specific state management for F-007 SuperAdmin Console
 */

"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useAuthContext } from "./auth.context";

interface SuperAdminContextValue {
  // Selected family for operations (optional - for filtering/context)
  selectedFamilyId: string | null;
  setSelectedFamilyId: (familyId: string | null) => void;
  
  // UI state
  isSuperAdmin: boolean;
  canAccessSuperAdminConsole: boolean;
  
  // Helper methods
  clearSelection: () => void;
}

const SuperAdminContext = createContext<SuperAdminContextValue | undefined>(undefined);

interface SuperAdminProviderProps {
  children: React.ReactNode;
}

/**
 * SuperAdminProvider component
 * Manages SuperAdmin-specific state
 * Only provides context if user is SuperAdmin
 */
export function SuperAdminProvider({ children }: SuperAdminProviderProps) {
  const { isSuperAdmin: userIsSuperAdmin } = useAuthContext();
  const [selectedFamilyId, setSelectedFamilyIdState] = useState<string | null>(null);

  const setSelectedFamilyId = useCallback((familyId: string | null) => {
    setSelectedFamilyIdState(familyId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFamilyIdState(null);
  }, []);

  const canAccessSuperAdminConsole = useMemo(() => {
    return userIsSuperAdmin;
  }, [userIsSuperAdmin]);

  const value: SuperAdminContextValue = {
    selectedFamilyId,
    setSelectedFamilyId,
    isSuperAdmin: userIsSuperAdmin,
    canAccessSuperAdminConsole,
    clearSelection,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
}

/**
 * useSuperAdminContext hook
 * Custom hook to consume SuperAdminContext
 * Must be used within SuperAdminProvider
 * 
 * Note: This context is optional and can be used for SuperAdmin-specific
 * state management. For basic role checks, use useAuthContext() instead.
 */
export function useSuperAdminContext(): SuperAdminContextValue {
  const context = useContext(SuperAdminContext);
  if (context === undefined) {
    throw new Error("useSuperAdminContext must be used within a SuperAdminProvider");
  }
  return context;
}

