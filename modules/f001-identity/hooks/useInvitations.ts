/**
 * Invitation Hooks
 * Based on R5 and R9 rules
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvitationService } from "@/services/invitations/invitation.service";
import {
  UserInviteRequest,
  UserActivateRequest,
} from "../types/requests/user";
import { InvitationValidateQuery } from "../types/requests/invitation";
import {
  InvitationCreateResponse,
  InvitationValidationResponse,
  InvitationActivateResponse,
} from "../types/responses/invitation";

/**
 * Create invitation mutation hook
 * POST /v1/invite
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      payload,
    }: {
      familyId: string;
      payload: UserInviteRequest;
    }) => InvitationService.create(familyId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users", variables.familyId] });
    },
  });
}

/**
 * Validate invitation token query hook
 * GET /v1/invitation/{token}
 */
export function useValidateInvitation(token: string | null) {
  return useQuery({
    queryKey: ["invitation", "validate", token],
    queryFn: () => {
      if (!token) throw new Error("Token is required");
      console.log("useValidateInvitation - Calling validate with token:", token);
      return InvitationService.validate(token);
    },
    enabled: !!token,
    staleTime: 0, // Always fresh for validation
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });
}

/**
 * Activate account mutation hook
 * POST /v1/invitation/activate/{token}
 */
export function useActivateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, ...payload }: UserActivateRequest) =>
      InvitationService.activate(token, payload),
    onSuccess: () => {
      // Invalidate user-related queries after activation
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

