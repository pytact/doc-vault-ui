/**
 * Header Component
 * Navigation header for authenticated pages
 * Blue + White Theme
 */

"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/modules/f001-identity/types/responses/auth";
import { getRoleBasedDashboardRoute } from "@/utils/routing";
import { authRoutes, profileRoutes, userRoutes, familyRoutes, documentRoutes } from "@/utils/routing";

interface HeaderProps {
  role?: UserRole;
}

export function Header({ role }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Use window.location.href for hard redirect to avoid redirect query parameters
      if (typeof window !== "undefined") {
        window.location.href = authRoutes.login;
      } else {
        router.replace(authRoutes.login);
      }
    } catch (error) {
      // Even if logout fails, redirect to login without redirect parameter
      if (typeof window !== "undefined") {
        window.location.href = authRoutes.login;
      } else {
        router.replace(authRoutes.login);
      }
    }
  };

  const isActive = (path: string) => pathname === path;

  const getNavigationLinks = () => {
    if (!role) return [];

    switch (role) {
      case "superadmin":
        return [
          { href: "/superadmin/dashboard", label: "Dashboard" },
          { href: familyRoutes.list, label: "Families" },
          { href: userRoutes.listAll, label: "All Users" },
          { href: profileRoutes.settings, label: "Profile" },
        ];
      case "familyadmin":
        return [
          { href: "/dashboard", label: "Dashboard" },
          { href: userRoutes.list, label: "Users" },
          { href: documentRoutes.list, label: "Documents" },
          { href: profileRoutes.settings, label: "Profile" },
        ];
      case "member":
        return [
          { href: "/dashboard", label: "Dashboard" },
          { href: documentRoutes.list, label: "Documents" },
          { href: profileRoutes.settings, label: "Profile" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavigationLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link
              href={user ? getRoleBasedDashboardRoute(user.role) : "/"}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-600">DocVault</span>
            </Link>

            {/* Navigation Links */}
            {navLinks.length > 0 && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary-100 text-primary-700"
                        : "text-slate-600 hover:bg-primary-50 hover:text-primary-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

              {/* User Menu */}
              {user && (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600 capitalize">{user.role}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </div>
                  <Link
                    href={profileRoutes.settings}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-primary-200 text-primary-700 hover:bg-primary-50"
                  >
                    Logout
                  </Button>
                </div>
              )}
        </div>
      </div>
    </header>
  );
}

