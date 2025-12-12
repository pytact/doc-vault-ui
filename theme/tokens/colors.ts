/**
 * Color Design Tokens
 * Based on R12 - Figma Design Integration
 * All colors must match Figma design system
 */

export const colors = {
  // Primary colors
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Main primary
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },
  // Secondary colors
  secondary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B", // Main secondary
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  // Success colors
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A", // Main success
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  },
  // Danger/Error colors
  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626", // Main danger
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  },
  // Warning colors
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706", // Main warning
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
    950: "#451A03",
  },
  // Info colors
  info: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7", // Main info
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
    950: "#082F49",
  },
  // Neutral/Gray colors
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },
  // Semantic colors
  background: {
    default: "#FFFFFF",
    secondary: "#F8FAFC",
    tertiary: "#F1F5F9",
  },
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    tertiary: "#64748B",
    disabled: "#94A3B8",
    inverse: "#FFFFFF",
  },
  border: {
    default: "#E2E8F0",
    hover: "#CBD5E1",
    focus: "#3B82F6",
    error: "#DC2626",
  },
} as const;

