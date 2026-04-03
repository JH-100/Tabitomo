import { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';
import HIRAGANA_LESSONS from '../../constants/LessonData';
import { useUserStore } from '../../store/useUserStore';

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type OptionState = 'default' | 'correct' | 'wrong' | 'dimmed';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completeLesson, lessonsCompleted, recordFlashcardResult } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  const lesson = HIRAGANA_LESSONS.find((l) => l.id === id);

  // Generate shuffled options for each question
  const optionsPerQuestion = useMemo(() => {
    if (!lesson) return [];
    return lesson.characters.map((char) => {
      const others = lesson.characters.filter((c) => c.char !== char.char).map((c) => c.char);
      const distractors = shuffleArray(others).slice(0, Math.min(3, others.length));
      return shuffleArray([char.char, ...distractors]);
    });
  }, [lesson]);

  if (!lesson) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>레슨을 찾을 수 없습니다</Text>
        </View>
      </ScreenContainer>
    );
  }

  const isAlreadyCompleted = lessonsCompleted.includes(lesson.id);
  const char = lesson.characters[currentIndex];
  const isLastChar = currentIndex === lesson.characters.length - 1;
  const progress = (currentIndex + 1) / lesson.characters.length;
  const options = optionsPerQuestion[currentIndex] || [];

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === char.char;
    recordFlashcardResult(`${lesson.id}:${currentIndex}`, isCorrect ? 'knew' : 'didnt');
    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      if (isLastChar) {
        completeLesson(lesson.id, lesson.xpReward);
        setShowComplete(true);
      } else {
        setSelected(null);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  const getOptionState = (option: string): OptionState => {
    if (!selected) return 'default';
    if (option === char.char) return 'correct';
    if (option === selected) return 'wrong';
    return 'dimmed';
  };

  const optionColors: Record<OptionState, { bg: string; border: string; text: string }> = {
    default: { bg: Colors.surface2, border: Colors.border1, text: Colors.text },
    correct: { bg: Colors.mintMuted, border: 'rgba(91, 255, 206, 0.4)', text: Colors.mint },
    wrong: { bg: Colors.primaryMuted, border: 'rgba(255, 107, 107, 0.4)', text: Colors.primary },
    dimmed: { bg: Colors.surface0, border: Colors.border0, text: Colors.textDim },
  };

  const handleFinish = () => {
    router.back();
  };

  // Completion screen
  if (showComplete) {
    return (
      <ScreenContainer>
        <View style={styles.completeContainer}>
          <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.completeEmoji}>
            <Text style={{ fontSize: 64 }}>
              {correctCount === lesson.characters.length ? '🎉' : '💪'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(500)}>
            <Text style={styles.completeTitle}>おめでとう!</Text>
            <Text style={styles.completeSubtitle}>축하합니다!</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(500)}>
            <GlassCard depth={2} style={styles.completeCard}>
              <Text style={styles.completeLessonName}>{lesson.title} 완료</Text>
              <View style={styles.completeStats}>
                <View style={styles.completeStat}>
                  <Text style={styles.completeStatValue}>{lesson.characters.length}</Text>
                  <Text style={styles.completeStatLabel}>문제</Text>
                </View>
                <View style={styles.completeStatDivider} />
                <View style={styles.completeStat}>
                  <Text style={[styles.completeStatValue, { color: Colors.mint }]}>
                    {correctCount}
                  </Text>
                  <Text style={styles.completeStatLabel}>정답</Text>
                </View>
                <View style={styles.completeStatDivider} />
                <View style={styles.completeStat}>
                  <Text style={[styles.completeStatValue, { color: Colors.amber }]}>
                    {isAlreadyCompleted ? 0 : lesson.xpReward}
                  </Text>
                  <Text style={styles.completeStatLabel}>XP 획득</Text>
                </View>
              </View>
              {isAlreadyCompleted && (
                <Text style={styles.alreadyCompleted}>이미 완료한 레슨입니다</Text>
              )}
            </GlassCard>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(500)}
            style={styles.completeActions}
          >
            <Pressable
              onPress={handleFinish}
              style={({ pressed }) => [styles.finishBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.finishText}>돌아가기</Text>
              <Text style={styles.finishTextJa}>もどる</Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.textSub} />
        </Pressable>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.progressText}>
          {currentIndex + 1}/{lesson.characters.length}
        </Text>
      </View>

      {/* Question area */}
      <View style={styles.questionArea}>
        <Animated.View
          key={currentIndex}
          entering={FadeIn.duration(300)}
          style={styles.questionContent}
        >
          <Text style={styles.questionLabel}>다음 로마자에 해당하는 히라가나를 고르세요</Text>

          {/* Romaji prompt */}
          <View style={styles.romajiPrompt}>
            <Text style={styles.romajiText}>{char.romaji}</Text>
          </View>

          {/* Example hint — 선택 후에만 표시 */}
          {selected && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={styles.exampleHint}>
                예시: {char.exampleWord} ({char.exampleRomaji}) = {char.meaning}
              </Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Feedback after select */}
      {selected && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.feedbackRow}>
          {selected === char.char ? (
            <>
              <Ionicons name="checkmark-circle" size={22} color={Colors.mint} />
              <Text style={[styles.feedbackText, { color: Colors.mint }]}>
                정답! {char.char} = {char.romaji}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="close-circle" size={22} color={Colors.primary} />
              <Text style={[styles.feedbackText, { color: Colors.primary }]}>
                정답은 {char.char}
              </Text>
            </>
          )}
        </Animated.View>
      )}

      {/* Options grid */}
      <View style={styles.optionsArea}>
        <Animated.View key={`opts-${currentIndex}`} entering={FadeInDown.duration(300)}>
          <View style={styles.optionsGrid}>
            {options.map((option, i) => {
              const state = getOptionState(option);
              const colors = optionColors[state];
              return (
                <Pressable
                  key={`${currentIndex}-${i}`}
                  onPress={() => handleSelect(option)}
                  disabled={!!selected}
                  style={({ pressed }) => [
                    styles.optionBtn,
                    { backgroundColor: colors.bg, borderColor: colors.border },
                    pressed && !selected && styles.btnPressed,
                  ]}
                >
                  <Text style={[styles.optionChar, { color: colors.text }]}>{option}</Text>
                  {state === 'correct' && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.mint} />
                  )}
                  {state === 'wrong' && (
                    <Ionicons name="close-circle" size={18} color={Colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSub,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surface1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },

  // Question
  questionArea: {
    flex: 1,
    justifyContent: 'center',
  },
  questionContent: {
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 15,
    color: Colors.textSub,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  romajiPrompt: {
    backgroundColor: Colors.primaryMuted,
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  romajiText: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 4,
  },
  exampleHint: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 20,
    textAlign: 'center',
  },

  // Feedback
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Options
  optionsArea: {
    paddingBottom: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionBtn: {
    width: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 22,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionChar: {
    fontSize: 36,
    fontWeight: '400',
  },
  btnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.97 }],
    opacity: 0.9,
  },

  // Completion screen
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  completeEmoji: {
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 16,
    color: Colors.textSub,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  completeCard: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 28,
  },
  completeLessonName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  completeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  completeStat: {
    alignItems: 'center',
  },
  completeStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  completeStatLabel: {
    fontSize: 12,
    color: Colors.textSub,
    marginTop: 4,
  },
  completeStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border1,
  },
  alreadyCompleted: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 12,
  },
  completeActions: {
    width: '100%',
    marginTop: 32,
  },
  finishBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  finishText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  finishTextJa: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 2,
  },
});
