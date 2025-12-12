/**
 * Pagination UI State Hook
 * Based on R5 rules
 */

import { useState, useCallback, useMemo } from "react";

interface UsePaginationParams {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Pagination state management hook
 * Handles page navigation and page size changes
 */
export function usePagination(
  params?: UsePaginationParams
): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 20, totalItems = 0 } =
    params || {};

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const canGoNext = useMemo(() => page < totalPages, [page, totalPages]);
  const canGoPrevious = useMemo(() => page > 1, [page]);

  const goToNextPage = useCallback(() => {
    if (canGoNext) {
      setPage((prev) => prev + 1);
    }
  }, [canGoNext]);

  const goToPreviousPage = useCallback(() => {
    if (canGoPrevious) {
      setPage((prev) => prev - 1);
    }
  }, [canGoPrevious]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
  };
}

