/**
 * SuperAdmin Family Hooks
 * Based on R5 and R9 rules
 * F-007 SuperAdmin Console - Family management hooks
 * 
 * Note: These hooks use SuperAdminFamilyService which provides
 * the same endpoints as FamilyService but organized for SuperAdmin usage.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { SuperAdminFamilyService } from "@/services/superadmin/family.service";
import {
  FamilyCreateRequest,
  FamilyUpdateRequest,
  FamilyListParams,
} from "../types/requests/family";
import {
  FamilyListResponse,
  FamilyMutationResponse,
} from "../types/responses/family";

/**
 * Family list query hook
 * GET /v1/families
 */
export function useFamilyList(params?: FamilyListParams) {
  return useQuery({
    queryKey: [
      "families",
      "superadmin",
      params?.skip,
      params?.take,
      params?.search,
      params?.status,
      params?.sortBy,
      params?.sortOrder,
    ],
    queryFn: () => SuperAdminFamilyService.list(params),
    staleTime: 30_000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Keep previous data during pagination
    refetchOnWindowFocus: false,
  });
}

/**
 * Family detail query hook
 * GET /v1/families/{family_id}
 * Returns data with eTag for update operations
 */
export function useGetFamily(familyId: string | null) {
  return useQuery({
    queryKey: ["family", "superadmin", familyId],
    queryFn: async () => {
      if (!familyId) throw new Error("Family ID is required");
      const result = await SuperAdminFamilyService.getById(familyId);
      return {
        data: result.data,
        etag: result.etag,
      };
    },
    enabled: !!familyId,
    staleTime: 5 * 60 * 1000, // 5 minutes - detail data is more stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch on focus for detail views
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
      SuperAdminFamilyService.create(payload),
    onSuccess: () => {
      // Invalidate family list queries
      queryClient.invalidateQueries({ queryKey: ["families", "superadmin"] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
      
      // Invalidate analytics dashboard (family count will change)
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
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
    }) => SuperAdminFamilyService.update(familyId, payload, etag),
    onSuccess: (data, variables) => {
      // Invalidate family list queries
      queryClient.invalidateQueries({ queryKey: ["families", "superadmin"] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
      
      // Invalidate specific family detail
      queryClient.invalidateQueries({
        queryKey: ["family", "superadmin", variables.familyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["family", variables.familyId],
      });
    },
  });
}

/**
 * Delete family mutation hook
 * DELETE /v1/families/{family_id}
 */
export function useDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      etag,
    }: {
      familyId: string;
      etag?: string;
    }) => SuperAdminFamilyService.delete(familyId, etag),
    onSuccess: () => {
      // Invalidate all family-related queries
      queryClient.invalidateQueries({ queryKey: ["families", "superadmin"] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["family", "superadmin"] });
      queryClient.invalidateQueries({ queryKey: ["family"] });
      
      // Invalidate deleted families list
      queryClient.invalidateQueries({ queryKey: ["families", "deleted"] });
      
      // Invalidate analytics dashboard (family count will change)
      queryClient.invalidateQueries({ queryKey: ["analytics", "dashboard"] });
    },
  });
}

