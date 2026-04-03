import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type PracticeMode = {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: IoniconsName;
  color: string;
  colorMuted: string;
  route: string;
};

const MODES: PracticeMode[] = [
  {
    id: 'quiz',
    title: '4지선다 퀴즈',
    titleJa: '四択クイズ',
    description: '히라가나를 보고 정답을 골라보세요',
    icon: 'help-circle',
    color: Colors.blue,
    colorMuted: Colors.blueMuted,
    route: '/practice/quiz',
  },
  {
    id: 'input',
    title: '직접 입력 퀴즈',
    titleJa: '入力クイズ',
    description: '히라가나를 보고 로마자를 직접 입력하세요',
    icon: 'create',
    color: Colors.purple,
    colorMuted: Colors.purpleMuted,
    route: '/practice/input',
  },
  {
    id: 'matching',
    title: '매칭 게임',
    titleJa: 'マッチングゲーム',
    description: '히라가나와 로마자 쌍을 맞춰보세요',
    icon: 'grid',
    color: Colors.amber,
    colorMuted: Colors.amberMuted,
    route: '/practice/matching',
  },
  {
    id: 'handwriting',
    title: '필기 연습',
    titleJa: '書き取り練習',
    description: '히라가나를 직접 따라 그려보세요',
    icon: 'brush',
    color: Colors.mint,
    colorMuted: Colors.mintMuted,
    route: '/practice/handwriting',
  },
];

export default function PracticeScreen() {
  const { lessonsCompleted } = useUserStore();
  const hasLessons = lessonsCompleted.length > 0;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.title}>練習</Text>
          <Text style={styles.sub}>Practice</Text>
        </Animated.View>

        {!hasLessons && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <GlassCard depth={1} style={styles.lockCard}>
              <Ionicons name="lock-closed" size={24} color={Colors.textMuted} />
              <Text style={styles.lockText}>
                레슨을 최소 1개 완료하면{'\n'}연습 모드를 사용할 수 있습니다
              </Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* Mode cards */}
        {MODES.map((mode, index) => (
          <Animated.View key={mode.id} entering={FadeInDown.delay(200 + index * 100).duration(500)}>
            <GlassCard
              depth={hasLessons ? 2 : 0}
              style={[styles.modeCard, !hasLessons && styles.modeCardLocked]}
              onPress={hasLessons ? () => router.push(mode.route as any) : undefined}
            >
              <View style={styles.modeRow}>
                <View
                  style={[
                    styles.modeIcon,
                    { backgroundColor: hasLessons ? mode.colorMuted : Colors.surface0 },
                  ]}
                >
                  <Ionicons
                    name={hasLessons ? mode.icon : 'lock-closed'}
                    size={24}
                    color={hasLessons ? mode.color : Colors.textDim}
                  />
                </View>
                <View style={styles.modeContent}>
                  <View style={styles.modeTitleRow}>
                    <Text style={[styles.modeTitle, !hasLessons && styles.textLocked]}>
                      {mode.title}
                    </Text>
                    <Text style={[styles.modeTitleJa, !hasLessons && styles.textLocked]}>
                      {mode.titleJa}
                    </Text>
                  </View>
                  <Text style={[styles.modeDesc, !hasLessons && styles.textLocked]}>
                    {mode.description}
                  </Text>
                </View>
                {hasLessons && (
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                )}
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 14,
    color: Colors.textSub,
    marginTop: 4,
  },

  lockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  lockText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  modeCard: {
    marginBottom: 12,
  },
  modeCardLocked: {
    opacity: 0.4,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  modeIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeContent: {
    flex: 1,
    gap: 4,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modeTitleJa: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  modeDesc: {
    fontSize: 12,
    color: Colors.textSub,
  },
  textLocked: {
    color: Colors.textDim,
  },
});
