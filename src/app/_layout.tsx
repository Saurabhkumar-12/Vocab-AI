import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useEffect, useRef } from "react";
import "../../global.css";
import { useLanguageStore } from "../store/language-store";
import { useAppFonts } from "../theme/fonts";
import { posthog } from "../config/posthog";

SplashScreen.preventAutoHideAsync().catch(() => {});

function PostHogIdentity() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const posthog = usePostHog();
  const identifiedUserId = useRef<string | null>(null);
  const hasResolvedAuthState = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.id) {
      if (identifiedUserId.current !== user.id) {
        if (identifiedUserId.current) {
          posthog.reset();
        }

        const email = user.primaryEmailAddress?.emailAddress;
        const name = user.fullName;

        posthog.identify(user.id, {
          $set: {
            ...(email ? { email } : {}),
            ...(name ? { name } : {}),
          },
        });
        identifiedUserId.current = user.id;
      }
      hasResolvedAuthState.current = true;
      return;
    }

    if (identifiedUserId.current || !hasResolvedAuthState.current) {
      posthog.reset();
      identifiedUserId.current = null;
    }
    hasResolvedAuthState.current = true;
  }, [
    isLoaded,
    isSignedIn,
    posthog,
    user?.fullName,
    user?.id,
    user?.primaryEmailAddress?.emailAddress,
  ]);

  return null;
}

export default function RootLayout() {
  const [loaded, error] = useAppFonts();
  const hydrateSelectedLanguage = useLanguageStore((state) => state.hydrateSelectedLanguage);

  useEffect(() => {
    hydrateSelectedLanguage();
  }, [hydrateSelectedLanguage]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file.");
  }

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthog ? <PostHogIdentity /> : null}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="design-system"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="language-picker"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </ClerkProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app;
}
