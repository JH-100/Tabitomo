import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import Colors from '../../constants/Colors';

type Page = {
  emoji: string;
  title: string;
  titleJa: string;
  description: string;
};

const PAGES: Page[] = [
  {
    emoji: '🗾',
    title: 'タビトモ',
    titleJa: '旅友',
    description: '일본어를 배우는\n가장 즐거운 방법',
  },
  {
    emoji: '✈️',
    title: '일본을 여행하며\n배우세요',
    titleJa: '旅しながら学ぼう',
    description: '회화 실력이 올라가면\n새로운 도시가 열립니다',
  },
  {
    emoji: '🎌',
    title: '여행을 시작할\n준비가 되셨나요?',
    titleJa: '旅の準備はできましたか？',
    description: '여권을 만들고\n첫 번째 여행을 떠나보세요',
  },
];

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    if (page >= 0 && page < PAGES.length) {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollRef.current?.scrollTo({ x: nextPage * width, animated: true });
    } else {
      router.replace('/(onboarding)/passport');
    }
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/passport');
  };

  return (
    <ScreenContainer>
      {/* Skip button */}
      <Animated.View entering={FadeIn.delay(800)} style={styles.skipWrap}>
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </Pressable>
      </Animated.View>

      {/* Pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={[styles.scrollView, { marginHorizontal: -20 }]}
      >
        {PAGES.map((page, index) => (
          <View key={index} style={[styles.page, { width }]}>
            <View style={styles.pageContent}>
              {/* Emoji */}
              <Animated.View
                entering={ZoomIn.delay(300).duration(600).springify()}
                style={styles.emojiWrap}
              >
                <Text style={styles.emoji}>{page.emoji}</Text>
              </Animated.View>

              {/* Glow ring behind emoji */}
              <View style={styles.glowRing} />

              {/* Title */}
              <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                <Text style={styles.title}>{page.title}</Text>
                <Text style={styles.titleJa}>{page.titleJa}</Text>
              </Animated.View>

              {/* Description */}
              <Animated.View entering={FadeInDown.delay(700).duration(600)}>
                <Text style={styles.description}>{page.description}</Text>
              </Animated.View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom area: dots + button */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.bottomArea}>
        {/* Page indicator dots */}
        <View style={styles.dots}>
          {PAGES.map((_, index) => (
            <View key={index} style={[styles.dot, currentPage === index && styles.dotActive]} />
          ))}
        </View>

        {/* Next / Start button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextBtn,
            currentPage === PAGES.length - 1 && styles.nextBtnFinal,
            pressed && styles.nextBtnPressed,
          ]}
        >
          <Text style={styles.nextText}>
            {currentPage === PAGES.length - 1 ? '시작하기' : '다음'}
          </Text>
          <Text style={[styles.nextTextJa, currentPage !== PAGES.length - 1 && { opacity: 0 }]}>
            はじめましょう
          </Text>
        </Pressable>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  skipWrap: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emojiWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    zIndex: 1,
  },
  emoji: {
    fontSize: 56,
  },
  glowRing: {
    position: 'absolute',
    top: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryGlow,
    opacity: 0.3,
    alignSelf: 'center',
    marginTop: -20,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  titleJa: {
    fontSize: 14,
    color: Colors.amber,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
  },
  description: {
    fontSize: 16,
    color: Colors.textSub,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 20,
  },

  bottomArea: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surface3,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },

  nextBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
  },
  nextBtnFinal: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  nextBtnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.98 }],
    opacity: 0.9,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  nextTextJa: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 2,
  },
});
