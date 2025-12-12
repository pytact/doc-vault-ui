/**
 * Profile Settings Page
 * Route: /profile/settings
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { ProfileSettingsContainer } from "@/modules/f001-identity/containers/ProfileSettingsContainer";

export default function ProfileSettingsPage() {
  return (
    <RouteGuard requireAuth={true}>
      <div className="container mx-auto py-8">
        <ProfileSettingsContainer />
      </div>
    </RouteGuard>
  );
}

