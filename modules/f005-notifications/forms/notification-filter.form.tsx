/**
 * Notification Filter Form Component
 * Pure UI form component for filtering notifications
 * Based on R10 rules
 */

"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectOption } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  NotificationFilterSchema,
  notificationFilterDefaultValues,
  type NotificationFilterFormSchema,
} from "./notification-filter.schema";

interface NotificationFilterFormProps {
  onSubmit: (values: NotificationFilterFormSchema) => Promise<void> | void;
  onReset?: () => void;
  isLoading?: boolean;
  error?: string | null;
  defaultValues?: Partial<NotificationFilterFormSchema>;
}

/**
 * Reminder type options for filter
 */
const reminderTypeOptions: SelectOption[] = [
  { value: "all", label: "All Reminder Types" },
  { value: "30d", label: "30 Days" },
  { value: "7d", label: "7 Days" },
  { value: "0d", label: "Expires Today" },
];

/**
 * Read status options for filter
 */
const readStatusOptions: SelectOption[] = [
  { value: "all", label: "All Notifications" },
  { value: "unread", label: "Unread Only" },
  { value: "read", label: "Read Only" },
];

/**
 * Sort order options for filter
 */
const sortOrderOptions: SelectOption[] = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

/**
 * Notification filter form UI component
 * Pure presentation - no business logic
 */
export const NotificationFilterForm = React.memo(function NotificationFilterForm({
  onSubmit,
  onReset,
  isLoading = false,
  error,
  defaultValues: propDefaultValues,
}: NotificationFilterFormProps) {
  const formDefaultValues = useMemo(
    () => ({
      ...notificationFilterDefaultValues,
      ...propDefaultValues,
    }),
    [propDefaultValues]
  );

  const form = useForm<NotificationFilterFormSchema>({
    resolver: zodResolver(NotificationFilterSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  // Memoize onSubmit to prevent unnecessary re-renders
  const memoizedOnSubmit = React.useCallback(
    async (data: NotificationFilterFormSchema) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  const handleSubmit = form.handleSubmit(memoizedOnSubmit);

  const handleReset = React.useCallback(() => {
    form.reset(notificationFilterDefaultValues);
    if (onReset) {
      onReset();
    }
  }, [form, onReset]);

  // Extract button text to prevent inline logic in JSX
  const submitButtonText = useMemo(
    () => (isLoading ? "Filtering..." : "Apply Filters"),
    [isLoading]
  );

  // Memoized onChange handler factories to prevent inline functions
  // These return stable handlers that can be used in JSX
  const createReminderTypeHandler = React.useCallback(
    (onChange: (value: string | null) => void) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onChange(value === "all" ? null : value);
      },
    []
  );

  const createReadStatusHandler = React.useCallback(
    (onChange: (value: string | null) => void) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onChange(value === "all" ? null : value);
      },
    []
  );

  const createDateHandler = React.useCallback(
    (onChange: (value: string | null) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value || null);
      },
    []
  );

  const createSortByHandler = React.useCallback(
    (onChange: (value: string | null) => void) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value || null);
      },
    []
  );

  const createSortOrderHandler = React.useCallback(
    (onChange: (value: string | null) => void) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value || null);
      },
    []
  );

  return (
    <Card>
      <CardBody>
        <Form form={form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Reminder Type Filter */}
              <FormField
                control={form.control}
                name="reminder_type"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Reminder Type</FormLabel>
                    <FormControl>
                      <Select
                        options={reminderTypeOptions}
                        value={field.value || "all"}
                        onChange={createReminderTypeHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Read Status Filter */}
              <FormField
                control={form.control}
                name="is_read"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Read Status</FormLabel>
                    <FormControl>
                      <Select
                        options={readStatusOptions}
                        value={field.value || "all"}
                        onChange={createReadStatusHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date From Filter */}
              <FormField
                control={form.control}
                name="date_from"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Date From</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={field.value || ""}
                        onChange={createDateHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date To Filter */}
              <FormField
                control={form.control}
                name="date_to"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Date To</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={field.value || ""}
                        onChange={createDateHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sort By Filter */}
              <FormField
                control={form.control}
                name="sort_by"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Sort By</FormLabel>
                    <FormControl>
                      <Select
                        options={[{ value: "created_at", label: "Created Date" }]}
                        value={field.value || "created_at"}
                        onChange={createSortByHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sort Order Filter */}
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Select
                        options={sortOrderOptions}
                        value={field.value || "desc"}
                        onChange={createSortOrderHandler(field.onChange)}
                        error={fieldState.error?.message}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {submitButtonText}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
});

