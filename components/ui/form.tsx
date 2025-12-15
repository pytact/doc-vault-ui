/**
 * Form Components
 * UI Primitives for React Hook Form integration
 * Based on R10, R12, R16 rules
 */

"use client";

import React from "react";
import {
  useFormContext,
  Controller,
  FormProvider,
  type UseFormReturn,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/utils/cn";

/**
 * Form provider component
 * Wraps form context for React Hook Form
 */
export function Form<T extends FieldValues>({
  children,
  ...props
}: {
  children: React.ReactNode;
} & { form: UseFormReturn<T> }) {
  return <FormProvider {...props.form}>{children}</FormProvider>;
}

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: ReturnType<typeof useFormContext<TFieldValues>>["control"];
  name: TName;
  render: (props: {
    field: {
      value: TFieldValues[TName];
      onChange: (value: TFieldValues[TName]) => void;
      onBlur: () => void;
      name: TName;
      ref: React.Ref<HTMLInputElement>;
    };
    fieldState: {
      error?: { message?: string };
      isTouched: boolean;
      isDirty: boolean;
    };
    formState: {
      errors: Partial<Record<keyof TFieldValues, { message?: string }>>;
      isSubmitting: boolean;
    };
  }) => React.ReactElement;
}

/**
 * FormField component
 * Wraps Controller from React Hook Form
 */
export function FormField<TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={(props) => {
        const result = render({
          field: {
            value: props.field.value,
            onChange: props.field.onChange,
            onBlur: props.field.onBlur,
            name: props.field.name,
            ref: props.field.ref,
          },
          fieldState: props.fieldState,
          formState: props.formState,
        });
        return result as React.ReactElement;
      }}
    />
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * FormItem component
 * Container for form field elements
 */
export function FormItem({ className, children, ...props }: FormItemProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * FormLabel component
 * Label for form fields
 */
export function FormLabel({ className, children, ...props }: FormLabelProps) {
  return (
    <label
      className={cn("text-sm font-medium text-gray-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export interface FormControlProps {
  children: React.ReactNode;
}

/**
 * FormControl component
 * Wrapper for form input controls
 */
export function FormControl({ children }: FormControlProps) {
  return <>{children}</>;
}

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  fieldName?: string;
}

/**
 * FormMessage component
 * Displays form field error messages
 * Should be used inside FormField render function to access fieldState
 */
export function FormMessage({ className, fieldName, ...props }: FormMessageProps) {
  const methods = useFormContext();
  
  // If fieldName is provided, use it directly
  if (fieldName) {
    const error = methods.formState.errors[fieldName];
    if (!error?.message) {
      return null;
    }
    return (
      <p
        className={cn("text-sm text-danger-600", className)}
        role="alert"
        {...props}
      >
        {error.message}
      </p>
    );
  }

  // Otherwise, try to get error from context (when used inside FormField)
  // This is a fallback - ideally fieldName should be provided or used via fieldState
  return null;
}

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * FormDescription component
 * Displays helper text for form fields
 */
export function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </p>
  );
}

