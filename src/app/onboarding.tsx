import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpeechBubble } from '../components/speech-bubble';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive sizing for mascot container
  const mascotSize = Math.min(Math.max(width * 0.72, 260), 320);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top Header with Fox Logo and Brand Name */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/moscot-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>lingua</Text>
        </View>

        {/* Headline & Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Your AI language{'\n'}
            <Text style={styles.titleHighlight}>teacher</Text>
            <Text style={styles.titleDot}>.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Real conversations, personalized{'\n'}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* Hero Illustration with Rotated Speech Bubbles */}
        <View style={styles.illustrationWrapper}>
          <View style={[styles.heroContainer, { width: width - 40, height: mascotSize + 56 }]}>
            {/* Top-Right Bubble: "¡Hola!" */}
            <SpeechBubble
              text="¡Hola!"
              backgroundColor="#F1EFFF"
              textColor={colors.primary.linguaDeepPurple}
              rotation="-4deg"
              tailPosition="bottom-left"
              style={{
                top: 4,
                right: '16%',
              }}
              textStyle={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
              }}
            />

            {/* Left Bubble: "Hello!" */}
            <SpeechBubble
              text="Hello!"
              backgroundColor="#EBF3FE"
              textColor={colors.neutral.textPrimary}
              rotation="-7deg"
              tailPosition="bottom-right"
              style={{
                top: '16%',
                left: '2%',
              }}
              textStyle={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 16,
              }}
            />

            {/* Right Bubble: "你好!" */}
            <SpeechBubble
              text="你好!"
              backgroundColor="#FFF0EB"
              textColor="#FF4D4F"
              rotation="-5deg"
              tailPosition="bottom-left"
              style={{
                top: '32%',
                right: '2%',
              }}
              textStyle={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
              }}
            />

            {/* Fox Mascot */}
            <View style={styles.mascotContainer}>
              <Image
                source={require('../../assets/images/mascot-welcome.png')}
                style={{
                  width: mascotSize,
                  height: mascotSize,
                }}
                resizeMode="contain"
              />

              {/* Ground Shadow */}
              <View
                style={[
                  styles.groundShadow,
                  { width: mascotSize * 0.58 },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Pagination Dots (matching design) */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Bottom CTA Button */}
        <View
          style={[
            styles.bottomContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.ctaText}>Get Started</Text>
            <View style={styles.ctaIconContainer}>
              <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  logoImage: {
    width: 38,
    height: 36,
    marginRight: 8,
  },
  brandName: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.4,
  },
  textContainer: {
    paddingHorizontal: 28,
    marginTop: 20,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    lineHeight: 42,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: colors.primary.linguaDeepPurple,
  },
  titleDot: {
    color: colors.neutral.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.neutral.textSecondary,
    marginTop: 12,
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  heroContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 16,
  },
  groundShadow: {
    height: 16,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginTop: -8,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  activeDot: {
    backgroundColor: colors.primary.linguaDeepPurple,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  ctaButton: {
    backgroundColor: colors.primary.linguaDeepPurple,
    height: 58,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primary.linguaDeepPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  ctaText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  ctaIconContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
