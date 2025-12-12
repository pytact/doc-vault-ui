/**
 * Typography Design Tokens
 * Based on R12 - Figma Design Integration
 * All typography must match Figma design system
 */

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  // Font sizes (following 4px grid)
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
  },
  // Font weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  // Line heights
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  // Text styles (semantic)
  textStyles: {
    h1: {
      fontSize: "2.25rem", // 36px
      fontWeight: "700",
      lineHeight: "1.2",
    },
    h2: {
      fontSize: "1.875rem", // 30px
      fontWeight: "600",
      lineHeight: "1.3",
    },
    h3: {
      fontSize: "1.5rem", // 24px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    h4: {
      fontSize: "1.25rem", // 20px
      fontWeight: "600",
      lineHeight: "1.4",
    },
    h5: {
      fontSize: "1.125rem", // 18px
      fontWeight: "600",
      lineHeight: "1.5",
    },
    h6: {
      fontSize: "1rem", // 16px
      fontWeight: "600",
      lineHeight: "1.5",
    },
    body: {
      fontSize: "1rem", // 16px
      fontWeight: "400",
      lineHeight: "1.5",
    },
    bodySmall: {
      fontSize: "0.875rem", // 14px
      fontWeight: "400",
      lineHeight: "1.5",
    },
    caption: {
      fontSize: "0.75rem", // 12px
      fontWeight: "400",
      lineHeight: "1.4",
    },
    label: {
      fontSize: "0.875rem", // 14px
      fontWeight: "500",
      lineHeight: "1.4",
    },
  },
} as const;

