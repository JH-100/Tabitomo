import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack, Redirect, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '../store/useUserStore';
import Colors from '../constants/Colors';

export default function RootLayout() {
  const { isLoading, hasCompletedOnboarding, setLoading } = useUserStore();
  const segments = useSegments();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const inOnboarding = segments[0] === '(onboarding)';

  // 온보딩 미완료인데 온보딩 밖에 있으면 → welcome으로
  if (!hasCompletedOnboarding && !inOnboarding) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // 온보딩 완료인데 온보딩 안에 있으면 → tabs로
  if (hasCompletedOnboarding && inOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="practice" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
