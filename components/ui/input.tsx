/**
 * Input Component
 * UI Primitive - Reusable Input component
 * Based on R12, R16 rules
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input component with label, error, and helper text
 * Uses design tokens - no raw values
 */
export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = "block w-full rounded-lg border px-3 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0";
  const normalStyles = "border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500";
  const errorStyles = "border-danger-500 text-danger-900 placeholder:text-danger-400 focus:border-danger-500 focus:ring-danger-500";

  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          baseStyles,
          error ? errorStyles : normalStyles,
          className
        )}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-danger-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

