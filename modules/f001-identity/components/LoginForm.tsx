/**
 * Login Form Component
 * SCR_LOGIN - Pure UI component
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { useLoginForm } from "@/hooks/useLoginForm";
import type { LoginFormSchema } from "@/hooks/useLoginForm";

interface LoginFormProps {
  onSubmit: (data: LoginFormSchema) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Login form UI component
 * Pure presentation - no business logic
 */
export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const form = useLoginForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error" title="Login Failed">
                {error}
              </Alert>
            )}

            <Input
              {...form.register("email")}
              type="email"
              label="Email"
              placeholder="Enter your email"
              error={form.formState.errors.email?.message}
              disabled={isLoading}
              autoComplete="email"
            />

            <Input
              {...form.register("password")}
              type="password"
              label="Password"
              placeholder="Enter your password"
              error={form.formState.errors.password?.message}
              disabled={isLoading}
              autoComplete="current-password"
            />

            <CardFooter className="px-0 pb-0">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
});

