/**
 * Notification Detail Redirect Page
 * Route: /notifications/[id]
 * Based on R11 rules
 * 
 * This is a virtual screen that:
 * 1. Auto-marks notification as read
 * 2. Redirects to document detail page
 * 
 * Access Rules:
 * - Member (Owner): Can access their own notifications
 * - FamilyAdmin: Can access all family notifications
 */

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";

// Lazy load notification detail redirect component for code splitting
const NotificationDetailRedirect = dynamic(
  () => import("@/modules/f005-notifications/components").then(
    (mod) => ({ default: mod.NotificationDetailRedirect })
  ),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-gray-500">Loading notification...</div>
    ),
  }
);

export default function NotificationDetailPage() {
  return (
    <RouteGuard
      requireAuth={true}
      roles={[UserRole.Member, UserRole.FamilyAdmin]}
    >
      <NotificationDetailRedirect />
    </RouteGuard>
  );
}

