/**
 * Logout Page
 * Route: /auth/logout
 * Based on R11 rules
 */

"use client";

import { LogoutRedirect } from "@/modules/f001-identity/components/LogoutRedirect";

export default function LogoutPage() {
  return <LogoutRedirect />;
}

