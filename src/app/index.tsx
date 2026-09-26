import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLanguageStore } from '../store/language-store';
import { colors } from '../theme/colors';

export default function RootHomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const isHydrated = useLanguageStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/onboarding');
      return;
    }

    if (!isHydrated) return;

    if (!selectedLanguage) {
      router.replace('/language-picker');
      return;
    }

    router.replace('/(tabs)/home');
  }, [isHydrated, isLoaded, isSignedIn, selectedLanguage]);

  if (!isLoaded || !isHydrated || !isSignedIn || !selectedLanguage) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator color={colors.primary.linguaDeepPurple} />
      </View>
    );
  }

  return null;
}
