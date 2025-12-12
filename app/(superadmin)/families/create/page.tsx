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
      requiredRoles={["superadmin"]}
    >
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Create Family</h1>
        <FamilyFormContainer
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </RouteGuard>
  );
}

