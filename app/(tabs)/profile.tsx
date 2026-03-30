import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Avatar3D from '../../components/Avatar3D';
import Colors from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

export default function ProfileScreen() {
  const { profile, currentLevel, streak, xp, reset } = useUserStore();

  const handleLogout = () => {
    // On web, Alert.alert doesn't work - just reset
    reset();
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>プロフィール</Text>
        <Text style={styles.sub}>Profile</Text>
      </View>

      <GlassCard depth={3} style={styles.profileCard}>
        <Avatar3D size={120} showGlow />
        <Text style={styles.name}>{profile?.displayName ?? 'Traveler'}</Text>
        {profile?.birthdate && (
          <Text style={styles.bio}>{profile.birthdate}</Text>
        )}
        <Text style={styles.bio}>일본 여행을 준비하는 중...</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>Lv.{currentLevel}</Text>
            <Text style={styles.statKey}>레벨</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.stat}>
            <Text style={styles.statVal}>{streak}일</Text>
            <Text style={styles.statKey}>연속</Text>
          </View>
          <View style={styles.sep} />
          <View style={styles.stat}>
            <Text style={styles.statVal}>{xp}</Text>
            <Text style={styles.statKey}>XP</Text>
          </View>
        </View>
      </GlassCard>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
      >
        <Text style={styles.logoutText}>로그아웃 / 초기화</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 16, marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.textSub, marginTop: 4 },

  profileCard: { alignItems: 'center', paddingVertical: 36 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 20 },
  bio: { fontSize: 14, color: Colors.textSub, marginTop: 4 },

  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    backgroundColor: Colors.surface1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border0,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 16,
  },
  stat: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: 20, fontWeight: '800', color: Colors.text },
  statKey: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  sep: { width: 1, height: 28, backgroundColor: Colors.border0 },

  logoutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
