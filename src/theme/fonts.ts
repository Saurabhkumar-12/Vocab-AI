import { useFonts } from 'expo-font';

/**
 * lingua Design System - Font Configuration & Assets
 * Primary Typeface: Poppins (Regular, Medium, SemiBold, Bold)
 */

export const fontAssets = {
  'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
};

export const fontNames = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
} as const;

export type FontName = keyof typeof fontNames;

/**
 * Hook to load all lingua Poppins fonts
 */
export function useAppFonts() {
  return useFonts(fontAssets);
}
