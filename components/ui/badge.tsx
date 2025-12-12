/**
 * Badge Component
 * UI Primitive - Reusable Badge component
 * Based on R12, R16 rules
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  size?: "sm" | "md" | "lg";
}

/**
 * Badge component with variants and sizes
 * Uses design tokens - no raw values
 */
export function Badge({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-medium rounded-full";

  const variants = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    danger: "bg-danger-100 text-danger-800",
    warning: "bg-warning-100 text-warning-800",
    info: "bg-info-100 text-info-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

