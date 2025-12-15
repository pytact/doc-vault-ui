/**
 * Authentication Context
 * Based on R6 context management rules
 * Provides global authentication state and methods
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLogin, useLogout } from "@/modules/f001-identity/hooks/useAuth";
import { useProfile } from "@/modules/f001-identity/hooks/useProfile";
import { LoginUserInfo, AuthLoginResponse } from "@/modules/f001-identity/types/responses/auth";
import { sessionStorageKeys } from "@/utils/constants/common";

interface AuthContextValue {
  user: LoginUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthLoginResponse>;
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
    if (hasToken && profileData?.data?.data) {
      // Get role and permissions from profile data (from /users/me API)
      // API returns role as object { id, name, permissions } and family as object or null
      // Note: profileData.data is now { data: ProfileGetResponse, etag?: string }
      const storedUser = typeof window !== "undefined" 
        ? sessionStorage.getItem(sessionStorageKeys.user)
        : null;
      const parsedStoredUser = storedUser ? JSON.parse(storedUser) as LoginUserInfo : null;
      
      // Extract role name from role object (API returns role as { id, name, permissions })
      // Handle both object and string formats for backward compatibility
      const roleFromApi = profileData.data.data.role;
      const roleName = typeof roleFromApi === 'object' && roleFromApi !== null && 'name' in roleFromApi
        ? roleFromApi.name
        : (typeof roleFromApi === 'string' ? roleFromApi : parsedStoredUser?.role || "member");
      
      // Extract permissions from role object
      const permissions = (typeof roleFromApi === 'object' && roleFromApi !== null && 'permissions' in roleFromApi)
        ? roleFromApi.permissions
        : (parsedStoredUser?.permissions || {});
      
      // Extract family info (API returns family as object or null)
      const familyId = profileData.data.data.family?.id || null;
      const familyName = profileData.data.data.family?.name || null;
      
      const profileUser: LoginUserInfo = {
        id: profileData.data.data.id,
        email: profileData.data.data.email,
        name: profileData.data.data.name,
        role: roleName, // Use role name string from role object
        family_id: familyId,
        family_name: familyName,
        permissions: permissions, // Use permissions from role object
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
          // User data now includes role and permissions from /users/me API (called in auth service)
          setUser(response.data.user);
          setHasToken(true); // Token is stored by the service
          if (typeof window !== "undefined") {
            sessionStorage.setItem(sessionStorageKeys.user, JSON.stringify(response.data.user));
          }
          // Trigger profile refetch to ensure we have the latest data
          await refetchProfile();
          return response; // Return response so caller can access user data
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [loginMutation, refetchProfile]
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

