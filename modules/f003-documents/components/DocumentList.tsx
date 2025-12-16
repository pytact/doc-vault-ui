/**
 * Document List Component
 * SCR_DOCUMENT_LIST - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { useDocumentListTransform } from "../hooks/useDocumentListTransform";
import { useTaxonomyContext } from "@/contexts/taxonomy.context";
import type { DocumentResponse } from "../types/responses/document";
import Link from "next/link";
import { documentRoutes } from "@/utils/routing";

/**
 * Document Table Row Component
 * Memoized row component to prevent unnecessary re-renders
 */
interface DocumentTableRowProps {
  document: {
    id: string;
    title: string;
    categoryName?: string;
    category_id: string;
    subcategoryName?: string;
    subcategory_id: string;
    expiryDateFormatted: string | null;
    isExpired: boolean;
    hasFile: boolean;
    fileSizeFormatted: string | null;
    permission: "owner" | "editor" | "viewer";
    createdAtFormatted: string;
  };
  onDocumentClick?: (documentId: string) => void;
  getPermissionBadge: (permission: "owner" | "editor" | "viewer") => React.ReactElement;
}

const DocumentTableRow = React.memo(function DocumentTableRow({
  document,
  onDocumentClick,
  getPermissionBadge,
}: DocumentTableRowProps) {
  const detailRoute = documentRoutes.detail(document.id);
  const handleDocumentClick = React.useCallback(
    () => {
      if (onDocumentClick) {
        onDocumentClick(document.id);
      }
    },
    [onDocumentClick, document.id]
  );

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50"
    >
      <TableCell>
        {onDocumentClick ? (
          <button
            onClick={handleDocumentClick}
            className="font-medium text-primary-600 hover:text-primary-700 text-left"
          >
            {document.title}
          </button>
        ) : (
          <Link
            href={detailRoute}
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {document.title}
          </Link>
        )}
      </TableCell>
      <TableCell>
        {document.categoryName || document.category_id}
      </TableCell>
      <TableCell>
        {document.subcategoryName || document.subcategory_id}
      </TableCell>
      <TableCell>
        {document.expiryDateFormatted ? (
          document.isExpired ? (
            <span className="text-danger-600">
              {document.expiryDateFormatted}
            </span>
          ) : (
            document.expiryDateFormatted
          )
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </TableCell>
      <TableCell>
        {document.hasFile ? (
          <Badge variant="success">
            {document.fileSizeFormatted || "PDF"}
          </Badge>
        ) : (
          <Badge variant="secondary">No File</Badge>
        )}
      </TableCell>
      <TableCell>
        {getPermissionBadge(document.permission)}
      </TableCell>
      <TableCell>{document.createdAtFormatted}</TableCell>
    </TableRow>
  );
});

interface DocumentListProps {
  documents: DocumentResponse[];
  isLoading?: boolean;
  onUploadDocument: () => void;
  canCreateDocument: boolean;
  title?: string;
  description?: string;
  onDocumentClick?: (documentId: string) => void;
}

/**
 * Document list UI component
 * Pure presentation - no business logic
 */
export const DocumentList = React.memo(function DocumentList({
  documents,
  isLoading = false,
  onUploadDocument,
  canCreateDocument,
  title = "Documents",
  description = "Manage your family documents",
  onDocumentClick,
}: DocumentListProps) {
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

  const { transformedDocuments, totalDocuments, documentsWithFiles, expiredDocuments } = 
    useDocumentListTransform({ 
      documents,
      categoryMap,
      subcategoryMap,
    });

  const getPermissionBadge = React.useCallback(
    (permission: "owner" | "editor" | "viewer") => {
      switch (permission) {
        case "owner":
          return <Badge variant="primary">Owner</Badge>;
        case "editor":
          return <Badge variant="secondary">Editor</Badge>;
        case "viewer":
          return <Badge variant="subtle">Viewer</Badge>;
        default:
          return <Badge>{permission}</Badge>;
      }
    },
    []
  );

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">Loading documents...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            {totalDocuments > 0 && (
              <div className="mt-2 flex gap-4 text-xs text-gray-500">
                <span>Total: {totalDocuments}</span>
                <span>With Files: {documentsWithFiles}</span>
                {expiredDocuments > 0 && (
                  <span className="text-danger-600">Expired: {expiredDocuments}</span>
                )}
              </div>
            )}
          </div>
          {canCreateDocument && (
            <Button onClick={onUploadDocument} variant="primary">
              Upload Document
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        {transformedDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {canCreateDocument ? (
              <>
                <p>No documents found.</p>
                <Button
                  onClick={onUploadDocument}
                  variant="primary"
                  className="mt-4"
                >
                  Upload Your First Document
                </Button>
              </>
            ) : (
              <p>No documents available.</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transformedDocuments.map((document) => (
                <DocumentTableRow
                  key={document.id}
                  document={document}
                  onDocumentClick={onDocumentClick}
                  getPermissionBadge={getPermissionBadge}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
});

