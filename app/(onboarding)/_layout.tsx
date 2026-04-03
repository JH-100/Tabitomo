import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack initialRouteName="welcome" screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="passport" />
    </Stack>
  );
}
