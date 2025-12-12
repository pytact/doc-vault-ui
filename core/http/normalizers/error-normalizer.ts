/**
 * Error Normalizer
 * Centralized error handling for API responses
 * Based on R8-API Calls & Error Handling rules
 */

import { AxiosError } from "axios";
import { APIErrorResponse } from "@/types/responses/common.responses";

/**
 * Normalizes API errors to a consistent structure
 * @param error - Axios error or any error
 * @returns Normalized error object
 */
export function normalizeAPIError(error: unknown): APIErrorResponse {
  const axiosError = error as AxiosError<APIErrorResponse>;

  // If it's an Axios error with response data
  if (axiosError.response?.data) {
    return axiosError.response.data;
  }

  // If it's an Axios error without response data
  if (axiosError.response) {
    return {
      error: {
        code: "UNKNOWN_ERROR",
        details: [
          {
            field: "general",
            issue: axiosError.message || "An unknown error occurred",
          },
        ],
      },
      message: axiosError.message || "An unknown error occurred",
    };
  }

  // Fallback for non-Axios errors
  const genericError = error as Error;
  return {
    error: {
      code: "UNKNOWN_ERROR",
      details: [
        {
          field: "general",
          issue: genericError.message || "An unknown error occurred",
        },
      ],
    },
    message: genericError.message || "An unknown error occurred",
  };
}

