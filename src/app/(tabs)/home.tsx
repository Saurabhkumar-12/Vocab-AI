import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { usePostHog } from 'posthog-react-native';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LANGUAGE_MAP } from '../../../data/languages';
import { LESSONS } from '../../../data/lessons';
import { useLanguageStore } from '../../store/language-store';
import { colors } from '../../theme/colors';
import { images } from '../../theme/images';
import { fontFamilies } from '../../theme/typography';

const DAILY_GOAL_XP = 20;
const PLAN_ITEM_XP: Record<string, number> = {
  lesson: 10,
  conversation: 5,
  words: 5,
};

function getLocalDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function HomeTabScreen() {
  const { user } = useUser();
  const posthog = usePostHog();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const [planProgress, setPlanProgress] = useState<{
    storageKey: string | null;
    completedIds: string[];
    hydrated: boolean;
  }>({ storageKey: null, completedIds: [], hydrated: false });

  const greetingName = user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Learner';
  const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || 'No email on account';
  const userAvatar = user?.imageUrl ? { uri: user.imageUrl } : images.profileFallback;
  const currentLanguage = selectedLanguage ? LANGUAGE_MAP[selectedLanguage] : LANGUAGE_MAP.es;
  const currentLesson = selectedLanguage
    ? LESSONS.find((lesson) => lesson.languageCode === selectedLanguage)
    : LESSONS[0];
  const lessonHeadline = currentLesson?.title ?? 'Your next lesson';
  const planStorageKey = selectedLanguage
    ? `vocabai-home-plan:${selectedLanguage}:${getLocalDateKey()}`
    : null;
  const currentPlanProgress = planProgress.storageKey === planStorageKey
    ? planProgress
    : { storageKey: planStorageKey, completedIds: [], hydrated: false };
  const completedPlanIds = currentPlanProgress.completedIds;
  const isPlanHydrated = currentPlanProgress.hydrated;

  useEffect(() => {
    let isActive = true;
    if (!planStorageKey) {
      return () => {
        isActive = false;
      };
    }

    AsyncStorage.getItem(planStorageKey)
      .then((value) => {
        if (!isActive) return;
        const parsedValue: unknown = value ? JSON.parse(value) : [];
        setPlanProgress({
          storageKey: planStorageKey,
          completedIds: Array.isArray(parsedValue)
            ? parsedValue.filter((id): id is string => typeof id === 'string' && id in PLAN_ITEM_XP)
            : [],
          hydrated: true,
        });
      })
      .catch((error) => {
        console.warn('Failed to load today’s learning plan:', error);
        if (isActive) {
          setPlanProgress({ storageKey: planStorageKey, completedIds: [], hydrated: true });
        }
      });

    return () => {
      isActive = false;
    };
  }, [planStorageKey]);

  useEffect(() => {
    if (!planStorageKey || !isPlanHydrated) return;
    AsyncStorage.setItem(planStorageKey, JSON.stringify(completedPlanIds)).catch((error) => {
      console.warn('Failed to save today’s learning plan:', error);
    });
  }, [completedPlanIds, isPlanHydrated, planStorageKey]);

  const handleProfilePress = () => router.navigate('/(tabs)/profile');

  const handleNotificationsPress = () => {
    Alert.alert('Notifications', 'You’re all caught up.');
  };

  const handleGoalPress = () => {
    Alert.alert(
      'Daily goal',
      `${dailyGoal.current} of ${dailyGoal.total} XP earned today. Complete items in today’s plan to make progress.`,
    );
  };

  const handleContinueLessonPress = () => {
    posthog.capture('lesson_continue_selected', {
      language_code: selectedLanguage ?? 'es',
    });
    router.navigate('/(tabs)/learn');
  };

  const handlePlanPress = (itemId: string) => {
    posthog.capture('learning_plan_item_selected', {
      plan_item_id: itemId,
      destination: itemId === 'conversation' ? 'ai_teacher' : 'learn',
    });
    router.navigate(itemId === 'conversation' ? '/(tabs)/ai-teacher' : '/(tabs)/learn');
  };

  const handleNextUpPress = () => {
    router.navigate('/(tabs)/ai-teacher');
  };

  const handlePlanToggle = (itemId: string) => {
    if (!planStorageKey || !isPlanHydrated) return;
    posthog.capture('learning_plan_item_completion_changed', {
      plan_item_id: itemId,
      is_completed: !completedPlanIds.includes(itemId),
    });
    setPlanProgress((current) => {
      const currentIds = current.storageKey === planStorageKey ? current.completedIds : [];
      return {
        storageKey: planStorageKey,
        completedIds: currentIds.includes(itemId)
          ? currentIds.filter((id) => id !== itemId)
          : [...currentIds, itemId],
        hydrated: true,
      };
    });
  };

  const todayPlan = [
    {
      id: 'lesson',
      title: currentLesson?.title ?? 'Lesson practice',
      subtitle: currentLesson?.description ?? `${currentLanguage.name} lessons are coming soon.`,
      icon: 'book',
      iconColor: '#5C4AF4',
      backgroundColor: '#E7E4FF',
      done: completedPlanIds.includes('lesson'),
      xp: PLAN_ITEM_XP.lesson,
    },
    {
      id: 'conversation',
      title: 'AI Conversation',
      subtitle: `Practice ${currentLanguage.name} speaking`,
      icon: 'headset',
      iconColor: '#5C4AF4',
      backgroundColor: '#E7E4FF',
      done: completedPlanIds.includes('conversation'),
      xp: PLAN_ITEM_XP.conversation,
    },
    {
      id: 'words',
      title: 'New words',
      subtitle: `${Math.min(currentLesson?.vocabulary.length ?? 0, 10)} words`,
      icon: 'chatbubbles',
      iconColor: '#F25C8A',
      backgroundColor: '#FFE3EE',
      done: completedPlanIds.includes('words'),
      xp: PLAN_ITEM_XP.words,
    },
  ];

  const dailyGoal = {
    current: todayPlan.reduce((total, item) => total + (item.done ? item.xp : 0), 0),
    total: DAILY_GOAL_XP,
  };
  const progressPercent = Math.min((dailyGoal.current / dailyGoal.total) * 100, 100);
  const nextLessonText = `${currentLanguage.name} lesson`;
  const nextLessonSubtitle = currentLesson?.goals[0]?.text ?? 'Explore your learning plan and keep moving forward.';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.headerRow}>
          <View style={styles.userGroup}>
            <Pressable
              style={({ pressed }) => [styles.avatarButton, pressed && styles.pressedButton]}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
              onPress={handleProfilePress}
              hitSlop={8}
            >
              <Image source={{ uri: userAvatar }} style={styles.avatarImageSmall} />
            </Pressable>
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingLabel}>Welcome back</Text>
              <Text style={styles.greetingText}>{greetingName} 👋</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={({ pressed }) => [styles.streakBadge, pressed && styles.pressedButton]}
              accessibilityRole="button"
              accessibilityLabel={`${completedPlanIds.length} of 3 plan activities completed today`}
              onPress={handleGoalPress}
            >
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{completedPlanIds.length}/3</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressedButton]}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={handleNotificationsPress}
              hitSlop={8}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.neutral.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.userSummaryCard}>
          <View style={styles.userSummaryLeft}>
            <Text style={styles.userSummaryLabel}>Current learner</Text>
            <Text style={styles.userSummaryName}>{user?.fullName || greetingName}</Text>
            <Text style={styles.userSummaryMeta}>{userEmail}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.languagePill, pressed && styles.pressedButton]}
            onPress={() => router.push('/language-picker')}
            accessibilityRole="button"
            accessibilityLabel={`Change learning language, currently ${currentLanguage.name}`}
          >
            <Text style={styles.languagePillText}>{currentLanguage.emoji} {currentLanguage.name}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.goalCard, pressed && styles.goalCardPressed]}
          accessibilityRole="button"
          onPress={handleGoalPress}
          hitSlop={10}
        >
          <View style={styles.goalTextBlock}>
            <Text style={styles.goalLabel}>Daily goal</Text>
            <Text style={styles.goalValue}>
              {dailyGoal.current}<Text style={styles.goalValueMuted}> / {dailyGoal.total} XP</Text>
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          <Image source={images.dailyGoal} style={styles.treasureImage} resizeMode="contain" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.learnCard, pressed && styles.learnCardPressed]}
          accessibilityRole="button"
          onPress={handleContinueLessonPress}
          hitSlop={10}
        >
          <View style={styles.learnTextBlock}>
            <Text style={styles.learnLabel}>Continue learning</Text>
            <Text style={styles.learnLanguage}>{lessonHeadline}</Text>
            <Text style={styles.learnMeta}>
              {currentLesson
                ? `${currentLesson.difficulty.toUpperCase()} • ${currentLesson.estimatedMinutes} min`
                : 'No lessons available yet'}
            </Text>
            <View style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </View>
          </View>

          <Image source={images.lessonArtwork} style={styles.lessonImage} resizeMode="cover" />
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s plan</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View all learning activities"
            onPress={handleContinueLessonPress}
            hitSlop={8}
          >
            <Text style={styles.sectionAction}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.planList}>
          {todayPlan.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.planRow, pressed && styles.planRowPressed]}
              accessibilityRole="button"
              onPress={() => handlePlanPress(item.id)}
              hitSlop={8}
            >
              <View style={[styles.planIcon, { backgroundColor: item.backgroundColor }]}>
                <Ionicons name={item.icon as any} size={27} color={item.iconColor} />
              </View>

              <View style={styles.planTextBlock}>
                <Text style={styles.planTitle}>{item.title}</Text>
                <Text style={styles.planSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.planStatusWrap}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.done }}
                  accessibilityLabel={`${item.done ? 'Mark incomplete' : 'Mark complete'}: ${item.title}`}
                  onPress={() => handlePlanToggle(item.id)}
                  disabled={!isPlanHydrated}
                  hitSlop={10}
                >
                  {item.done ? (
                    <View style={styles.checkedCircle}>
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.emptyCircle} />
                  )}
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.nextUpCard, pressed && styles.nextUpCardPressed]}
          accessibilityRole="button"
          onPress={handleNextUpPress}
          hitSlop={10}
        >
          <View style={styles.nextUpTextBlock}>
            <Text style={styles.nextUpLabel}>Next up</Text>
            <Text style={styles.nextUpTitle}>{nextLessonText}</Text>
            <Text style={styles.nextUpSubtitle}>{nextLessonSubtitle}</Text>
          </View>

          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatarImage}
            />
            <View style={styles.callBubble}>
              <Ionicons name="videocam" size={20} color="#FFFFFF" />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  userGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EAE7FF',
  },
  avatarImageSmall: {
    width: '100%',
    height: '100%',
  },
  greetingBlock: {
    justifyContent: 'center',
  },
  greetingLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#7C7E8F',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  greetingText: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.8,
  },
  userSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  pressedButton: {
    backgroundColor: '#E7E5F4',
    transform: [{ scale: 0.97 }],
    borderColor: '#D5D0F5',
    shadowColor: '#3B2AA5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  goalCardPressed: {
    backgroundColor: '#E9D9C8',
    transform: [{ scale: 0.99 }],
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  learnCardPressed: {
    backgroundColor: '#4738D8',
    transform: [{ scale: 0.99 }],
    shadowColor: '#211A72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  nextUpCardPressed: {
    backgroundColor: '#DDEED1',
    transform: [{ scale: 0.99 }],
    shadowColor: '#2F4E2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 4,
  },
  planRowPressed: {
    backgroundColor: '#F3F2F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userSummaryLeft: {
    flex: 1,
    marginRight: 12,
  },
  userSummaryLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: '#6C5AE7',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  userSummaryName: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.neutral.textPrimary,
    marginBottom: 2,
  },
  userSummaryMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#757A8B',
  },
  languagePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E3FF',
  },
  languagePillText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 12,
    color: '#4230B9',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4F0',
    borderRadius: 18,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  streakEmoji: {
    fontSize: 18,
  },
  streakText: {
    fontFamily: fontFamilies.semiBold,
    color: colors.neutral.textPrimary,
    fontSize: 17,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F7',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4E9DF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 18,
    minHeight: 120,
  },
  goalTextBlock: {
    flex: 1,
    marginRight: 12,
  },
  goalLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    color: colors.neutral.textPrimary,
    marginBottom: 8,
  },
  goalValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  goalValueMuted: {
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    color: '#8D8C92',
  },
  progressTrack: {
    height: 12,
    backgroundColor: '#E9C9A1',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F39A2B',
    borderRadius: 999,
  },
  treasureImage: {
    width: 96,
    height: 96,
    borderRadius: 20,
  },
  learnCard: {
    backgroundColor: '#5B4AE7',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 175,
  },
  learnTextBlock: {
    flex: 1,
    marginRight: 8,
  },
  learnLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 17,
    color: '#D9D3FF',
    marginBottom: 6,
  },
  learnLanguage: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 6,
  },
  learnMeta: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: '#D9D3FF',
    marginBottom: 18,
  },
  continueButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 26,
    paddingVertical: 14,
    minWidth: 140,
  },
  continueButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 17,
    color: colors.primary.linguaDeepPurple,
    textAlign: 'center',
  },
  lessonImage: {
    width: 150,
    height: 110,
    borderRadius: 14,
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.neutral.textPrimary,
  },
  sectionAction: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.primary.linguaDeepPurple,
  },
  planList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 18,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    minHeight: 72,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planTextBlock: {
    flex: 1,
  },
  planTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.6,
  },
  planSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    color: '#7C7A80',
    marginTop: 2,
  },
  planStatusWrap: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6C4EF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B9B7C0',
  },
  nextUpCard: {
    backgroundColor: '#EDF4E5',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 120,
  },
  nextUpTextBlock: {
    flex: 1,
    marginRight: 10,
  },
  nextUpLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 18,
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  nextUpTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  nextUpSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: '#5F6D5C',
  },
  avatarWrap: {
    position: 'relative',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  callBubble: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#33D17A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#EDF4E5',
  },
});
