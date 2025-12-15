/**
 * Profile Display Component
 * Shows profile information with Edit and Change Password buttons
 * Based on R7, R12, R16 rules
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";

interface ProfileDisplayProps {
  name: string;
  email: string;
  onEdit: () => void;
  onChangePassword: () => void;
}

/**
 * Profile display UI component
 * Pure presentation - no business logic
 */
export const ProfileDisplay = React.memo(function ProfileDisplay({
  name,
  email,
  onEdit,
  onChangePassword,
}: ProfileDisplayProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage your profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-base text-gray-900">{name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-base text-gray-900">{email}</p>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onChangePassword} variant="outline" fullWidth>
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

