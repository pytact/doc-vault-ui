/**
 * Document List Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DocumentList } from "../components/DocumentList";
import { useListDocuments } from "../hooks/useDocuments";
import { useDocumentPermissions } from "../hooks/useDocumentPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useDocumentContext } from "@/contexts/document.context";
import { useDocumentSearch } from "../hooks/useDocumentSearch";
import { documentRoutes } from "@/utils/routing";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Document list container component
 * Handles business logic and API calls via hooks
 */
export function DocumentListContainer() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { listFilters } = useDocumentContext();
  
  // Search functionality
  const { searchValue, setSearchValue, clearSearch, hasSearch, searchParams } = useDocumentSearch();
  
  // Merge search params with existing filters
  const queryParams = useMemo(() => {
    return {
      ...listFilters,
      ...searchParams,
    };
  }, [listFilters, searchParams]);
  
  const { data: documentsData, isLoading, error } = useListDocuments(queryParams);
  
  const { canCreateDocument } = useDocumentPermissions({
    documentPermission: null,
    currentUserRole: user?.role || null,
    isDocumentDeleted: false,
    hasFile: false,
    isOwner: false,
  });

  const handleUploadDocument = useCallback(() => {
    router.push(documentRoutes.upload);
  }, [router]);

  const handleDocumentClick = useCallback(
    (documentId: string) => {
      router.push(documentRoutes.detail(documentId));
    },
    [router]
  );

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading documents...</div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Failed to load documents
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
        </CardBody>
      </Card>
    );
  }

  const documents = documentsData?.data?.items || [];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardBody>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search documents by title, category, or subcategory..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            {hasSearch && (
              <Button
                onClick={clearSearch}
                variant="outline"
              >
                Clear
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        onUploadDocument={handleUploadDocument}
        canCreateDocument={canCreateDocument}
        onDocumentClick={handleDocumentClick}
      />
    </div>
  );
}

