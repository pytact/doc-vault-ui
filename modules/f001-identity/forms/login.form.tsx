/**
 * Login Form Component
 * Pure UI form component for login
 * Based on R10 rules
 */

"use client";

import React, { useMemo } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { LoginSchema, loginDefaultValues, type LoginFormSchema } from "./login.schema";

interface LoginFormProps {
  onSubmit: (values: LoginFormSchema) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * User icon SVG component
 * Extracted to prevent re-creation on each render
 */
const UserIcon = React.memo(() => (
  <svg
    className="h-6 w-6 text-primary-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
));
UserIcon.displayName = "UserIcon";

/**
 * Login form UI component
 * Pure presentation - no business logic
 */
export const LoginForm = React.memo(function LoginForm({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps) {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: loginDefaultValues,
    mode: "onChange",
  });

  // Memoize onSubmit to prevent unnecessary re-renders
  const memoizedOnSubmit = React.useCallback(
    async (data: LoginFormSchema) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  // Use form.handleSubmit directly - it's stable and doesn't need to be in dependencies
  const handleSubmit = form.handleSubmit(memoizedOnSubmit);

  // Extract button text to prevent inline logic in JSX
  const buttonText = useMemo(
    () => (isLoading ? "Signing in..." : "Sign In"),
    [isLoading]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6 pt-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-primary-100">
              Sign in to your account to continue
          </p>
        </CardHeader>

          <CardBody className="px-8 pb-6">
          <Form form={form}>
              <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                  <div className="mb-4">
                <Alert variant="error" title="Login Failed">
                  {error}
                </Alert>
                  </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        autoComplete="email"
                        error={fieldState.error?.message}
                        className="h-11 transition-all duration-200"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        error={fieldState.error?.message}
                        className="h-11 transition-all duration-200"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

                <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                    className="h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                    {buttonText}
                </Button>
                </div>
            </form>
          </Form>
        </CardBody>

          <CardFooter className="px-8 pb-8 pt-0 border-t border-border bg-background-secondary">
            <p className="text-center text-xs text-text-secondary w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
      </Card>
      </div>
    </div>
  );
});

