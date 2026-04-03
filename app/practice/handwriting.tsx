import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import DrawingCanvas from '../../components/DrawingCanvas';
import Colors from '../../constants/Colors';
import HIRAGANA_LESSONS from '../../constants/LessonData';
import { useUserStore } from '../../store/useUserStore';

export default function HandwritingScreen() {
  const { lessonsCompleted } = useUserStore();
  const { width: screenWidth } = useWindowDimensions();
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const allChars = HIRAGANA_LESSONS.filter((l) => lessonsCompleted.includes(l.id)).flatMap(
    (l) => l.characters
  );

  if (allChars.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>학습한 글자가 없습니다</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>돌아가기</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const char = allChars[currentCharIndex];
  const canvasSize = Math.min(screenWidth - 80, 320);

  const handleClear = () => {
    setCanvasKey((k) => k + 1);
  };

  const handleNext = () => {
    const nextIndex = (currentCharIndex + 1) % allChars.length;
    setCurrentCharIndex(nextIndex);
    setCanvasKey((k) => k + 1);
  };

  const handlePrev = () => {
    const prevIndex = (currentCharIndex - 1 + allChars.length) % allChars.length;
    setCurrentCharIndex(prevIndex);
    setCanvasKey((k) => k + 1);
  };

  return (
    <ScreenContainer>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textSub} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={styles.counterText}>
          {currentCharIndex + 1} / {allChars.length}
        </Text>
      </View>

      {/* Character selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {allChars.map((c, i) => (
          <Pressable
            key={i}
            onPress={() => {
              setCurrentCharIndex(i);
              setCanvasKey((k) => k + 1);
            }}
            style={[styles.chip, i === currentCharIndex && styles.chipActive]}
          >
            <Text style={[styles.chipText, i === currentCharIndex && styles.chipTextActive]}>
              {c.char}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Current char info */}
      <View style={styles.charInfo}>
        <Text style={styles.charDisplay}>{char.char}</Text>
        <Text style={styles.charRomaji}>{char.romaji}</Text>
      </View>

      {/* Drawing canvas */}
      <View style={styles.canvasArea}>
        <DrawingCanvas
          key={canvasKey}
          referenceChar={char.char}
          width={canvasSize}
          height={canvasSize}
        />
      </View>

      {/* Toolbar */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.toolbar}>
        <Pressable
          onPress={handlePrev}
          style={({ pressed }) => [styles.toolBtn, pressed && styles.btnPressed]}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textSub} />
        </Pressable>

        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [styles.toolBtn, styles.clearBtn, pressed && styles.btnPressed]}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.primary} />
          <Text style={styles.clearText}>지우기</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.toolBtn, styles.nextBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.nextText}>다음 글자</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.mint} />
        </Pressable>
      </Animated.View>
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
  counterText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Chip selector
  chipScroll: {
    paddingVertical: 8,
    gap: 6,
  },
  chip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Char info
  charInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  charDisplay: {
    fontSize: 36,
    color: Colors.text,
    fontWeight: '300',
  },
  charRomaji: {
    fontSize: 20,
    color: Colors.textSub,
    fontWeight: '600',
    letterSpacing: 2,
  },

  // Canvas
  canvasArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 20,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  clearBtn: {
    backgroundColor: Colors.primaryMuted,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  nextBtn: {
    flex: 1,
    backgroundColor: Colors.mintMuted,
    borderColor: 'rgba(91, 255, 206, 0.2)',
  },
  nextText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.mint,
  },
  btnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.97 }],
    opacity: 0.9,
  },
});
