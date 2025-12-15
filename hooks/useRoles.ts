/**
 * Role Hooks
 * Based on R5 and R9 rules
 */

import { useQuery } from "@tanstack/react-query";
import { RoleService } from "@/services/roles/role.service";
import { RoleListResponse } from "@/modules/f001-identity/types/responses/role";

/**
 * Role list query hook
 * GET /v1/roles
 * Static data - roles are predefined and rarely change
 */
export function useRoleList() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => RoleService.list(),
    staleTime: Infinity, // Static data - never stale
    gcTime: Infinity, // Keep in cache forever
    refetchOnWindowFocus: false,
  });
}

