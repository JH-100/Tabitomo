import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';
import {
  generateQuizQuestions,
  calculateXpReward,
  type QuizQuestion,
} from '../../constants/QuizUtils';
import { useUserStore } from '../../store/useUserStore';

type OptionState = 'default' | 'correct' | 'wrong' | 'dimmed';

export default function QuizScreen() {
  const { lessonsCompleted, recordPractice } = useUserStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const q = generateQuizQuestions(lessonsCompleted, 10);
    setQuestions(q);
  }, []);

  if (questions.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>퀴즈를 생성할 수 없습니다</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>돌아가기</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const isLast = currentIndex === questions.length - 1;

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === question.correctAnswer;
    if (isCorrect) setCorrectCount((c) => c + 1);

    setTimeout(() => {
      if (isLast) {
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        recordPractice({
          mode: 'quiz',
          score: Math.round((finalCorrect / questions.length) * 100),
          correctCount: finalCorrect,
          totalCount: questions.length,
          timestamp: Date.now(),
        });
        setShowResult(true);
      } else {
        setSelected(null);
        setCurrentIndex((i) => i + 1);
      }
    }, 800);
  };

  const getOptionState = (option: string): OptionState => {
    if (!selected) return 'default';
    if (option === question.correctAnswer) return 'correct';
    if (option === selected) return 'wrong';
    return 'dimmed';
  };

  const optionColors: Record<OptionState, { bg: string; border: string; text: string }> = {
    default: { bg: Colors.surface2, border: Colors.border1, text: Colors.text },
    correct: { bg: Colors.mintMuted, border: 'rgba(91, 255, 206, 0.4)', text: Colors.mint },
    wrong: { bg: Colors.primaryMuted, border: 'rgba(255, 107, 107, 0.4)', text: Colors.primary },
    dimmed: { bg: Colors.surface0, border: Colors.border0, text: Colors.textDim },
  };

  // Result screen
  if (showResult) {
    const score = Math.round((correctCount / questions.length) * 100);
    const xp = calculateXpReward(correctCount, questions.length);
    return (
      <ScreenContainer>
        <View style={styles.resultContainer}>
          <Animated.View entering={ZoomIn.duration(600).springify()}>
            <Text style={{ fontSize: 64, textAlign: 'center' }}>
              {score >= 80 ? '🎉' : score >= 50 ? '💪' : '📖'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Text style={styles.resultTitle}>퀴즈 완료!</Text>
            <Text style={styles.resultScore}>{score}점</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <GlassCard depth={2} style={styles.resultCard}>
              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Text style={[styles.resultStatVal, { color: Colors.mint }]}>{correctCount}</Text>
                  <Text style={styles.resultStatLabel}>정답</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultStat}>
                  <Text style={[styles.resultStatVal, { color: Colors.primary }]}>
                    {questions.length - correctCount}
                  </Text>
                  <Text style={styles.resultStatLabel}>오답</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultStat}>
                  <Text style={[styles.resultStatVal, { color: Colors.amber }]}>+{xp}</Text>
                  <Text style={styles.resultStatLabel}>XP</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).duration(500)}
            style={styles.resultActions}
          >
            <Pressable
              onPress={() => {
                setCurrentIndex(0);
                setSelected(null);
                setCorrectCount(0);
                setShowResult(false);
                setQuestions(generateQuizQuestions(lessonsCompleted, 10));
              }}
              style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
            >
              <Ionicons name="refresh" size={18} color={Colors.blue} />
              <Text style={[styles.retryText, { color: Colors.blue }]}>다시 풀기</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.doneBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.doneText}>돌아가기</Text>
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
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textSub} />
        </Pressable>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionArea}>
        <Animated.View key={currentIndex} entering={FadeIn.duration(300)}>
          <Text style={styles.questionLabel}>
            {question.direction === 'romaji-to-hiragana'
              ? '이 발음에 해당하는 히라가나는?'
              : '이 히라가나의 발음은?'}
          </Text>
          <Text
            style={[
              styles.questionChar,
              question.direction === 'hiragana-to-romaji' && styles.questionCharHiragana,
            ]}
          >
            {question.prompt}
          </Text>
        </Animated.View>
      </View>

      {/* Options */}
      <View style={styles.optionsArea}>
        <Animated.View key={`opts-${currentIndex}`} entering={FadeInDown.duration(300)}>
          <View style={styles.optionsGrid}>
            {question.options.map((option, i) => {
              const state = getOptionState(option);
              const colors = optionColors[state];
              const isHiraganaOption = question.direction === 'romaji-to-hiragana';
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
                  <Text
                    style={[
                      isHiraganaOption ? styles.optionCharText : styles.optionText,
                      { color: colors.text },
                    ]}
                  >
                    {option}
                  </Text>
                  {state === 'correct' && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
                  )}
                  {state === 'wrong' && (
                    <Ionicons name="close-circle" size={20} color={Colors.primary} />
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.textSub },
  backLink: { marginTop: 16, padding: 12 },
  backLinkText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surface1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surface1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.blue,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },

  // Question
  questionArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 16,
    color: Colors.textSub,
    textAlign: 'center',
    marginBottom: 20,
  },
  questionChar: {
    fontSize: 56,
    color: Colors.primary,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 4,
  },
  questionCharHiragana: {
    fontSize: 120,
    color: Colors.text,
    fontWeight: '300',
    letterSpacing: 0,
    lineHeight: 140,
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
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 20,
    fontWeight: '700',
  },
  optionCharText: {
    fontSize: 36,
    fontWeight: '400',
  },
  btnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.97 }],
    opacity: 0.9,
  },

  // Result
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.blue,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  resultCard: {
    width: '100%',
    paddingVertical: 24,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  resultStat: { alignItems: 'center' },
  resultStatVal: { fontSize: 28, fontWeight: '800' },
  resultStatLabel: { fontSize: 12, color: Colors.textSub, marginTop: 4 },
  resultDivider: { width: 1, height: 36, backgroundColor: Colors.border1 },
  resultActions: {
    width: '100%',
    gap: 12,
    marginTop: 28,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.blueMuted,
    borderWidth: 1,
    borderColor: 'rgba(108, 159, 255, 0.3)',
  },
  retryText: { fontSize: 16, fontWeight: '700' },
  doneBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
    alignItems: 'center',
  },
  doneText: { fontSize: 16, fontWeight: '700', color: Colors.textSub },
});
