/**
 * Create Category Page
 * Route: /categories/create
 * Based on R11 rules
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This page shows a message that taxonomy cannot be created.
 * 
 * Access Rules:
 * - All authenticated users can access (but will see read-only message)
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { taxonomyRoutes } from "@/utils/routing";

export default function CreateCategoryPage() {
  const router = useRouter();

  return (
    <RouteGuard requireAuth={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Create Category
          </h1>
          <p className="mt-2 text-slate-600">
            Taxonomy management is not available
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">
              Taxonomy is Read-Only
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-slate-600">
                The taxonomy of categories and subcategories is system-defined
                and immutable. Categories and subcategories cannot be created,
                modified, or deleted.
              </p>
              <p className="text-sm text-slate-500">
                This ensures consistency across all documents and families in the
                system.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => router.push(taxonomyRoutes.list)}
                  variant="primary"
                >
                  View Categories
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </RouteGuard>
  );
}

