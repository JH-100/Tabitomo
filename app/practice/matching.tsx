import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';
import {
  generateMatchingPairs,
  calculateXpReward,
  type MatchingPair,
} from '../../constants/QuizUtils';
import { useUserStore } from '../../store/useUserStore';

type Card = {
  id: string;
  display: string;
  pairId: string;
  type: 'char' | 'romaji';
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildCards(pairs: MatchingPair[]): Card[] {
  const cards: Card[] = [];
  pairs.forEach((p, i) => {
    cards.push({ id: `char-${i}`, display: p.char, pairId: `pair-${i}`, type: 'char' });
    cards.push({ id: `romaji-${i}`, display: p.romaji, pairId: `pair-${i}`, type: 'romaji' });
  });
  return shuffleArray(cards);
}

function MatchCard({
  card,
  state,
  onPress,
}: {
  card: Card;
  state: 'hidden' | 'selected' | 'matched' | 'wrong';
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const bgColor =
    state === 'matched'
      ? Colors.mintMuted
      : state === 'selected'
        ? Colors.surface3
        : state === 'wrong'
          ? Colors.primaryMuted
          : Colors.surface1;
  const borderColor =
    state === 'matched'
      ? 'rgba(91, 255, 206, 0.4)'
      : state === 'selected'
        ? Colors.border2
        : state === 'wrong'
          ? 'rgba(255, 107, 107, 0.4)'
          : Colors.border0;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (state === 'matched') {
      scale.value = withTiming(1.05, { duration: 150 }, () => {
        scale.value = withTiming(1, { duration: 150 });
      });
    } else if (state === 'wrong') {
      scale.value = withTiming(0.95, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
    }
  }, [state]);

  const isRevealed = state !== 'hidden';

  return (
    <Pressable onPress={onPress} disabled={state === 'matched'}>
      <Animated.View style={[styles.card, { backgroundColor: bgColor, borderColor }, animStyle]}>
        {isRevealed ? (
          <Text
            style={[
              styles.cardText,
              card.type === 'char' && styles.cardTextChar,
              state === 'matched' && { color: Colors.mint },
            ]}
          >
            {card.display}
          </Text>
        ) : (
          <Text style={styles.cardHidden}>?</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function MatchingScreen() {
  const { lessonsCompleted, recordPractice } = useUserStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [pairCount, setPairCount] = useState(0);

  useEffect(() => {
    const pairs = generateMatchingPairs(lessonsCompleted, 5);
    setPairCount(pairs.length);
    setCards(buildCards(pairs));
  }, []);

  if (cards.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>카드를 생성할 수 없습니다</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleCardPress = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId)!;
    if (matched.has(card.pairId)) return;

    if (!selected) {
      setSelected(cardId);
      setWrongPair(new Set());
    } else {
      const firstCard = cards.find((c) => c.id === selected)!;
      setMoves((m) => m + 1);

      if (firstCard.pairId === card.pairId && firstCard.id !== card.id) {
        // Match!
        setMatched((prev) => new Set([...prev, card.pairId]));
        setSelected(null);

        const newMatchedCount = matched.size + 1;
        if (newMatchedCount === pairCount) {
          setTimeout(() => {
            const totalMoves = moves + 1;
            const efficiency = Math.max(0, Math.round((pairCount / totalMoves) * 100));
            recordPractice({
              mode: 'matching',
              score: efficiency,
              correctCount: pairCount,
              totalCount: totalMoves,
              timestamp: Date.now(),
            });
            setShowResult(true);
          }, 500);
        }
      } else {
        // No match
        setWrongPair(new Set([selected, cardId]));
        setTimeout(() => {
          setWrongPair(new Set());
          setSelected(null);
        }, 600);
      }
    }
  };

  const getCardState = (card: Card): 'hidden' | 'selected' | 'matched' | 'wrong' => {
    if (matched.has(card.pairId)) return 'matched';
    if (wrongPair.has(card.id)) return 'wrong';
    if (card.id === selected) return 'selected';
    return 'hidden';
  };

  // Result
  if (showResult) {
    const efficiency = Math.max(0, Math.round((pairCount / moves) * 100));
    const xp = calculateXpReward(pairCount, Math.max(pairCount, moves));
    return (
      <ScreenContainer>
        <View style={styles.resultContainer}>
          <Animated.View entering={ZoomIn.duration(600).springify()}>
            <Text style={{ fontSize: 64, textAlign: 'center' }}>
              {efficiency >= 80 ? '🎉' : '👏'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <Text style={styles.resultTitle}>매칭 완료!</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).duration(500)}>
            <GlassCard depth={2} style={styles.resultCard}>
              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Text style={[styles.resultStatVal, { color: Colors.mint }]}>{pairCount}</Text>
                  <Text style={styles.resultStatLabel}>쌍 매칭</Text>
                </View>
                <View style={styles.resultDivider} />
                <View style={styles.resultStat}>
                  <Text style={[styles.resultStatVal, { color: Colors.blue }]}>{moves}</Text>
                  <Text style={styles.resultStatLabel}>시도 횟수</Text>
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
                const pairs = generateMatchingPairs(lessonsCompleted, 5);
                setPairCount(pairs.length);
                setCards(buildCards(pairs));
                setSelected(null);
                setMatched(new Set());
                setWrongPair(new Set());
                setMoves(0);
                setShowResult(false);
              }}
              style={({ pressed }) => [styles.retryBtn, pressed && styles.btnPressed]}
            >
              <Ionicons name="refresh" size={18} color={Colors.amber} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.amber }}>
                다시 하기
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
        <View style={{ flex: 1 }} />
        <Text style={styles.movesText}>시도: {moves}</Text>
      </View>

      <Text style={styles.instruction}>히라가나와 로마자 쌍을 맞춰보세요</Text>

      {/* Card grid */}
      <View style={styles.gridContainer}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.grid}>
          {cards.map((card) => (
            <MatchCard
              key={card.id}
              card={card}
              state={getCardState(card)}
              onPress={() => handleCardPress(card.id)}
            />
          ))}
        </Animated.View>
      </View>

      <View style={styles.matchedCount}>
        <Text style={styles.matchedText}>
          {matched.size} / {pairCount} 매칭 완료
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.textSub },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surface1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movesText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSub,
  },

  instruction: {
    fontSize: 15,
    color: Colors.textSub,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Grid
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  card: {
    width: 72,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  cardTextChar: {
    fontSize: 28,
    fontWeight: '400',
  },
  cardHidden: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textDim,
  },

  matchedCount: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  matchedText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
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
    backgroundColor: Colors.amberMuted,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.3)',
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
  btnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.97 }],
    opacity: 0.9,
  },
});
