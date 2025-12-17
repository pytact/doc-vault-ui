/**
 * Recent Documents Widget Component
 * Widget for displaying recent documents on dashboard
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import Link from "next/link";
import { documentRoutes } from "@/utils/routing";
import { useDocumentListTransform } from "../hooks/useDocumentListTransform";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import type { DocumentResponse } from "../types/responses/document";

interface RecentDocumentsWidgetProps {
  documents: DocumentResponse[];
  isLoading?: boolean;
  maxItems?: number;
}

/**
 * Recent Documents Widget UI component
 * Pure presentation - no business logic
 */
export const RecentDocumentsWidget = React.memo(function RecentDocumentsWidget({
  documents,
  isLoading = false,
  maxItems = 5,
}: RecentDocumentsWidgetProps) {
  const { categoryOptions, allSubcategories } = useTaxonomyContext();
  
  // Create category and subcategory maps for transformation
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    categoryOptions.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categoryOptions]);

  const subcategoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    allSubcategories.forEach((sub) => {
      map.set(sub.id, sub.name);
    });
    return map;
  }, [allSubcategories]);

  const { transformedDocuments } = useDocumentListTransform({ 
    documents: documents.slice(0, maxItems),
    categoryMap,
    subcategoryMap,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          {documents.length > 0 && (
            <Link
              href={documentRoutes.list}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          )}
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {transformedDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No recent documents.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transformedDocuments.map((document) => (
              <Link
                key={document.id}
                href={documentRoutes.detail(document.id)}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {document.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {document.categoryName && (
                        <span>{document.categoryName}</span>
                      )}
                      {document.subcategoryName && (
                        <>
                          <span>•</span>
                          <span>{document.subcategoryName}</span>
                        </>
                      )}
                    </div>
                    {document.expiryDateFormatted && (
                      <p className="mt-1 text-xs text-gray-500">
                        Expires: {document.expiryDateFormatted}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {document.hasFile ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        PDF
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        No File
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
});

