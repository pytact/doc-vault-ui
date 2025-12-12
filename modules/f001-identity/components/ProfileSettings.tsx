/**
 * Profile Settings Component
 * SCR_PROFILE_SETTINGS - Pure UI component
 * Based on R7, R12, R16, R14 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { useProfileForm } from "@/hooks/useProfileForm";
import type { ProfileFormSchema } from "@/hooks/useProfileForm";

interface ProfileSettingsProps {
  initialName: string;
  email: string;
  onSubmit: (data: ProfileFormSchema) => Promise<void>;
  onChangePassword: () => void;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
}

/**
 * Profile settings UI component
 * Pure presentation - no business logic
 */
export const ProfileSettings = React.memo(function ProfileSettings({
  initialName,
  email,
  onSubmit,
  onChangePassword,
  isLoading = false,
  error,
  success,
}: ProfileSettingsProps) {
  const form = useProfileForm({ defaultValues: { name: initialName } });

  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data);
    }),
    [form, onSubmit]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your profile information and security settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error" title="Update Failed">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" title="Success">
                {success}
              </Alert>
            )}

            <Input
              type="email"
              label="Email"
              value={email}
              disabled
              helperText="Email cannot be changed"
            />

            <Input
              {...form.register("name")}
              type="text"
              label="Name"
              placeholder="Enter your name"
              error={form.formState.errors.name?.message}
              disabled={isLoading}
              autoComplete="name"
            />

            <CardFooter className="px-0 pb-0">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        </CardHeader>

        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Password</h3>
              <p className="text-sm text-gray-600">
                Change your password to keep your account secure
              </p>
            </div>
            <Button onClick={onChangePassword} variant="outline">
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});
