import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

interface SocialAuthButtonsProps {
  onPressProvider?: (provider: 'google' | 'facebook' | 'apple') => void;
}

function GoogleIcon() {
  return (
    <View style={styles.googleIconContainer}>
      <Ionicons name="logo-google" size={18} color="#EA4335" />
    </View>
  );
}

function FacebookIcon() {
  return (
    <View style={styles.facebookIconContainer}>
      <Ionicons name="logo-facebook" size={16} color="#FFFFFF" />
    </View>
  );
}

function AppleIcon() {
  return (
    <View style={styles.appleIconContainer}>
      <Ionicons name="logo-apple" size={20} color="#000000" />
    </View>
  );
}

export function SocialAuthButtons({ onPressProvider }: SocialAuthButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Continue with Google */}
      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
        ]}
        onPress={() => onPressProvider?.('google')}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google"
      >
        <GoogleIcon />
        <Text style={styles.socialText}>Continue with Google</Text>
      </Pressable>

      {/* Continue with Facebook */}
      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
        ]}
        onPress={() => onPressProvider?.('facebook')}
        accessibilityRole="button"
        accessibilityLabel="Continue with Facebook"
      >
        <FacebookIcon />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </Pressable>

      {/* Continue with Apple */}
      <Pressable
        style={({ pressed }) => [
          styles.socialButton,
          pressed && styles.socialButtonPressed,
        ]}
        onPress={() => onPressProvider?.('apple')}
        accessibilityRole="button"
        accessibilityLabel="Continue with Apple"
      >
        <AppleIcon />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F3F7',
    paddingHorizontal: 16,
    position: 'relative',
    shadowColor: '#0D132B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  socialButtonPressed: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    transform: [{ scale: 0.99 }],
  },
  socialText: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    color: colors.neutral.textPrimary,
    marginLeft: 12,
  },
  googleIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
