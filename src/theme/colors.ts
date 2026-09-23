/**
 * Lingua Design System - Color Tokens
 * Derived from the official design system specification.
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    linguaPurple: '#6C4EF5',
    linguaDeepPurple: '#5B3BF6',
    linguaBlue: '#4D8BFF',
    linguaGreen: '#21C16B',
  },

  // Semantic Feedback & Status Colors
  semantic: {
    success: '#21C16B',
    warning: '#FFC800',
    streak: '#FF8A00',
    error: '#FF4D4F',
    info: '#4D8BFF',
  },

  // Neutral UI Colors
  neutral: {
    textPrimary: '#0D132B',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    surface: '#F6F7FB',
    background: '#FFFFFF',
  },
} as const;

/**
 * Direct shorthand access to common theme colors
 */
export const palette = {
  // Brand
  linguaPurple: colors.primary.linguaPurple,
  linguaDeepPurple: colors.primary.linguaDeepPurple,
  linguaBlue: colors.primary.linguaBlue,
  linguaGreen: colors.primary.linguaGreen,

  // Semantic
  success: colors.semantic.success,
  warning: colors.semantic.warning,
  streak: colors.semantic.streak,
  error: colors.semantic.error,
  info: colors.semantic.info,

  // Neutrals
  textPrimary: colors.neutral.textPrimary,
  textSecondary: colors.neutral.textSecondary,
  border: colors.neutral.border,
  surface: colors.neutral.surface,
  background: colors.neutral.background,
} as const;

export type ThemeColors = typeof colors;
export type PaletteColor = keyof typeof palette;
