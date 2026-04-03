import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Avatar3D from '../../components/Avatar3D';
import JourneyMap from '../../components/JourneyMap';
import Colors from '../../constants/Colors';
import TRAVEL_STAGES from '../../constants/TravelStages';
import HIRAGANA_LESSONS from '../../constants/LessonData';
import KATAKANA_LESSONS from '../../constants/KatakanaData';
import { useUserStore } from '../../store/useUserStore';

const ALL_LESSONS = [...HIRAGANA_LESSONS, ...KATAKANA_LESSONS];

export default function HomeScreen() {
  const { currentLevel, streak, profile, lessonsCompleted } = useUserStore();
  const stage = TRAVEL_STAGES[currentLevel] ?? TRAVEL_STAGES[0];
  const next = TRAVEL_STAGES[currentLevel + 1];

  // 다음 미완료 레슨 찾기 (히라가나 → 카타카나 순)
  const nextLesson = ALL_LESSONS.find((l) => !lessonsCompleted.includes(l.id));
  const hasCompletedAny = lessonsCompleted.length > 0;

  return (
    <ScreenContainer>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header - calm, minimal */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hi}>
              {profile?.displayName ? `${profile.displayName}さん` : 'おかえり'}
            </Text>
            <Text style={styles.hiSub}>오늘도 여행 준비를 계속해볼까요?</Text>
          </View>
          <GlassCard depth={1} noPadding style={styles.streak}>
            <Text style={styles.streakNum}>🔥 {streak}</Text>
          </GlassCard>
        </View>

        {/* Hero - avatar + current status */}
        <GlassCard depth={3} style={styles.hero}>
          <View style={styles.heroInner}>
            <Avatar3D size={110} showGlow accessory="luggage" />
            <View style={styles.heroText}>
              <View style={styles.lvBadge}>
                <Text style={styles.lvBadgeText}>Lv.{stage.level}</Text>
              </View>
              <Text style={styles.heroLoc}>{stage.location}</Text>
              <Text style={styles.heroLocJa}>{stage.locationJa}</Text>
              {next && (
                <View style={styles.nextPill}>
                  <Text style={styles.nextArrow}>→</Text>
                  <Text style={styles.nextText}>{next.requirement}</Text>
                </View>
              )}
            </View>
          </View>
        </GlassCard>

        {/* Quick actions - tactile buttons */}
        <View style={styles.actions}>
          <GlassCard
            depth={2}
            style={styles.actionBtn}
            onPress={() => {
              if (nextLesson) router.push(`/lesson/${nextLesson.id}`);
              else router.push('/(tabs)/lessons');
            }}
          >
            <View style={[styles.actionGlow, { backgroundColor: Colors.primaryMuted }]} />
            <Text style={styles.actionEmoji}>📖</Text>
            <Text style={styles.actionLabel}>{nextLesson ? '다음 레슨' : '레슨 목록'}</Text>
          </GlassCard>
          <GlassCard
            depth={hasCompletedAny ? 2 : 0}
            style={[styles.actionBtn, !hasCompletedAny && styles.actionDisabled]}
            onPress={hasCompletedAny ? () => router.push('/practice/quiz') : undefined}
          >
            <View style={[styles.actionGlow, { backgroundColor: Colors.blueMuted }]} />
            <Text style={styles.actionEmoji}>🎯</Text>
            <Text style={styles.actionLabel}>퀴즈</Text>
          </GlassCard>
          <GlassCard
            depth={hasCompletedAny ? 2 : 0}
            style={[styles.actionBtn, !hasCompletedAny && styles.actionDisabled]}
            onPress={hasCompletedAny ? () => router.push('/practice/matching') : undefined}
          >
            <View style={[styles.actionGlow, { backgroundColor: Colors.purpleMuted }]} />
            <Text style={styles.actionEmoji}>🃏</Text>
            <Text style={styles.actionLabel}>매칭 게임</Text>
          </GlassCard>
        </View>

        {/* Journey section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>여행 경로</Text>
          <Text style={styles.sectionJa}>旅のルート</Text>
        </View>
        <JourneyMap currentLevel={currentLevel} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  hi: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  hiSub: {
    fontSize: 13,
    color: Colors.textSub,
    marginTop: 4,
  },
  streak: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  streakNum: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.amber,
  },

  // Hero
  hero: {
    marginBottom: 24,
    padding: 24,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroText: {
    flex: 1,
  },
  lvBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
    shadowColor: Colors.shadowColored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  lvBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  heroLoc: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  heroLocJa: {
    fontSize: 14,
    color: Colors.textSub,
    marginTop: 2,
  },
  nextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: Colors.surface1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  nextArrow: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  nextText: {
    fontSize: 12,
    color: Colors.mint,
    fontWeight: '600',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  actionGlow: {
    position: 'absolute',
    top: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.6,
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  actionDisabled: {
    opacity: 0.4,
  },

  // Section
  section: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  sectionJa: {
    fontSize: 13,
    color: Colors.textDim,
  },
});
