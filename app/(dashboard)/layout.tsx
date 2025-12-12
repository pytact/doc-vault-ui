/**
 * Dashboard Layout
 * Layout for authenticated dashboard routes
 * Based on R11 rules
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/types/responses/auth.responses";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard roles={[UserRole.FamilyAdmin, UserRole.Member]}>
      <div className="min-h-screen bg-gray-50">
        {/* TODO: Add navigation sidebar/header here */}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </RouteGuard>
  );
}

