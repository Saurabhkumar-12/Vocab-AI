import { useAuth } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { usePostHog } from 'posthog-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import type { LanguageCode } from '../../types/learning';
import { useLanguageStore } from '../store/language-store';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';

export default function LanguagePickerScreen() {
  const { isSignedIn } = useAuth();
  const posthog = usePostHog();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);
  const [query, setQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<LanguageCode>(selectedLanguage ?? 'es');

  const filteredLanguages = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return SUPPORTED_LANGUAGES;
    }

    return SUPPORTED_LANGUAGES.filter((language) => {
      return (
        language.name.toLowerCase().includes(value) ||
        language.nativeName.toLowerCase().includes(value) ||
        language.description.toLowerCase().includes(value)
      );
    });
  }, [query]);

  const handleConfirm = async () => {
    await setSelectedLanguage(selectedCode);
    posthog.capture('learning_language_selected', {
      language_code: selectedCode,
    });

    if (isSignedIn) {
      router.replace('/');
      return;
    }

    router.push('/sign-up');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color={colors.neutral.textPrimary} />
          </Pressable>
        </View>

        <Text style={styles.title}>Choose a language</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={22} color="#8B93A7" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search languages"
            placeholderTextColor="#8B93A7"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Popular</Text>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filteredLanguages.map((language) => {
            const isSelected = language.code === selectedCode;

            return (
              <Pressable
                key={language.code}
                onPress={() => setSelectedCode(language.code)}
                style={({ pressed }) => [
                  styles.languageRow,
                  isSelected && styles.languageRowSelected,
                  pressed && styles.languageRowPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${language.name}`}
              >
                <View style={styles.languageLeft}>
                  <View style={styles.flagBubble}>
                    <Text style={styles.flagText}>{language.emoji}</Text>
                  </View>

                  <View style={styles.languageMeta}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.languageLearners}>{language.learners.toFixed(1)}M learners</Text>
                  </View>
                </View>

                {isSelected ? (
                  <View style={styles.checkBubble}>
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={22} color="#A8AEBF" />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={handleConfirm}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Confirm language"
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </Pressable>

        <Image
          source={require('../../assets/images/earth.png')}
          style={styles.earthImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    lineHeight: 42,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.7,
    marginBottom: 18,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF1F6',
    borderRadius: 999,
    height: 58,
    paddingHorizontal: 18,
    marginBottom: 22,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    color: colors.neutral.textPrimary,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
    gap: 10,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F9',
    borderWidth: 1,
    borderColor: '#E6EAF0',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 80,
  },
  languageRowSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6C4EF5',
    borderWidth: 2,
    shadowColor: '#6C4EF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  languageRowPressed: {
    opacity: 0.9,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
    marginRight: 16,
  },
  flagText: {
    fontSize: 28,
  },
  languageMeta: {
    flex: 1,
  },
  languageName: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.neutral.textPrimary,
  },
  languageLearners: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
  },
  checkBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5B3BF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#5B3BF6',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  confirmButtonPressed: {
    opacity: 0.9,
  },
  confirmButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  earthImage: {
    width: '100%',
    height: 180,
    alignSelf: 'center',
    marginTop: 4,
  },
});
