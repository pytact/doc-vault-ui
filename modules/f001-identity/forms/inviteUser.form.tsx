/**
 * Invite User Form Component
 * Pure UI form component for inviting users
 * Based on R10 rules
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InviteUserSchema,
  inviteUserDefaultValues,
  type InviteUserFormSchema,
} from "./inviteUser.schema";

interface InviteUserFormProps {
  onSubmit: (values: InviteUserFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Invite user form UI component
 * Pure presentation - no business logic
 */
export const InviteUserForm = React.memo(function InviteUserForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: InviteUserFormProps) {
  const form = useForm<InviteUserFormSchema>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: inviteUserDefaultValues,
    mode: "onChange",
  });

  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data);
    }),
    [form, onSubmit]
  );

  return (
    <Form form={form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  disabled={isLoading}
                  autoComplete="email"
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Send Invitation
          </Button>
        </div>
      </form>
    </Form>
  );
}

