/**
 * SuperAdmin Layout
 * Layout for SuperAdmin-only routes
 * Blue + White Theme
 */

"use client";

import { RouteGuard } from "@/core/guards/route-guard";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { Header } from "@/components/layout/Header";
import { useAuthContext } from "@/contexts/auth.context";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();

  return (
    <RouteGuard roles={[UserRole.SuperAdmin]}>
      <div className="min-h-screen bg-background-secondary">
        <Header role={user?.role} />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </RouteGuard>
  );
}

