import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthMascot } from '../components/auth-mascot';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { VerificationModal } from '../components/verification-modal';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { useAuth, useSignUp } from '@clerk/expo';
import { useSSO } from '@clerk/expo/experimental';
import { usePostHog } from 'posthog-react-native';

function messageFor(error: unknown) {
  const failure = error as {
    message?: string;
    errors?: { longMessage?: string; message?: string }[];
  } | null;
  return failure?.errors?.[0]?.longMessage ?? failure?.errors?.[0]?.message ?? failure?.message ?? 'Something went wrong. Please try again.';
}

async function navigateHome({ decorateUrl }: { decorateUrl: (url: string) => string }) {
  const url = decorateUrl('/');
  if (Platform.OS === 'web' && url.startsWith('http') && typeof window !== 'undefined') {
    window.location.href = url;
    return;
  }
  router.replace(url as Href);
}

export default function SignUpScreen() {
  const auth = useAuth();
  const posthog = usePostHog();
  const insets = useSafeAreaInsets();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  useEffect(() => {
    if (auth.isLoaded && auth.isSignedIn) router.replace('/');
  }, [auth.isLoaded, auth.isSignedIn]);

  const handleSignUp = async () => {
    setErrorMessage(null);
    try {
      const { error } = await signUp.password({ emailAddress: email.trim(), password });
      if (error) {
        setErrorMessage(messageFor(error));
        return;
      }
      if (signUp.status === 'complete') {
        posthog.capture('sign_up_completed', { method: 'email_password' });
        await signUp.finalize({ navigate: navigateHome });
        return;
      }
      const verification = await signUp.verifications.sendEmailCode();
      if (verification.error) {
        setErrorMessage(messageFor(verification.error));
        return;
      }
      posthog.capture('sign_up_verification_requested');
      setIsVerificationVisible(true);
    } catch (error) {
      setErrorMessage(messageFor(error));
    }
  };

  const handleVerifyCode = async (code: string) => {
    setErrorMessage(null);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        setErrorMessage(messageFor(error));
        return;
      }
      if (signUp.status === 'complete') {
        posthog.capture('sign_up_completed', { method: 'email_password' });
        await signUp.finalize({ navigate: navigateHome });
      }
    } catch (error) {
      setErrorMessage(messageFor(error));
    }
  };

  const handleResendCode = async () => {
    setErrorMessage(null);
    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) setErrorMessage(messageFor(error));
    } catch (error) {
      setErrorMessage(messageFor(error));
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setErrorMessage(null);
    setIsSocialLoading(true);
    try {
      const { createdSessionId, signUp: socialSignUp } = await startSSOFlow({
        strategy: `oauth_${provider}`,
      });
      if (createdSessionId) {
        posthog.capture('social_sign_up_completed', { provider });
        router.replace('/');
      } else if (socialSignUp?.status === 'missing_requirements') {
        setErrorMessage('Your social account needs more information. Contact support or try email sign up.');
      }
    } catch (error) {
      setErrorMessage(messageFor(error));
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color={colors.neutral.textPrimary} />
            </Pressable>
          </View>

          {/* Heading */}
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Start your language journey today ✨</Text>
          </View>

          {/* Peeking Mascot with Sparkles */}
          <AuthMascot />

          {/* Email Input Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>

          {/* Password Input Card */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#475467"
                />
              </Pressable>
            </View>
          </View>

          {/* Main Action Button: Sign Up */}
          <Pressable
            onPress={() => void handleSignUp()}
            disabled={fetchStatus === 'fetching' || isSocialLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            <Text style={styles.primaryButtonText}>{fetchStatus === 'fetching' ? 'Please wait…' : 'Sign Up'}</Text>
          </Pressable>
          {errorMessage || errors.fields.emailAddress?.message || errors.fields.password?.message ? (
            <Text style={styles.errorText}>
              {errorMessage ?? errors.fields.emailAddress?.message ?? errors.fields.password?.message}
            </Text>
          ) : null}

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Auth Buttons */}
          <SocialAuthButtons onPressProvider={handleSocialAuth} />

          <View nativeID="clerk-captcha" />

          {/* Footer: Already have an account? Log in */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable
              onPress={() => router.push('/sign-in')}
              accessibilityRole="button"
              accessibilityLabel="Log in to existing account"
            >
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 6-Digit Verification Modal */}
      <VerificationModal
        visible={isVerificationVisible}
        email={email}
        onClose={() => setIsVerificationVisible(false)}
        onCodeComplete={handleVerifyCode}
        onResend={handleResendCode}
        isBusy={fetchStatus === 'fetching'}
        error={errorMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  header: {
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
    marginTop: 4,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 2,
  },
  textInput: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.neutral.textPrimary,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary.linguaDeepPurple,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.primary.linguaDeepPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 17,
    color: '#FFFFFF',
  },
  errorText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: '#D92D20',
    marginTop: 8,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    paddingHorizontal: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 8,
  },
  footerText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
  },
  footerLink: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    color: colors.primary.linguaDeepPurple,
  },
});
