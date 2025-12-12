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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <UserIcon />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
          <p className="mt-2 text-sm text-gray-600">
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

          <CardFooter className="px-8 pb-8 pt-0 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500 w-full">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
      </Card>
      </div>
    </div>
  );
});

