/**
 * Table Component
 * UI Primitive - Reusable Table component
 * Based on R12, R16 rules
 */

"use client";

import React from "react";
import { cn } from "@/utils/cn";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hover?: boolean;
}

/**
 * Table component with variants
 * Uses design tokens - no raw values
 */
export function Table({
  children,
  className,
  ...props
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          "min-w-full divide-y divide-gray-200",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTheadElement> {}

export function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn("bg-gray-50", className)}
      {...props}
    >
      {children}
    </thead>
  );
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  striped?: boolean;
  hover?: boolean;
}

export function TableBody({
  className,
  children,
  striped = false,
  hover = false,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      className={cn(
        "divide-y divide-gray-200 bg-white",
        striped && "divide-y divide-gray-200 [&>tr:nth-child(even)]:bg-gray-50",
        hover && "[&>tr:hover]:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr className={cn(className)} {...props}>
      {children}
    </tr>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, children, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "whitespace-nowrap px-6 py-4 text-sm text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

