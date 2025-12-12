/**
 * Change Password Form Component
 * Pure UI form component for password change
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
import { Alert } from "@/components/ui/alert";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import {
  createChangePasswordSchema,
  changePasswordDefaultValues,
  type ChangePasswordFormSchema,
} from "./changePassword.schema";
import type { PasswordRules } from "@/types/responses/common.responses";

interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormSchema) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
  passwordRules?: PasswordRules;
}

/**
 * Change password form UI component
 * Pure presentation - no business logic
 */
export const ChangePasswordForm = React.memo(function ChangePasswordForm({
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  passwordRules,
}: ChangePasswordFormProps) {
  const schema = React.useMemo(
    () => createChangePasswordSchema(passwordRules),
    [passwordRules]
  );
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: changePasswordDefaultValues,
    mode: "onChange",
  });

  const newPasswordValue = form.watch("new_password");
  const passwordValidation = usePasswordValidation({
    password: newPasswordValue || "",
    rules: passwordRules || {
      min_length: 12,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
      disallow_last_5: true,
    },
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
        {error && (
          <Alert variant="error" title="Password Change Failed">
            {error}
          </Alert>
        )}

        <FormField
          control={form.control}
          name="current_password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  error={fieldState.error?.message}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  autoComplete="new-password"
                  error={fieldState.error?.message}
                />
              </FormControl>
              {newPasswordValue && (
                <div className="mt-2 space-y-1 text-sm">
                  <div
                    className={
                      passwordValidation.validation.checks.minLength
                        ? "text-success-600"
                        : "text-gray-500"
                    }
                  >
                    ✓ At least {passwordRules?.min_length || 12} characters
                  </div>
                  <div
                    className={
                      passwordValidation.validation.checks.hasUppercase
                        ? "text-success-600"
                        : "text-gray-500"
                    }
                  >
                    ✓ One uppercase letter
                  </div>
                  <div
                    className={
                      passwordValidation.validation.checks.hasLowercase
                        ? "text-success-600"
                        : "text-gray-500"
                    }
                  >
                    ✓ One lowercase letter
                  </div>
                  <div
                    className={
                      passwordValidation.validation.checks.hasNumber
                        ? "text-success-600"
                        : "text-gray-500"
                    }
                  >
                    ✓ One number
                  </div>
                  <div
                    className={
                      passwordValidation.validation.checks.hasSpecial
                        ? "text-success-600"
                        : "text-gray-500"
                    }
                  >
                    ✓ One special character
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                  autoComplete="new-password"
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
            disabled={isLoading || !passwordValidation.validation.isValid}
          >
            Change Password
          </Button>
        </div>
      </form>
    </Form>
  );
}

