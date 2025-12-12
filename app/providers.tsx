/**
 * Providers Component
 * Wraps all context providers and React Query
 * Based on R11 rules
 */

"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth.context";
import { FamilyProvider } from "@/contexts/family.context";
import { NotificationProvider } from "@/contexts/notification.context";

// Create a client instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FamilyProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </FamilyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

