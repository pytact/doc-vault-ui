/**
 * Document Preview Container Component
 * Container with hooks and PDF viewer
 * Based on R7 rules
 */

"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetDocument } from "../hooks/useDocuments";
import { useDocumentDetailTransform } from "../hooks/useDocumentDetailTransform";
import { useDocumentPermissions } from "../hooks/useDocumentPermissions";
import { useAuthContext } from "@/contexts/auth.context";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import { DocumentService } from "@/services/documents/document.service";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { documentRoutes } from "@/utils/routing";
import { useNotificationContext } from "@/contexts/notification.context";

/**
 * Document preview container component
 * Handles business logic and PDF viewing
 */
export function DocumentPreviewContainer() {
  const params = useParams();
  const router = useRouter();
  const documentId = params?.id as string;
  const { user } = useAuthContext();
  const { addNotification } = useNotificationContext();
  const { categoryOptions, allSubcategories } = useTaxonomyContext();
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const { data: documentData, isLoading, error } = useGetDocument(documentId);

  // Create category and subcategory maps for transformation
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categoryOptions.forEach((cat) => {
      map.set(cat.id, cat.name);
    });
    return map;
  }, [categoryOptions]);

  const subcategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    allSubcategories.forEach((sub) => {
      map.set(sub.id, sub.name);
    });
    return map;
  }, [allSubcategories]);

  const { transformedDocument, canPreview, canDownload } =
    useDocumentDetailTransform({
      document: documentData?.data?.data,
      categoryMap,
      subcategoryMap,
    });

  // Load PDF file when document data is available
  useEffect(() => {
    let currentUrl: string | null = null;

    const loadPdf = async () => {
      if (!documentId || !canPreview) {
        return;
      }

      setIsLoadingPdf(true);
      setPdfError(null);

      try {
        const blob = await DocumentService.getFile(documentId, "preview");
        const url = URL.createObjectURL(blob);
        currentUrl = url;
        setPdfUrl(url);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load PDF preview";
        setPdfError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
          title: "Preview Failed",
        });
      } finally {
        setIsLoadingPdf(false);
      }
    };

    loadPdf();

    // Cleanup: revoke object URL when component unmounts or dependencies change
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      // Also clean up any existing URL in state
      setPdfUrl((url) => {
        if (url && url !== currentUrl) {
          URL.revokeObjectURL(url);
        }
        return null;
      });
    };
  }, [documentId, canPreview, addNotification]);

  const handleBack = useCallback(() => {
    router.push(documentRoutes.detail(documentId));
  }, [router, documentId]);

  const handleDownload = useCallback(async () => {
    if (!documentId || !transformedDocument) return;

    try {
      const blob = await DocumentService.getFile(documentId, "download");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${transformedDocument.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification({
        type: "success",
        message: "Document download started",
        title: "Download",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to download document",
        title: "Download Failed",
      });
    }
  }, [documentId, transformedDocument, addNotification]);

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading document...</div>
        </CardBody>
      </Card>
    );
  }

  if (error || !transformedDocument) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Failed to load document
            </p>
            <p className="mt-2 text-gray-600">
              {error?.message || "Document not found"}
            </p>
            <Button
              onClick={() => router.push(documentRoutes.list)}
              variant="primary"
              className="mt-4"
            >
              Back to Documents
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (transformedDocument.is_del) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Document Not Accessible
            </p>
            <p className="mt-2 text-gray-600">
              This document has been deleted and is no longer accessible.
            </p>
            <Button
              onClick={() => router.push(documentRoutes.list)}
              variant="primary"
              className="mt-4"
            >
              Back to Documents
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!canPreview) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-danger-600">
              Access Denied
            </p>
            <p className="mt-2 text-gray-600">
              You do not have permission to preview this document.
            </p>
            <Button
              onClick={handleBack}
              variant="primary"
              className="mt-4"
            >
              Back to Document
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Note: We don't check hasFile here because the file might be accessible
  // via the endpoint even if file_path/file_size are null in the response
  // The preview will attempt to load the file and show an error if it doesn't exist

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {transformedDocument.title}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {transformedDocument.categoryName && transformedDocument.subcategoryName
                  ? `${transformedDocument.categoryName} / ${transformedDocument.subcategoryName}`
                  : "Document Preview"}
              </p>
            </div>
            <div className="flex gap-2">
              {canDownload && (
                <Button onClick={handleDownload} variant="outline">
                  Download PDF
                </Button>
              )}
              <Button onClick={handleBack} variant="outline">
                Back to Document
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        {isLoadingPdf ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PDF...</p>
            </div>
          </div>
        ) : pdfError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg font-semibold text-danger-600">
                Preview Not Available
              </p>
              <p className="mt-2 text-gray-600">{pdfError}</p>
              {canDownload && (
                <Button
                  onClick={handleDownload}
                  variant="primary"
                  className="mt-4"
                >
                  Download Instead
                </Button>
              )}
            </div>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={`Preview: ${transformedDocument.title}`}
          />
        ) : null}
      </div>
    </div>
  );
}

