import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused }: { name: IoniconsName; color: string; focused: boolean }) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <Ionicons
        size={21}
        name={focused ? name : (`${name}-outline` as IoniconsName)}
        color={color}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBg,
          borderTopWidth: 1,
          borderTopColor: Colors.border0,
          height: 82,
          paddingBottom: 24,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.2 },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
      }} />
      <Tabs.Screen name="lessons" options={{
        title: 'Lessons',
        tabBarIcon: ({ color, focused }) => <TabIcon name="book" color={color} focused={focused} />,
      }} />
      <Tabs.Screen name="practice" options={{
        title: 'Practice',
        tabBarIcon: ({ color, focused }) => <TabIcon name="chatbubbles" color={color} focused={focused} />,
      }} />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => <TabIcon name="person" color={color} focused={focused} />,
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
});
