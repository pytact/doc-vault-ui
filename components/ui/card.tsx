/**
 * Card Component
 * UI Primitive - Reusable Card component
 * Based on R12, R16 rules
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated";
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card component with variants
 * Uses design tokens - no raw values
 */
export function Card({
  children,
  variant = "default",
  className,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    outlined: "bg-transparent border-2 border-gray-300",
    elevated: "bg-white shadow-xl border border-gray-100",
  };

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader component
 */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn("px-6 py-4 border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardBody component
 */
export function CardBody({
  children,
  className,
  ...props
}: CardBodyProps) {
  return (
    <div
      className={cn("px-6 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardFooter component
 */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn("px-6 py-4 border-t border-gray-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

