/**
 * Taxonomy Detail Container Component
 * Container with hooks and business logic for category detail page
 * Based on R7, R11 rules
 * 
 * NOTE: F-002 is read-only (immutable taxonomy).
 * This container displays a single category with all its subcategories.
 */

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetTaxonomy } from "../hooks/useTaxonomy";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taxonomyRoutes } from "@/utils/routing";
import Link from "next/link";

/**
 * Taxonomy detail container component
 * Handles business logic and displays category details
 */
export function TaxonomyDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id as string;

  const { data: category, isLoading, error } = useGetTaxonomy(
    categoryId,
    !!categoryId
  );

  const handleBackToList = React.useCallback(() => {
    router.push(taxonomyRoutes.list);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-danger-600">
            Category not found
          </p>
          <p className="mt-2 text-gray-600">
            The requested category could not be found.
          </p>
          <Button
            onClick={handleBackToList}
            className="mt-4"
            variant="outline"
          >
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="mt-2 text-slate-600">
            View all subcategories for this category
          </p>
        </div>
        <Button
          onClick={handleBackToList}
          variant="outline"
        >
          ← Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Subcategories
            </h2>
            <Badge variant="secondary">
              {category.subcategories.length} subcategories
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          {category.subcategories.length === 0 ? (
            <p className="text-slate-500">No subcategories available</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {category.subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="rounded-lg border border-slate-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-slate-900">
                    {subcategory.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ID: {subcategory.id}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Category ID:</strong> {category.id}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          This taxonomy is system-defined and cannot be modified.
        </p>
      </div>
    </div>
  );
}

