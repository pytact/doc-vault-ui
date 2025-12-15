/**
 * Create Family Page
 * Route: /families/create
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyFormContainer } from "@/modules/f001-identity/forms/family.form.container";
import { useRouter } from "next/navigation";
import { familyRoutes } from "@/utils/routing";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function CreateFamilyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(familyRoutes.list);
  };

  const handleCancel = () => {
    router.push(familyRoutes.list);
  };

  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.SuperAdmin]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Family</h1>
          <p className="mt-2 text-slate-600">
            Create a new family to organize users and documents
          </p>
        </div>
        <FamilyFormContainer
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </RouteGuard>
  );
}

