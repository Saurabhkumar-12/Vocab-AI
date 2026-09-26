import { useAuth, useClerk, useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export default function HomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/onboarding');
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary.linguaDeepPurple} />
      </View>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const name = user?.firstName ?? 'there';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.brand}>LYRA</Text>
        <Pressable
          onPress={async () => {
            await signOut();
            router.replace('/onboarding');
          }}
          style={styles.accountButton}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.primary.linguaDeepPurple} />
          <Text style={styles.accountButtonText}>Sign out</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color={colors.primary.linguaDeepPurple} />
        </View>
        <Text style={styles.title}>Welcome, {name}!</Text>
        <Text style={styles.subtitle}>You’re signed in and ready to continue your language journey.</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}

        <Pressable
          onPress={() => router.push('/language-picker')}
          style={({ pressed }) => [
            styles.languageButton,
            pressed && styles.languageButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Choose language"
        >
          <Ionicons name="globe-outline" size={20} color={colors.primary.linguaDeepPurple} />
          <Text style={styles.languageButtonText}>Choose language</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  header: { minHeight: 64, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontFamily: fontFamilies.bold, fontSize: 22, color: colors.neutral.textPrimary, letterSpacing: 1 },
  accountButton: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#F1EFFF' },
  accountButtonText: { fontFamily: fontFamilies.semiBold, fontSize: 14, color: colors.primary.linguaDeepPurple },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 64 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#F1EFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontFamily: fontFamilies.bold, fontSize: 28, color: colors.neutral.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: fontFamilies.regular, fontSize: 16, lineHeight: 24, color: colors.neutral.textSecondary, textAlign: 'center', marginTop: 10 },
  email: { fontFamily: fontFamilies.medium, fontSize: 14, color: colors.primary.linguaDeepPurple, marginTop: 18 },
  languageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 22, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 18, backgroundColor: '#F1EFFF' },
  languageButtonPressed: { opacity: 0.9 },
  languageButtonText: { fontFamily: fontFamilies.semiBold, fontSize: 15, color: colors.primary.linguaDeepPurple },
});
