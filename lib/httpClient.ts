/**
 * HTTP Client Factory
 * Based on R4-HTTP Client rules
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { sessionStorageKeys } from "@/utils/constants/common";

export interface ApiSuccess<T> {
  success: boolean;
  status?: number;
  data: T;
  message?: string;
}

export interface ApiListResult<T> {
  items: T[];
  total: number;
  take: number;
  skip: number;
  search_term: string;
}

/**
 * Creates a configured Axios instance with interceptors
 * @param apiBaseUrl - Base URL for the API
 * @returns Configured Axios instance
 */
export function createHttpClient(apiBaseUrl: string): AxiosInstance {
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor - injects JWT token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem(sessionStorageKeys.accessToken);
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor - handles errors
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
  );

  return instance;
}

