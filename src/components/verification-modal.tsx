import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

interface VerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
}

export function VerificationModal({
  visible,
  email,
  onClose,
}: VerificationModalProps) {
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setCode('');
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleCodeChange = (text: string) => {
    // Only accept numeric digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(cleaned);

    // Automatically navigate to home route (/) when 6th digit is entered
    if (cleaned.length === 6) {
      Keyboard.dismiss();
      setTimeout(() => {
        onClose();
        router.replace('/');
      }, 250);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Close button */}
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close verification modal"
          >
            <Ionicons name="close" size={22} color={colors.neutral.textSecondary} />
          </Pressable>

          {/* Mail Icon Badge */}
          <View style={styles.iconBadge}>
            <Ionicons
              name="mail-outline"
              size={32}
              color={colors.primary.linguaDeepPurple}
            />
          </View>

          {/* Title & Copy */}
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            {"We've sent a 6-digit verification code to"}
            {'\n'}
            <Text style={styles.emailHighlight}>{email || 'your email'}</Text>
          </Text>
          <Text style={styles.instruction}>
            Enter the code below to continue.
          </Text>

          {/* 6 Digit Input Boxes */}
          <Pressable
            style={styles.digitsContainer}
            onPress={() => inputRef.current?.focus()}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const digit = code[index] || '';
              const isCurrent = code.length === index;
              const isFilled = Boolean(digit);

              return (
                <View
                  key={index}
                  style={[
                    styles.digitBox,
                    isCurrent && styles.digitBoxActive,
                    isFilled && styles.digitBoxFilled,
                  ]}
                >
                  <Text style={styles.digitText}>{digit}</Text>
                </View>
              );
            })}
          </Pressable>

          {/* Hidden number-pad TextInput */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            caretHidden={true}
            autoFocus={true}
          />

          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{"Didn't receive the code? "}</Text>
            <Pressable onPress={() => handleCodeChange('')}>
              <Text style={styles.resendLink}>Resend code</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 19, 43, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F1EFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
  emailHighlight: {
    fontFamily: fontFamilies.semiBold,
    color: colors.primary.linguaDeepPurple,
  },
  instruction: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  digitBox: {
    flex: 1,
    height: 52,
    marginHorizontal: 4,
    borderRadius: 14,
    backgroundColor: '#F6F7FB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBoxActive: {
    borderColor: colors.primary.linguaDeepPurple,
    backgroundColor: '#FFFFFF',
    shadowColor: colors.primary.linguaDeepPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  digitBoxFilled: {
    borderColor: colors.primary.linguaDeepPurple,
    backgroundColor: '#FFFFFF',
  },
  digitText: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    width: 1,
    height: 1,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  resendLink: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: colors.primary.linguaDeepPurple,
  },
});
