/**
 * Recent Documents Widget Container Component
 * Container with hooks and context
 * Based on R7 rules
 */

"use client";

import React, { useMemo } from "react";
import { RecentDocumentsWidget } from "../components/RecentDocumentsWidget";
import { useListDocuments } from "../hooks/useDocuments";

/**
 * Recent documents widget container component
 * Handles business logic and API calls via hooks
 */
export function RecentDocumentsWidgetContainer() {
  // Fetch recent documents (sorted by created_at DESC, limited to first page)
  const { data: documentsData, isLoading } = useListDocuments({
    page: 1,
    page_size: 5,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const documents = useMemo(() => {
    return documentsData?.data?.items || [];
  }, [documentsData]);

  return (
    <RecentDocumentsWidget
      documents={documents}
      isLoading={isLoading}
      maxItems={5}
    />
  );
}

