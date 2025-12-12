/**
 * Family Hooks
 * Based on R5 and R9 rules
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { FamilyService } from "@/services/families/family.service";
import {
  FamilyCreateRequest,
  FamilyUpdateRequest,
  FamilyListParams,
} from "@/types/requests/family.requests";
import {
  FamilyListResponse,
  FamilyDetailResponse,
  FamilyCreateResponse,
  FamilyUpdateResponse,
  FamilySoftDeleteResponse,
} from "@/types/responses/family.responses";

/**
 * Family list query hook
 * GET /v1/families
 */
export function useFamilyList(params?: FamilyListParams) {
  return useQuery({
    queryKey: [
      "families",
      params?.page,
      params?.page_size,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => FamilyService.list(params),
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

/**
 * Family detail query hook
 * GET /v1/families/{family_id}
 */
export function useFamily(familyId: string | null) {
  return useQuery({
    queryKey: ["family", familyId],
    queryFn: () => {
      if (!familyId) throw new Error("Family ID is required");
      return FamilyService.getById(familyId);
    },
    enabled: !!familyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Create family mutation hook
 * POST /v1/families
 */
export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FamilyCreateRequest) =>
      FamilyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}

/**
 * Update family mutation hook
 * PATCH /v1/families/{family_id}
 */
export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      payload,
      etag,
    }: {
      familyId: string;
      payload: FamilyUpdateRequest;
      etag?: string;
    }) => FamilyService.update(familyId, payload, etag),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["family", variables.familyId] });
    },
  });
}

/**
 * Soft delete family mutation hook
 * PATCH /v1/families/{family_id}/soft-delete
 */
export function useSoftDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      etag,
    }: {
      familyId: string;
      etag?: string;
    }) => FamilyService.softDelete(familyId, etag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}

