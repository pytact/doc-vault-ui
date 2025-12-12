/**
 * Account Setup Form Component
 * SCR_ACCOUNT_SETUP - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useAccountSetupForm } from "@/hooks/useAccountSetupForm";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import type { AccountSetupFormSchema } from "@/hooks/useAccountSetupForm";
import type { PasswordRules } from "@/types/responses/common.responses";

interface AccountSetupFormProps {
  onSubmit: (data: AccountSetupFormSchema) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  passwordRules?: PasswordRules;
  email?: string;
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
}: AccountSetupFormProps) {
  const form = useAccountSetupForm({ passwordRules });
  const passwordValidation = usePasswordValidation({
    password: form.watch("password") || "",
    rules: passwordRules || {
      min_length: 12,
      uppercase: true,
      lowercase: true,
      number: true,
      special: true,
      disallow_last_5: false,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error" title="Setup Failed">
                {error}
              </Alert>
            )}

            <Input
              {...form.register("name")}
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              error={form.formState.errors.name?.message}
              disabled={isLoading}
              autoComplete="name"
            />

            <div>
              <Input
                {...form.register("password")}
                type="password"
                label="Password"
                placeholder="Create a strong password"
                error={form.formState.errors.password?.message}
                disabled={isLoading}
                autoComplete="new-password"
              />
              
              {/* Password validation feedback */}
              {form.watch("password") && (
                <div className="mt-2 space-y-1 text-sm">
                  <div className={passwordValidation.validation.checks.minLength ? "text-success-600" : "text-gray-500"}>
                    ✓ At least {passwordRules?.min_length || 12} characters
                  </div>
                  <div className={passwordValidation.validation.checks.hasUppercase ? "text-success-600" : "text-gray-500"}>
                    ✓ One uppercase letter
                  </div>
                  <div className={passwordValidation.validation.checks.hasLowercase ? "text-success-600" : "text-gray-500"}>
                    ✓ One lowercase letter
                  </div>
                  <div className={passwordValidation.validation.checks.hasNumber ? "text-success-600" : "text-gray-500"}>
                    ✓ One number
                  </div>
                  <div className={passwordValidation.validation.checks.hasSpecial ? "text-success-600" : "text-gray-500"}>
                    ✓ One special character
                  </div>
                </div>
              )}
            </div>

            <Input
              {...form.register("confirmPassword")}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              error={form.formState.errors.confirmPassword?.message}
              disabled={isLoading}
              autoComplete="new-password"
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
        </CardBody>
      </Card>
    </div>
  );
}

