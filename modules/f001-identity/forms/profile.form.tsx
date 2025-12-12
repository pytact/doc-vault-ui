/**
 * Profile Form Component
 * Pure UI form component for profile update
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
import { ProfileSchema, getProfileDefaultValues, type ProfileFormSchema } from "./profile.schema";

interface ProfileFormProps {
  initialName: string;
  email: string;
  onSubmit: (values: ProfileFormSchema) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
}

/**
 * Profile form UI component
 * Pure presentation - no business logic
 */
export const ProfileForm = React.memo(function ProfileForm({
  initialName,
  email,
  onSubmit,
  isLoading = false,
  error,
  success,
}: ProfileFormProps) {
  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: React.useMemo(
      () => getProfileDefaultValues(initialName),
      [initialName]
    ),
    mode: "onChange",
  });

  const handleSubmit = React.useCallback(
    form.handleSubmit(async (data) => {
      await onSubmit(data);
    }),
    [form, onSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
      </CardHeader>

      <CardBody>
        <Form form={form}>
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

            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                      disabled={isLoading}
                      autoComplete="name"
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                disabled
                helperText="Email cannot be changed"
              />
            </div>

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
        </Form>
      </CardBody>
    </Card>
  );
}

