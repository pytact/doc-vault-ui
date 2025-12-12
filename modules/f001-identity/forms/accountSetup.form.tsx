/**
 * Account Setup Form Component
 * Pure UI form component for account activation
 * Based on R10 rules
 */

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
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
  createAccountSetupSchema,
  accountSetupDefaultValues,
  type AccountSetupFormSchema,
} from "./accountSetup.schema";
import type { PasswordRules } from "@/types/responses/common.responses";

interface AccountSetupFormProps {
  onSubmit: (values: AccountSetupFormSchema) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  passwordRules?: PasswordRules;
  email?: string;
  inviteToken: string;
}

/**
 * Account setup form UI component
 * Pure presentation - no business logic
 */
export const AccountSetupForm = React.memo(function AccountSetupForm({
  onSubmit,
  isLoading = false,
  error,
  passwordRules,
  email,
  inviteToken,
}: AccountSetupFormProps) {
  const schema = React.useMemo(
    () => createAccountSetupSchema(passwordRules),
    [passwordRules]
  );
  const form = useForm<AccountSetupFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: React.useMemo(
      () => ({
        ...accountSetupDefaultValues,
        invite_token: inviteToken,
      }),
      [inviteToken]
    ),
    mode: "onChange",
  });

  const passwordValue = form.watch("password");
  const passwordValidation = usePasswordValidation({
    password: passwordValue || "",
    rules: passwordRules || {
      min_length: 12,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
      disallow_last_5: false,
    },
  });

  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data);
    }),
    [form, onSubmit]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            {email && `Setting up account for ${email}`}
          </p>
        </CardHeader>

        <CardBody>
          <Form form={form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="error" title="Setup Failed">
                  {error}
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        autoComplete="name"
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
                    {passwordValue && (
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
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        disabled={isLoading}
                        autoComplete="new-password"
                        error={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 pb-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading || !passwordValidation.validation.isValid}
                >
                  Activate Account
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

