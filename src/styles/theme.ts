// Nihongo Sekai Theme Configuration
export const theme = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444", // Main primary
      600: "#dc2626", // Main crimson
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },

    // Secondary Brand Colors
    secondary: {
      50: "#fdf4f7",
      100: "#fce7ee",
      200: "#fbcfe0",
      300: "#f9a8c4",
      400: "#f472a6",
      500: "#ec4899", // Main sakura
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#500724",
    },

    // Neutral Colors (Ink)
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a", // Main ink
      950: "#020617",
    },

    // Accent Colors
    accent: {
      gold: {
        50: "#fffdf7",
        100: "#fffaeb",
        200: "#fef3c7",
        300: "#fde68a",
        400: "#fcd34d",
        500: "#fbbf24",
        600: "#f59e0b", // Main gold
        700: "#d97706",
        800: "#b45309",
        900: "#92400e",
      },

      success: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e", // Main success
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },

      warning: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b", // Main warning
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
      },

      error: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444", // Main error
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
      },
    },

    // Semantic Colors
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },

  // Typography
  typography: {
    fontFamily: {
      primary: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
      ],
      heading: [
        "Poppins",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "sans-serif",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },

    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
      "4xl": ["36px", { lineHeight: "40px" }],
      "5xl": ["48px", { lineHeight: "52px" }],
      "6xl": ["60px", { lineHeight: "64px" }],
      "7xl": ["72px", { lineHeight: "76px" }],
      "8xl": ["96px", { lineHeight: "100px" }],
      "9xl": ["128px", { lineHeight: "132px" }],
    },

    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: "0px", // < 768px
    tablet: "768px", // >= 768px
    desktop: "1200px", // >= 1200px
    wide: "1400px", // >= 1400px
  },

  // Spacing Scale
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px", // Base unit
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
    40: "160px",
    48: "192px",
    56: "224px",
    64: "256px",
  },

  // Border Radius
  borderRadius: {
    none: "0px",
    sm: "4px",
    base: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px",
  },

  // Box Shadows
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    none: "none",
  },

  // Z-Index Scale
  zIndex: {
    hide: "-1",
    auto: "auto",
    base: "0",
    docked: "10",
    dropdown: "1000",
    sticky: "1100",
    banner: "1200",
    overlay: "1300",
    modal: "1400",
    popover: "1500",
    skipLink: "1600",
    toast: "1700",
    tooltip: "1800",
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeBreakpoints = typeof theme.breakpoints;
