import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { typographySpec } from '../theme/typography';

export default function DesignSystemScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-[#F6F7FB]" edges={['top', 'bottom']}>
      {/* Top Header Navigation */}
      <View className="flex-row items-center px-5 py-3 bg-white border-b border-border">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full justify-center items-start"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color="#0D132B" />
        </Pressable>
        <Text className="font-poppins-bold text-lg text-text-primary ml-1">
          Design System
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        }}
      >
        {/* 1. BRAND SECTION CARD */}
        <View className="card-white p-6 mb-5">
          <Text className="font-poppins-bold text-xs uppercase tracking-widest text-lingua-deep-purple mb-4">
            BRAND
          </Text>
          <View className="h-[1px] bg-border mb-6" />

          <View className="flex-row items-center justify-center py-4">
            <Image
              source={require('../../assets/images/moscot-logo.png')}
              className="w-16 h-16 mr-3"
              resizeMode="contain"
            />
            <Text className="font-poppins-bold text-5xl text-text-primary tracking-tight">
              lingua
            </Text>
          </View>
        </View>

        {/* 2. COLORS SECTION CARD */}
        <View className="card-white p-6 mb-5">
          <Text className="font-poppins-bold text-xs uppercase tracking-widest text-lingua-deep-purple mb-4">
            COLORS
          </Text>
          <View className="h-[1px] bg-border mb-6" />

          {/* PRIMARY */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            PRIMARY
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            <View className="w-[23%] items-center">
              <View className="w-full aspect-square rounded-2xl bg-lingua-purple shadow-sm" />
              <Text className="font-poppins-semibold text-[10px] text-text-primary mt-2 text-center">
                LINGUA PURPLE
              </Text>
              <Text className="font-poppins text-[9px] text-text-secondary">
                #6C4EF5
              </Text>
            </View>

            <View className="w-[23%] items-center">
              <View className="w-full aspect-square rounded-2xl bg-lingua-deep-purple shadow-sm" />
              <Text className="font-poppins-semibold text-[10px] text-text-primary mt-2 text-center">
                LINGUA DEEP PURPLE
              </Text>
              <Text className="font-poppins text-[9px] text-text-secondary">
                #5B3BF6
              </Text>
            </View>

            <View className="w-[23%] items-center">
              <View className="w-full aspect-square rounded-2xl bg-lingua-blue shadow-sm" />
              <Text className="font-poppins-semibold text-[10px] text-text-primary mt-2 text-center">
                LINGUA BLUE
              </Text>
              <Text className="font-poppins text-[9px] text-text-secondary">
                #4D8BFF
              </Text>
            </View>

            <View className="w-[23%] items-center">
              <View className="w-full aspect-square rounded-2xl bg-lingua-green shadow-sm" />
              <Text className="font-poppins-semibold text-[10px] text-text-primary mt-2 text-center">
                LINGUA GREEN
              </Text>
              <Text className="font-poppins text-[9px] text-text-secondary">
                #21C16B
              </Text>
            </View>
          </View>

          {/* SEMANTIC */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            SEMANTIC
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-success" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                SUCCESS
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #21C16B
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-warning" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                WARNING
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #FFC800
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-streak" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                STREAK
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #FF8A00
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-error" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                ERROR
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #FF4D4F
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-info" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                INFO
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #4D8BFF
              </Text>
            </View>
          </View>

          {/* NEUTRALS */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            NEUTRALS
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-text-primary" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                TEXT / PRIMARY
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #0D132B
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-text-secondary" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                TEXT / SECONDARY
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #6B7280
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-border border border-border" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                BORDER
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #E5E7EB
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-surface border border-border" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                SURFACE
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #F6F7FB
              </Text>
            </View>

            <View className="w-[18%] items-center">
              <View className="w-full aspect-square rounded-xl bg-background border border-border" />
              <Text className="font-poppins-semibold text-[9px] text-text-primary mt-1.5 text-center">
                BACKGROUND
              </Text>
              <Text className="font-poppins text-[8px] text-text-secondary">
                #FFFFFF
              </Text>
            </View>
          </View>
        </View>

        {/* 3. TYPOGRAPHY SECTION CARD */}
        <View className="card-white p-6 mb-5">
          <Text className="font-poppins-bold text-xs uppercase tracking-widest text-lingua-deep-purple mb-4">
            TYPOGRAPHY
          </Text>
          <View className="h-[1px] bg-border mb-6" />

          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-1">
            FONT FAMILY
          </Text>
          <Text className="font-poppins-bold text-4xl text-text-primary mb-2">
            Poppins
          </Text>
          <Text className="font-poppins text-sm leading-5 text-text-secondary mb-6">
            Poppins is a modern, geometric sans-serif typeface that provides
            excellent readability and a friendly personality.
          </Text>

          <View className="h-[1px] bg-border mb-4" />

          {/* Typography Spec Table */}
          <View className="divide-y divide-gray-100">
            {typographySpec.map((item) => (
              <View key={item.tag} className="py-3 flex-row items-baseline justify-between">
                <View className="w-24">
                  <Text
                    style={{
                      fontFamily: item.fontFamily,
                      fontSize: Math.min(item.size, 26),
                      lineHeight: Math.min(item.lineHeight, 32),
                      color: '#0D132B',
                    }}
                  >
                    {item.tag}
                  </Text>
                </View>

                <View className="flex-1 px-2">
                  <Text className="font-poppins text-xs text-text-primary">
                    {item.role}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className="font-poppins text-[11px] text-text-secondary">
                    {item.size}px · {item.weight} · {item.ratio}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 4. NATIVEWIND UTILITIES & COMPONENTS PREVIEW */}
        <View className="card-white p-6">
          <Text className="font-poppins-bold text-xs uppercase tracking-widest text-lingua-deep-purple mb-4">
            NATIVEWIND UTILITIES & COMPONENTS
          </Text>
          <View className="h-[1px] bg-border mb-6" />

          {/* Typography Classes */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            Typography Utility Classes
          </Text>
          <View className="gap-2 mb-6 p-4 bg-surface rounded-2xl border border-border">
            <Text className="text-h2 text-text-primary">text-h2 Section</Text>
            <Text className="text-h3 text-text-primary">text-h3 Card Title</Text>
            <Text className="text-h4 text-lingua-deep-purple">text-h4 Subheading</Text>
            <Text className="text-body-large text-text-primary">text-body-large Important content</Text>
            <Text className="text-body-medium text-text-secondary">text-body-medium Standard body text</Text>
            <Text className="text-body-small text-text-secondary">text-body-small Supporting metadata</Text>
            <Text className="text-caption text-text-secondary">text-caption Labels and tags</Text>
          </View>

          {/* Button Classes */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            Button Component Classes
          </Text>
          <View className="gap-3 mb-6">
            <Pressable className="btn-primary">
              <Text className="font-poppins-semibold text-base text-white">
                Primary Button (.btn-primary)
              </Text>
            </Pressable>

            <Pressable className="btn-secondary">
              <Text className="font-poppins-semibold text-base text-lingua-deep-purple">
                Secondary Button (.btn-secondary)
              </Text>
            </Pressable>

            <Pressable className="btn-outline">
              <Text className="font-poppins-medium text-sm text-text-secondary">
                Outline Button (.btn-outline)
              </Text>
            </Pressable>
          </View>

          {/* Semantic Badges */}
          <Text className="font-poppins-semibold text-xs tracking-wider text-text-secondary uppercase mb-3">
            Status & Semantic Badges
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <View className="px-3 py-1.5 rounded-full bg-emerald-50 border border-success">
              <Text className="font-poppins-semibold text-xs text-success">
                ✓ Success #21C16B
              </Text>
            </View>

            <View className="px-3 py-1.5 rounded-full bg-amber-50 border border-warning">
              <Text className="font-poppins-semibold text-xs text-amber-700">
                ⚠ Warning #FFC800
              </Text>
            </View>

            <View className="px-3 py-1.5 rounded-full bg-orange-50 border border-streak">
              <Text className="font-poppins-semibold text-xs text-streak">
                🔥 Streak #FF8A00
              </Text>
            </View>

            <View className="px-3 py-1.5 rounded-full bg-red-50 border border-error">
              <Text className="font-poppins-semibold text-xs text-error">
                ✕ Error #FF4D4F
              </Text>
            </View>

            <View className="px-3 py-1.5 rounded-full bg-blue-50 border border-info">
              <Text className="font-poppins-semibold text-xs text-info">
                ℹ Info #4D8BFF
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
