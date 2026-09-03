const lightColors = {
  // Base colors
  surface: '#fbf8fb',
  surfaceDim: '#dcd9db',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f5',
  surfaceContainer: '#f0edef',
  surfaceContainerHigh: '#eae7e9',
  surfaceContainerHighest: '#e4e2e4',
  onSurface: '#1b1b1d',
  onSurfaceVariant: '#45474d',
  outline: '#75777d',
  outlineVariant: '#c5c6cd',
  background: '#FFFFFF',
  foreground: '#000000',

  // Card colors
  card: '#F2F2F7',
  cardForeground: '#000000',

  // Popover colors
  popover: '#F2F2F7',
  popoverForeground: '#000000',

  // Primary colors
  primary: '#0a2505',
  onPrimary: '#ffffff',
  primaryContainer: '#1b263b',
  onPrimaryContainer: '#828da7',
  primaryFixedDim: '#bbc6e2',
  primaryForeground: '#FFFFFF',

  // Secondary colors
  secondary: '#4c7e47',
  onSecondary: '#ffffff',
  secondaryContainer: '#c2dcff',
  onSecondaryContainer: '#48617e',
  secondaryForeground: '#18181b',

  // Muted colors
  muted: '#78788033',
  mutedForeground: '#71717a',

  // Accent colors
  accent: '#F2F2F7',
  accentForeground: '#18181b',

  // Tertiary
  tertiaryFixed: '#fcdeb3',
  tertiaryFixedDim: '#dfc299',
  onTertiaryContainer: '#a28963',

  // Destructive colors
  destructive: '#ef4444',
  destructiveForeground: '#FFFFFF',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  successGreen: '#10b981',
  platinumMist: '#e0e1dd',
  white: '#ffffff',

  // Border and input
  border: '#C6C6C8',
  input: '#e4e4e7',
  ring: '#a1a1aa',

  // Text colors
  text: '#000000',
  textMuted: '#71717a',

  // Legacy support for existing components
  tint: '#18181b',
  icon: '#71717a',
  tabIconDefault: '#71717a',
  tabIconSelected: '#18181b',

  // Default buttons, links, Send button, selected tabs
  blue: '#007AFF',

  // Success states, FaceTime buttons, completed tasks
  green: '#34C759',

  // Delete buttons, error states, critical alerts
  red: '#FF3B30',

  // VoiceOver highlights, warning states
  orange: '#FF9500',

  // Notes app accent, Reminders highlights
  yellow: '#FFCC00',

  // Pink accent color for various UI elements
  pink: '#FF2D92',

  // Purple accent for creative apps and features
  purple: '#AF52DE',

  // Teal accent for communication features
  teal: '#5AC8FA',

  // Indigo accent for system features
  indigo: '#5856D6',

  // Semantic states
  success: '#22c55e',
  successForeground: '#ffffff',
  warning: '#f59e0b',
  warningForeground: '#ffffff',
  info: '#3b82f6',
  infoForeground: '#ffffff',
  // error: '#ef4444',
  errorForeground: '#ffffff',
};

const darkColors = {
  // Base colors
  surface: "#101013",
  surfaceDim: "#0a0a0c",
  surfaceContainerLowest: "#000000",
  surfaceContainerLow: "#0f0f12",
  surfaceContainer: "#161619",
  surfaceContainerHigh: "#1d1d21",
  surfaceContainerHighest: "#26262b",
  onSurface: "#e6e6ea",
  onSurfaceVariant: "#b8b9c1",
  outline: "#7a7c84",
  outlineVariant: "#3a3b41",
  background: "#000000",
  foreground: "#FFFFFF",

  // Card colors
  card: "#1C1C1E",
  cardForeground: "#FFFFFF",

  // Popover colors
  popover: "#18181b",
  popoverForeground: "#FFFFFF",

  // Primary colors
  primary: "#557a55",
  onPrimary: "#0a2505",
  primaryContainer: "#1b263b",
  onPrimaryContainer: "#c2dcff",
  primaryFixedDim: "#0a2505",
  primaryForeground: "#18181b",

  // Secondary colors
  secondary: "#a8dea9",
  onSecondary: "#0a1f33",
  secondaryContainer: "#2a3d54",
  onSecondaryContainer: "#c2dcff",
  secondaryForeground: "#FFFFFF",

  // Muted colors
  muted: "#78788033",
  mutedForeground: "#a1a1aa",

  // Accent colors
  accent: "#1C1C1E",
  accentForeground: "#FFFFFF",

  // Tertiary
  tertiaryFixed: "#d2ac76",
  tertiaryFixedDim: "#5a4a26",
  onTertiaryContainer: "#fcdeb3",

  // Destructive colors
  destructive: "#dc2626",
  destructiveForeground: "#FFFFFF",
  // error: '#ffb4ab',
  errorContainer: "#93000a",
  successGreen: "#34d399",
  platinumMist: "#2a2a2e",
  white: "#ffffff",

  // Border and input - using alpha values for better blending
  border: "#38383A",
  input: "rgba(255, 255, 255, 0.15)",
  ring: "#71717a",

  // Text colors
  text: "#FFFFFF",
  textMuted: "#a1a1aa",

  // Legacy support for existing components
  tint: "#FFFFFF",
  icon: "#a1a1aa",
  tabIconDefault: "#a1a1aa",
  tabIconSelected: "#FFFFFF",

  // Default buttons, links, Send button, selected tabs
  blue: "#0A84FF",

  // Success states, FaceTime buttons, completed tasks
  green: "#30D158",

  // Delete buttons, error states, critical alerts
  red: "#FF453A",

  // VoiceOver highlights, warning states
  orange: "#FF9F0A",

  // Notes app accent, Reminders highlights
  yellow: "#FFD60A",

  // Pink accent color for various UI elements
  pink: "#FF375F",

  // Purple accent for creative apps and features
  purple: "#BF5AF2",

  // Teal accent for communication features
  teal: "#64D2FF",

  // Indigo accent for system features
  indigo: "#5E5CE6",

  // Semantic states
  success: "#16a34a",
  successForeground: "#ffffff",
  warning: "#d97706",
  warningForeground: "#ffffff",
  info: "#2563eb",
  infoForeground: "#ffffff",
  error: "#dc2626",
  errorForeground: "#ffffff",
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Export individual color schemes for easier access
export { darkColors, lightColors };

// Utility type for color keys
export type ColorKeys = keyof typeof lightColors;

// Helper function to get color with opacity (useful for React Native)
export const withOpacity = (color: string, opacity: number) => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color;
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
};
