/**
 * Family Context
 * Based on R6 context management rules
 * Provides current family state for F-001 feature
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useFamily } from "@/hooks/useFamilies";
import { FamilyResponse } from "@/types/responses/family.responses";
import { useAuthContext } from "./auth.context";

interface FamilyContextValue {
  currentFamily: FamilyResponse | null;
  familyId: string | null;
  isLoading: boolean;
  setCurrentFamily: (family: FamilyResponse | null) => void;
  refreshFamily: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined);

interface FamilyProviderProps {
  children: React.ReactNode;
}

/**
 * FamilyProvider component
 * Manages current family state based on authenticated user's family_id
 */
export function FamilyProvider({ children }: FamilyProviderProps) {
  const { user } = useAuthContext();
  const [currentFamily, setCurrentFamilyState] = useState<FamilyResponse | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // Get family ID from user context
  useEffect(() => {
    if (user?.family_id) {
      setFamilyId(user.family_id);
    } else {
      setFamilyId(null);
      setCurrentFamilyState(null);
    }
  }, [user]);

  const { data: familyData, isLoading, refetch: refetchFamily } = useFamily(familyId);

  // Update current family when family data changes
  useEffect(() => {
    if (familyData?.data) {
      setCurrentFamilyState(familyData.data);
    } else {
      setCurrentFamilyState(null);
    }
  }, [familyData]);

  const setCurrentFamily = useCallback((family: FamilyResponse | null) => {
    setCurrentFamilyState(family);
  }, []);

  const refreshFamily = useCallback(async () => {
    if (familyId) {
      await refetchFamily();
    }
  }, [familyId, refetchFamily]);

  const value: FamilyContextValue = {
    currentFamily,
    familyId,
    isLoading,
    setCurrentFamily,
    refreshFamily,
  };

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

/**
 * useFamilyContext hook
 * Custom hook to consume FamilyContext
 * Must be used within FamilyProvider
 */
export function useFamilyContext(): FamilyContextValue {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamilyContext must be used within a FamilyProvider");
  }
  return context;
}

