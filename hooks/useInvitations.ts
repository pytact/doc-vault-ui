/**
 * Invitation Hooks
 * Based on R5 and R9 rules
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvitationService } from "@/services/invitations/invitation.service";
import {
  UserInviteRequest,
  UserActivateRequest,
} from "@/types/requests/user.requests";
import { InvitationValidateQuery } from "@/types/requests/invitation.requests";
import {
  InvitationCreateResponse,
  InvitationValidationResponse,
  InvitationActivateResponse,
} from "@/types/responses/invitation.responses";

/**
 * Create invitation mutation hook
 * POST /v1/invite/families/{family_id}/users/
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
 * GET /v1/invitations/validate
 */
export function useValidateInvitation(token: string | null) {
  return useQuery({
    queryKey: ["invitation", "validate", token],
    queryFn: () => {
      if (!token) throw new Error("Token is required");
      return InvitationService.validate({ token });
    },
    enabled: !!token,
    staleTime: 0, // Always fresh for validation
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Activate account mutation hook
 * POST /v1/invitations/activate
 */
export function useActivateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserActivateRequest) =>
      InvitationService.activate(payload),
    onSuccess: () => {
      // Invalidate user-related queries after activation
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

