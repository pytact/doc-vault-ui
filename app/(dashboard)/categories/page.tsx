/**
 * Taxonomy List Page
 * Route: /categories
 * Based on R11 rules
 * 
 * Access Rules:
 * - All authenticated users can view taxonomy (read-only)
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { TaxonomyListContainer } from "@/modules/f002-categories/containers/TaxonomyListContainer";

export default function TaxonomyListPage() {
  return (
    <RouteGuard requireAuth={true}>
      <TaxonomyListContainer />
    </RouteGuard>
  );
}

