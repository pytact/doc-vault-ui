/**
 * Taxonomy List Container Component
 * Container with hooks and business logic for taxonomy list page
 * Based on R7, R11 rules
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This container displays all categories and subcategories.
 */

"use client";

import React from "react";
import { useListTaxonomy, useTaxonomyData } from "../hooks";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taxonomyRoutes } from "@/utils/routing";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Taxonomy list container component
 * Handles business logic and displays taxonomy data
 */
export function TaxonomyListContainer() {
  // These hooks are only called when user is authenticated (component is behind RouteGuard)
  // Pass enabled: true to ensure data is fetched
  const { data: taxonomy, isLoading, error } = useListTaxonomy(undefined, true);
  const { categories, allSubcategories } = useTaxonomyData(true);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading taxonomy...</p>
        </div>
      </div>
    );
  }

  const handleRetry = React.useCallback(() => {
    router.refresh();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-danger-600">
            Failed to load taxonomy
          </p>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <Button
            onClick={handleRetry}
            variant="primary"
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Categories & Subcategories
        </h1>
        <p className="mt-2 text-slate-600">
          View the complete taxonomy of document categories and subcategories.
          This taxonomy is immutable and cannot be modified.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">
                  {category.name}
                </h3>
                <Badge variant="secondary">
                  {category.subcategories.length} subcategories
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 mb-3">
                  Subcategories:
                </p>
                <ul className="space-y-1">
                  {category.subcategories.slice(0, 5).map((subcategory) => (
                    <li
                      key={subcategory.id}
                      className="text-sm text-slate-700 pl-2 border-l-2 border-primary-200"
                    >
                      {subcategory.name}
                    </li>
                  ))}
                  {category.subcategories.length > 5 && (
                    <li className="text-xs text-slate-500 italic">
                      +{category.subcategories.length - 5} more...
                    </li>
                  )}
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Link
                    href={taxonomyRoutes.detail(category.id)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Total:</strong> {categories.length} categories,{" "}
          {allSubcategories.length} subcategories
        </p>
        <p className="text-xs text-slate-500 mt-1">
          This taxonomy is system-defined and cannot be modified.
        </p>
      </div>
    </div>
  );
}

