import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Platform } from 'react-native';
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

export default function InputQuizScreen() {
  const { lessonsCompleted, recordPractice } = useUserStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // 입력 퀴즈는 히라가나→로마자 방향 고정 (타이핑으로 히라가나 입력은 어려우므로)
    setQuestions(generateQuizQuestions(lessonsCompleted, 10, 'hiragana-to-romaji'));
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
  const isCorrect = submitted && answer.trim().toLowerCase() === question.correctAnswer;

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    if (answer.trim().toLowerCase() === question.correctAnswer) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    const wasCorrect = answer.trim().toLowerCase() === question.correctAnswer;
    if (isLast) {
      const finalCorrect = wasCorrect ? correctCount : correctCount;
      recordPractice({
        mode: 'input',
        score: Math.round((finalCorrect / questions.length) * 100),
        correctCount: finalCorrect,
        totalCount: questions.length,
        timestamp: Date.now(),
      });
      setShowResult(true);
    } else {
      setAnswer('');
      setSubmitted(false);
      setCurrentIndex((i) => i + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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
            <Text style={styles.resultTitle}>입력 퀴즈 완료!</Text>
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
                setAnswer('');
                setSubmitted(false);
                setCorrectCount(0);
                setShowResult(false);
                setQuestions(generateQuizQuestions(lessonsCompleted, 10));
              }}
              style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
            >
              <Ionicons name="refresh" size={18} color={Colors.purple} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.purple }}>
                다시 풀기
              </Text>
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
        <Animated.View
          key={currentIndex}
          entering={FadeIn.duration(300)}
          style={styles.questionContent}
        >
          <Text style={styles.questionLabel}>이 히라가나의 발음을 로마자로 입력하세요</Text>
          <Text style={styles.questionChar}>{question.prompt}</Text>
        </Animated.View>
      </View>

      {/* Input area */}
      <View style={styles.inputArea}>
        {submitted && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.feedbackRow}>
            {isCorrect ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color={Colors.mint} />
                <Text style={[styles.feedbackText, { color: Colors.mint }]}>정답!</Text>
              </>
            ) : (
              <>
                <Ionicons name="close-circle" size={20} color={Colors.primary} />
                <Text style={[styles.feedbackText, { color: Colors.primary }]}>
                  오답 — 정답: {question.correctAnswer}
                </Text>
              </>
            )}
          </Animated.View>
        )}

        <TextInput
          ref={inputRef}
          style={[
            styles.textInput,
            submitted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
          ]}
          value={answer}
          onChangeText={setAnswer}
          placeholder="로마자 입력..."
          placeholderTextColor={Colors.textDim}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!submitted}
          onSubmitEditing={submitted ? handleNext : handleSubmit}
          returnKeyType={submitted ? 'next' : 'done'}
        />

        <Pressable
          onPress={submitted ? handleNext : handleSubmit}
          disabled={!answer.trim() && !submitted}
          style={({ pressed }) => [
            styles.submitBtn,
            answer.trim() && styles.submitBtnActive,
            submitted && styles.submitBtnNext,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.submitText}>
            {submitted ? (isLast ? '결과 보기' : '다음') : '확인'}
          </Text>
        </Pressable>
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
    backgroundColor: Colors.purple,
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
  },
  questionContent: {
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 16,
    color: Colors.textSub,
    textAlign: 'center',
    marginBottom: 20,
  },
  questionChar: {
    fontSize: 120,
    color: Colors.text,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 140,
  },

  // Input
  inputArea: {
    paddingBottom: 40,
    gap: 12,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: Colors.surface2,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 4,
  },
  inputCorrect: {
    borderColor: 'rgba(91, 255, 206, 0.4)',
    backgroundColor: Colors.mintMuted,
  },
  inputWrong: {
    borderColor: 'rgba(255, 107, 107, 0.4)',
    backgroundColor: Colors.primaryMuted,
  },
  submitBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
    alignItems: 'center',
  },
  submitBtnActive: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  submitBtnNext: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
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
    color: Colors.purple,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  resultCard: { width: '100%', paddingVertical: 24 },
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
  resultActions: { width: '100%', gap: 12, marginTop: 28 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.purpleMuted,
    borderWidth: 1,
    borderColor: 'rgba(179, 136, 255, 0.3)',
  },
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
