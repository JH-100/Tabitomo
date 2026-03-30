import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '../store/useUserStore';
import Colors from '../constants/Colors';

export default function RootLayout() {
  const { isLoading, hasCompletedOnboarding, setLoading } = useUserStore();

  useEffect(() => {
    // Zustand hydrates from AsyncStorage automatically.
    // Give it a moment, then mark as ready.
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

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        {hasCompletedOnboarding ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(onboarding)" />
        )}
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
