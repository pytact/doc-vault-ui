/**
 * Expiry Notification Context
 * Based on R6 context management rules
 * Provides expiry notification state management for F-005 feature
 * 
 * Manages cross-component state for expiry notifications:
 * - Unread notification count (for badge display in header/nav)
 * - Notification list filters (persist across navigation)
 * - Refresh triggers
 */

"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { NotificationListParams } from "@/modules/f005-notifications/types/requests/notification";

interface ExpiryNotificationContextValue {
  // Unread notification count (for badge display)
  unreadCount: number | null;
  setUnreadCount: (count: number | null) => void;
  
  // Notification list filters
  listFilters: NotificationListParams | null;
  setListFilters: (filters: NotificationListParams | null) => void;
  clearFilters: () => void;
  
  // Refresh trigger
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const ExpiryNotificationContext = createContext<ExpiryNotificationContextValue | undefined>(
  undefined
);

interface ExpiryNotificationProviderProps {
  children: React.ReactNode;
}

/**
 * ExpiryNotificationProvider component
 * Manages expiry notification state across components
 * 
 * This context helps:
 * - Share unread count across header/nav and notification center
 * - Persist notification list filters across navigation
 * - Trigger refreshes across components
 */
export function ExpiryNotificationProvider({
  children,
}: ExpiryNotificationProviderProps) {
  const [unreadCount, setUnreadCountState] = useState<number | null>(null);
  const [listFilters, setListFiltersState] = useState<NotificationListParams | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const setUnreadCount = useCallback((count: number | null) => {
    setUnreadCountState(count);
  }, []);

  const setListFilters = useCallback((filters: NotificationListParams | null) => {
    setListFiltersState(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setListFiltersState(null);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value: ExpiryNotificationContextValue = useMemo(
    () => ({
      unreadCount,
      setUnreadCount,
      listFilters,
      setListFilters,
      clearFilters,
      refreshTrigger,
      triggerRefresh,
    }),
    [unreadCount, setUnreadCount, listFilters, setListFilters, clearFilters, refreshTrigger, triggerRefresh]
  );

  return (
    <ExpiryNotificationContext.Provider value={value}>
      {children}
    </ExpiryNotificationContext.Provider>
  );
}

/**
 * useExpiryNotificationContext hook
 * Custom hook to consume ExpiryNotificationContext
 * Must be used within ExpiryNotificationProvider
 * 
 * @returns Expiry notification context value with unread count, filters, and refresh trigger
 * @throws Error if used outside ExpiryNotificationProvider
 */
export function useExpiryNotificationContext(): ExpiryNotificationContextValue {
  const context = useContext(ExpiryNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useExpiryNotificationContext must be used within an ExpiryNotificationProvider"
    );
  }
  return context;
}

