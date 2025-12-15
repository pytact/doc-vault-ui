/**
 * Category Detail Page
 * Route: /categories/[id]
 * Based on R11 rules
 * 
 * Access Rules:
 * - All authenticated users can view category details (read-only)
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { TaxonomyDetailContainer } from "@/modules/f002-categories/containers/TaxonomyDetailContainer";

export default function CategoryDetailPage() {
  return (
    <RouteGuard requireAuth={true}>
      <TaxonomyDetailContainer />
    </RouteGuard>
  );
}

