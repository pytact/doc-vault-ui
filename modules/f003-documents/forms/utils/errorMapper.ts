/**
 * API Error to Form Error Mapper
 * Maps API 422 errors to React Hook Form field errors
 * Based on R10 rules
 */

import { UseFormSetError, FieldValues } from "react-hook-form";
import type { APIErrorResponse } from "@/types/responses/common";

/**
 * Maps API error response to form field errors
 * @param error - API error response
 * @param setError - React Hook Form setError function
 */
export function mapApiErrorsToForm<T extends FieldValues>(
  error: APIErrorResponse | null | undefined,
  setError: UseFormSetError<T>
) {
  if (!error?.error?.details) {
    return;
  }

  error.error.details.forEach((detail) => {
    const fieldName = detail.field as keyof T;
    if (fieldName) {
      setError(fieldName, {
        type: "server",
        message: detail.issue,
      });
    }
  });
}

