/**
 * Authentication Hooks
 * Based on R5 and R9 rules
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth/auth.service";
import { AuthLoginRequest } from "@/types/requests/auth.requests";
import {
  AuthLoginResponse,
  AuthLogoutResponse,
} from "@/types/responses/auth.responses";
import { sessionStorageKeys } from "@/utils/constants/common";

/**
 * Login mutation hook
 * POST /v1/auth/login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AuthLoginRequest) => AuthService.login(payload),
    onSuccess: () => {
      // Invalidate user-related queries after login
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

/**
 * Logout mutation hook
 * POST /v1/auth/logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
}

