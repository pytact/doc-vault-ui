/**
 * Authentication Context
 * Based on R6 context management rules
 * Provides global authentication state and methods
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLogin, useLogout } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { LoginUserInfo } from "@/types/responses/auth.responses";
import { sessionStorageKeys } from "@/utils/constants/common";

interface AuthContextValue {
  user: LoginUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  
  // Check if token exists (only on client side)
  const [hasToken, setHasToken] = useState(false);
  
  // Only fetch profile if user is authenticated (has token)
  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useProfile(hasToken);

  // Initialize auth state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem(sessionStorageKeys.accessToken);
      const storedUser = sessionStorage.getItem(sessionStorageKeys.user);

      if (token) {
        setHasToken(true);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as LoginUserInfo;
            setUser(parsedUser);
          } catch (error) {
            // Invalid stored user data, clear it
            sessionStorage.removeItem(sessionStorageKeys.accessToken);
            sessionStorage.removeItem(sessionStorageKeys.user);
            setHasToken(false);
          }
        }
      } else {
        setHasToken(false);
      }
      setIsLoading(false);
    }
  }, []);

  // Update user state when profile data changes (only if authenticated)
  useEffect(() => {
    if (hasToken && profileData?.data) {
      // Note: Role should come from JWT token, not from profile
      // For now, we'll use a default or extract from stored user
      const storedUser = typeof window !== "undefined" 
        ? sessionStorage.getItem(sessionStorageKeys.user)
        : null;
      const parsedStoredUser = storedUser ? JSON.parse(storedUser) as LoginUserInfo : null;
      
      const profileUser: LoginUserInfo = {
        id: profileData.data.id,
        email: profileData.data.email,
        name: profileData.data.name,
        role: parsedStoredUser?.role || "member", // Use stored role or default
        family_id: profileData.data.family_id,
        family_name: profileData.data.family_name,
      };
      setUser(profileUser);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(sessionStorageKeys.user, JSON.stringify(profileUser));
      }
    }
  }, [profileData, hasToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await loginMutation.mutateAsync({ email, password });
        if (response.data?.user) {
          setUser(response.data.user);
          setHasToken(true); // Token is stored by the service
          if (typeof window !== "undefined") {
            sessionStorage.setItem(sessionStorageKeys.user, JSON.stringify(response.data.user));
          }
          return response; // Return response so caller can access user data
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setHasToken(false);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(sessionStorageKeys.accessToken);
        sessionStorage.removeItem(sessionStorageKeys.user);
      }
    } catch (error) {
      // Even if logout fails, clear local state
      setUser(null);
      setHasToken(false);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(sessionStorageKeys.accessToken);
        sessionStorage.removeItem(sessionStorageKeys.user);
      }
    }
  }, [logoutMutation]);

  const refreshUser = useCallback(async () => {
    await refetchProfile();
  }, [refetchProfile]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || profileLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuthContext hook
 * Custom hook to consume AuthContext
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

