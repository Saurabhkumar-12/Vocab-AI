import { TextStyle } from 'react-native';

/**
 * lingua Design System - Typography Tokens
 * Typeface: Poppins (Geometric sans-serif)
 * Derived from the official design system specification (01-design-system.png).
 */

export const fontFamilies = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export const fontSizes = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 13,
  caption: 11,
} as const;

export const lineHeightRatios = {
  h1: 1.2,
  h2: 1.3,
  h3: 1.3,
  h4: 1.4,
  bodyLarge: 1.6,
  bodyMedium: 1.6,
  bodySmall: 1.6,
  caption: 1.4,
} as const;

export const lineHeights = {
  h1: 38.4,        // 32 * 1.2
  h2: 31.2,        // 24 * 1.3
  h3: 26.0,        // 20 * 1.3
  h4: 22.4,        // 16 * 1.4
  bodyLarge: 25.6,  // 16 * 1.6
  bodyMedium: 22.4, // 14 * 1.6
  bodySmall: 20.8,  // 13 * 1.6
  caption: 15.4,    // 11 * 1.4
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

/**
 * Typography metadata matching the design specification table
 */
export const typographySpec = [
  {
    tag: 'H1',
    role: 'Page / Screen Title',
    size: 32,
    weight: 'Bold',
    ratio: 1.2,
    lineHeight: 38.4,
    fontFamily: fontFamilies.bold,
  },
  {
    tag: 'H2',
    role: 'Section Title',
    size: 24,
    weight: 'SemiBold',
    ratio: 1.3,
    lineHeight: 31.2,
    fontFamily: fontFamilies.semiBold,
  },
  {
    tag: 'H3',
    role: 'Card / Module Title',
    size: 20,
    weight: 'SemiBold',
    ratio: 1.3,
    lineHeight: 26.0,
    fontFamily: fontFamilies.semiBold,
  },
  {
    tag: 'H4',
    role: 'Subheading',
    size: 16,
    weight: 'Medium',
    ratio: 1.4,
    lineHeight: 22.4,
    fontFamily: fontFamilies.medium,
  },
  {
    tag: 'Body Large',
    role: 'Important content',
    size: 16,
    weight: 'Regular',
    ratio: 1.6,
    lineHeight: 25.6,
    fontFamily: fontFamilies.regular,
  },
  {
    tag: 'Body Medium',
    role: 'Body text',
    size: 14,
    weight: 'Regular',
    ratio: 1.6,
    lineHeight: 22.4,
    fontFamily: fontFamilies.regular,
  },
  {
    tag: 'Body Small',
    role: 'Supporting text',
    size: 13,
    weight: 'Regular',
    ratio: 1.6,
    lineHeight: 20.8,
    fontFamily: fontFamilies.regular,
  },
  {
    tag: 'Caption',
    role: 'Labels, meta text',
    size: 11,
    weight: 'Regular',
    ratio: 1.4,
    lineHeight: 15.4,
    fontFamily: fontFamilies.regular,
  },
] as const;

/**
 * Pre-composed React Native typography style objects
 */
export const typographyStyles = {
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.h2,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.semiBold,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.h3,
  } as TextStyle,

  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.h4,
    lineHeight: lineHeights.h4,
  } as TextStyle,

  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
  } as TextStyle,

  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyMedium,
    lineHeight: lineHeights.bodyMedium,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  } as TextStyle,
} as const;

export const typography = {
  families: fontFamilies,
  sizes: fontSizes,
  lineHeightRatios,
  lineHeights,
  weights: fontWeights,
  spec: typographySpec,
  styles: typographyStyles,
} as const;

export type TypographyStyle = keyof typeof typographyStyles;
