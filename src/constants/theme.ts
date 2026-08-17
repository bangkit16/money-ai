// WealthFlow design tokens — turunan dari DESIGN.md

export const colors = {
  surface: "#fbf8fb",
  surfaceDim: "#dcd9db",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f5",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e4",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474d",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  background: "#fbf8fb",

  primary: "#0a2505",
  onPrimary: "#ffffff",
  primaryContainer: "#1b263b",
  onPrimaryContainer: "#828da7",
  primaryFixedDim: "#bbc6e2",

  secondary: "#47607e",
  onSecondary: "#ffffff",
  secondaryContainer: "#c2dcff",
  onSecondaryContainer: "#48617e",

  tertiaryFixed: "#fcdeb3",
  tertiaryFixedDim: "#dfc299",
  onTertiaryContainer: "#a28963",

  error: "#ba1a1a",
  errorContainer: "#ffdad6",

  successGreen: "#10b981",
  platinumMist: "#e0e1dd",

  white: "#ffffff",
};

export const typography = {
  displayLg: {
    fontSize: 35,
    fontWeight: "700" as const,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 32,
    fontWeight: "600" as const,
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  headlineLgMobile: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  titleMd: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  bodyLg: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  bodySm: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  labelCaps: {
    fontSize: 12,
    fontWeight: "700" as const,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
  },
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const spacing = {
  unit: 8,
  gutter: 24,
  marginMobile: 20,
};

export const shadow = {
  card: {
    shadowColor: "#051125",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroCard: {
    shadowColor: "#051125",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
};
