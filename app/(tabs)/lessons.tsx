import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';
import HIRAGANA_LESSONS from '../../constants/LessonData';
import KATAKANA_LESSONS from '../../constants/KatakanaData';
import type { HiraganaLesson } from '../../constants/LessonData';
import { useUserStore } from '../../store/useUserStore';

function LessonCard({
  lesson,
  isCompleted,
  isLocked,
}: {
  lesson: HiraganaLesson;
  isCompleted: boolean;
  isLocked: boolean;
}) {
  return (
    <GlassCard
      depth={isLocked ? 0 : 2}
      style={[styles.lessonCard, isLocked && styles.lessonCardLocked]}
      onPress={isLocked ? undefined : () => router.push(`/lesson/${lesson.id}`)}
    >
      <View style={styles.lessonRow}>
        <View
          style={[
            styles.lessonIcon,
            isCompleted && styles.lessonIconCompleted,
            isLocked && styles.lessonIconLocked,
          ]}
        >
          {isLocked ? (
            <Ionicons name="lock-closed" size={20} color={Colors.textMuted} />
          ) : isCompleted ? (
            <Ionicons name="checkmark" size={22} color={Colors.mint} />
          ) : (
            <Text style={styles.lessonEmoji}>{lesson.icon}</Text>
          )}
        </View>

        <View style={styles.lessonContent}>
          <View style={styles.lessonTitleRow}>
            <Text style={[styles.lessonTitle, isLocked && styles.textLocked]}>{lesson.title}</Text>
            <Text style={[styles.lessonTitleJa, isLocked && styles.textLocked]}>
              {lesson.titleJa}
            </Text>
          </View>
          <Text style={[styles.lessonDesc, isLocked && styles.textLocked]}>
            {lesson.description}
          </Text>
          <View style={styles.lessonMeta}>
            <Text style={[styles.lessonChars, isLocked && styles.textLocked]}>
              {lesson.characters.map((c) => c.char).join(' ')}
            </Text>
            {!isLocked && <Text style={styles.lessonXp}>+{lesson.xpReward} XP</Text>}
          </View>
        </View>

        {!isLocked && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={isCompleted ? Colors.mint : Colors.textMuted}
          />
        )}
      </View>
    </GlassCard>
  );
}

export default function LessonsScreen() {
  const { lessonsCompleted } = useUserStore();

  const hiraganaCompleted = HIRAGANA_LESSONS.filter((l) => lessonsCompleted.includes(l.id)).length;
  const katakanaCompleted = KATAKANA_LESSONS.filter((l) => lessonsCompleted.includes(l.id)).length;

  const allHiraganaComplete = hiraganaCompleted === HIRAGANA_LESSONS.length;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.title}>レッスン</Text>
          <Text style={styles.sub}>Lessons</Text>
        </Animated.View>

        {/* === 히라가나 섹션 === */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ひらがな</Text>
            <Text style={styles.sectionSub}>히라가나</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <GlassCard depth={1} style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View>
                <Text style={styles.progressLabel}>히라가나 진행률</Text>
                <Text style={styles.progressValue}>
                  {hiraganaCompleted} / {HIRAGANA_LESSONS.length}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(hiraganaCompleted / HIRAGANA_LESSONS.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {HIRAGANA_LESSONS.map((lesson, index) => {
          const isCompleted = lessonsCompleted.includes(lesson.id);
          const isLocked = index > 0 && !lessonsCompleted.includes(HIRAGANA_LESSONS[index - 1].id);
          return (
            <Animated.View
              key={lesson.id}
              entering={FadeInDown.delay(250 + index * 60).duration(500)}
            >
              <LessonCard lesson={lesson} isCompleted={isCompleted} isLocked={isLocked} />
            </Animated.View>
          );
        })}

        {/* === 카타카나 섹션 === */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={[styles.sectionHeader, { marginTop: 28 }]}>
            <Text style={styles.sectionTitle}>カタカナ</Text>
            <Text style={styles.sectionSub}>카타카나</Text>
            {!allHiraganaComplete && (
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={12} color={Colors.textMuted} />
                <Text style={styles.lockBadgeText}>히라가나 완료 후 해금</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {allHiraganaComplete && (
          <Animated.View entering={FadeInDown.delay(450).duration(500)}>
            <GlassCard depth={1} style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View>
                  <Text style={styles.progressLabel}>카타카나 진행률</Text>
                  <Text style={styles.progressValue}>
                    {katakanaCompleted} / {KATAKANA_LESSONS.length}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${(katakanaCompleted / KATAKANA_LESSONS.length) * 100}%`,
                        backgroundColor: Colors.blue,
                      },
                    ]}
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {KATAKANA_LESSONS.map((lesson, index) => {
          const isCompleted = lessonsCompleted.includes(lesson.id);
          const isLocked =
            !allHiraganaComplete ||
            (index > 0 && !lessonsCompleted.includes(KATAKANA_LESSONS[index - 1].id));
          return (
            <Animated.View
              key={lesson.id}
              entering={FadeInDown.delay(500 + index * 60).duration(500)}
            >
              <LessonCard lesson={lesson} isCompleted={isCompleted} isLocked={isLocked} />
            </Animated.View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.textSub, marginTop: 4 },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  sectionSub: { fontSize: 13, color: Colors.textMuted },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: Colors.surface1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lockBadgeText: { fontSize: 10, color: Colors.textMuted },

  // Progress
  progressCard: { marginBottom: 16 },
  progressRow: { gap: 12 },
  progressLabel: { fontSize: 13, color: Colors.textSub, fontWeight: '500' },
  progressValue: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 2 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface1,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.mint },

  // Lesson card
  lessonCard: { marginBottom: 12 },
  lessonCardLocked: { opacity: 0.5 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIconCompleted: { backgroundColor: Colors.mintMuted, borderColor: Colors.mint },
  lessonIconLocked: { backgroundColor: Colors.surface0, borderColor: Colors.border0 },
  lessonEmoji: { fontSize: 22 },
  lessonContent: { flex: 1, gap: 4 },
  lessonTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  lessonTitleJa: { fontSize: 12, color: Colors.amber, fontWeight: '500' },
  lessonDesc: { fontSize: 12, color: Colors.textSub },
  lessonMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lessonChars: { fontSize: 16, color: Colors.textMuted, letterSpacing: 4 },
  lessonXp: { fontSize: 11, color: Colors.amber, fontWeight: '700' },
  textLocked: { color: Colors.textDim },
});
