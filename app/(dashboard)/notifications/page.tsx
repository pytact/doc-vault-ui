/**
 * Notification List Page
 * Route: /notifications
 * Based on R11 rules
 * 
 * Access Rules:
 * - Member (Owner): Can view their own notifications
 * - FamilyAdmin: Can view all family notifications
 * - Notifications are auto-generated, so no create/edit functionality
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { NotificationCenterContainer } from "@/modules/f005-notifications/containers/NotificationCenterContainer";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

export default function NotificationListPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <NotificationCenterContainer />
    </RouteGuard>
  );
}

