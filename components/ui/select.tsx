/**
 * Select Component
 * UI Primitive - Reusable Select/Dropdown component
 * Based on R12, R16 rules
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "value"
  > {
  options: SelectOption[];
  value?: string;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

/**
 * Select component with label, error, and helper text
 * Uses design tokens - no raw values
 */
export function Select({
  options,
  value,
  label,
  error,
  helperText,
  fullWidth = false,
  placeholder,
  className,
  id,
  disabled,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles =
    "block w-full rounded-lg border px-3 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none bg-white";
  const normalStyles =
    "border-gray-300 text-gray-900 focus:border-primary-500 focus:ring-primary-500";
  const errorStyles =
    "border-danger-500 text-danger-900 focus:border-danger-500 focus:ring-danger-500";
  const disabledStyles = "opacity-50 cursor-not-allowed bg-gray-50";

  return (
    <div className={cn("flex flex-col", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value || ""}
          className={cn(
            baseStyles,
            error ? errorStyles : normalStyles,
            disabled && disabledStyles,
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helperText
              ? `${selectId}-helper`
              : undefined
          }
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Dropdown arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-1 text-sm text-danger-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

