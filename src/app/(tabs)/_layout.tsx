import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

const TAB_ITEMS = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'learn', label: 'Learn', icon: 'book' },
  { name: 'ai-teacher', label: 'AI Teacher', icon: 'sparkles' },
  { name: 'chat', label: 'Chat', icon: 'chatbubble' },
  { name: 'profile', label: 'Profile', icon: 'person' },
] as const;

function CustomTabBar({ state, navigation }: any) {
  const { width } = useWindowDimensions();
  const activeIndicatorX = useMemo(() => new Animated.Value(0), []);
  const tabWidth = width / TAB_ITEMS.length;

  useEffect(() => {
    const target = state.index * tabWidth + (tabWidth - 55) / 2;
    Animated.timing(activeIndicatorX, {
      toValue: target,
      duration: 180,
      useNativeDriver: false,
      easing: undefined,
    }).start();
  }, [activeIndicatorX, state.index, tabWidth]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.tabBarWrap}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeIndicator,
            {
              width: 55,
              height: 55,
              transform: [{ translateX: activeIndicatorX }],
            },
          ]}
        >
          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            if (!isFocused) return null;

            const item = TAB_ITEMS.find((tab) => tab.name === route.name) ?? TAB_ITEMS[0];

            return (
              <Ionicons
                key={route.key}
                name={item.icon as any}
                size={26}
                color="#FFFFFF"
              />
            );
          })}
        </Animated.View>

        {state.routes.map((route: any, index: number) => {
          const item = TAB_ITEMS.find((tab) => tab.name === route.name) ?? TAB_ITEMS[0];
          const isFocused = state.index === index;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tabItem, { width: tabWidth }]}
            >
              {!isFocused && (
                <View style={styles.inactiveItemContent}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={colors.neutral.textSecondary}
                  />
                  <Text style={styles.tabLabel}>{item.label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="ai-teacher" options={{ title: 'AI Teacher' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  tabBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderTopColor: '#F2F2F5',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    minHeight: 78,
    position: 'relative',
    overflow: 'visible',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 62,
    zIndex: 2,
  },
  inactiveItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    borderRadius: 27.5,
    backgroundColor: '#6B5CF6',
    shadowColor: '#6B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    textAlign: 'center',
  },
});
