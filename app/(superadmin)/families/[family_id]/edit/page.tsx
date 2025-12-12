/**
 * Edit Family Page
 * Route: /families/[family_id]/edit
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { FamilyFormContainer } from "@/modules/f001-identity/forms/family.form.container";
import { useParams, useRouter } from "next/navigation";
import { familyRoutes } from "@/utils/routing";

export default function EditFamilyPage() {
  const params = useParams();
  const router = useRouter();
  const familyId = params?.family_id as string;

  const handleSuccess = () => {
    router.push(familyRoutes.detail(familyId));
  };

  const handleCancel = () => {
    router.push(familyRoutes.detail(familyId));
  };

  return (
    <RouteGuard
      requireAuth={true}
      requiredRoles={["superadmin"]}
    >
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Family</h1>
        <FamilyFormContainer
          familyId={familyId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </RouteGuard>
  );
}

