import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PracticeRecord } from '../constants/QuizUtils';
import HIRAGANA_LESSONS from '../constants/LessonData';
import KATAKANA_LESSONS from '../constants/KatakanaData';

const HIRAGANA_IDS = HIRAGANA_LESSONS.map((l) => l.id);
const KATAKANA_IDS = KATAKANA_LESSONS.map((l) => l.id);

function calculateLevel(lessonsCompleted: string[]): number {
  const hiraganaComplete = HIRAGANA_IDS.every((id) => lessonsCompleted.includes(id));
  const katakanaComplete = KATAKANA_IDS.every((id) => lessonsCompleted.includes(id));
  // Lv.0: 온보딩 완료 (기본)
  // Lv.1: 히라가나 전체 완료
  // Lv.2: 카타카나 전체 완료
  if (katakanaComplete) return 2;
  if (hiraganaComplete) return 1;
  return 0;
}

export type UserProfile = {
  id: string;
  displayName: string;
  birthdate: string | null;
  gender: 'male' | 'female' | 'other' | null;
  email: string | null;
  phone: string | null;
};

type UserState = {
  // Auth
  isLoading: boolean;
  hasCompletedOnboarding: boolean;

  // Profile
  profile: UserProfile | null;

  // Progress
  currentLevel: number;
  xp: number;
  streak: number;
  lessonsCompleted: string[];

  // Practice
  practiceHistory: PracticeRecord[];
  flashcardResults: Record<string, 'knew' | 'didnt'>;

  // Actions
  setLoading: (loading: boolean) => void;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  updateProgress: (
    updates: Partial<Pick<UserState, 'currentLevel' | 'xp' | 'streak' | 'lessonsCompleted'>>
  ) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  recordPractice: (record: PracticeRecord) => void;
  recordFlashcardResult: (charKey: string, result: 'knew' | 'didnt') => void;
  levelUp: () => void;
  reset: () => void;
};

const initialState = {
  isLoading: true,
  hasCompletedOnboarding: false,
  profile: null,
  currentLevel: 0,
  xp: 0,
  streak: 0,
  lessonsCompleted: [] as string[],
  practiceHistory: [] as PracticeRecord[],
  flashcardResults: {} as Record<string, 'knew' | 'didnt'>,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setLoading: (isLoading) => set({ isLoading }),

      setProfile: (profile) => set({ profile }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
          currentLevel: 0,
        }),

      updateProgress: (updates) => set((state) => ({ ...state, ...updates })),

      completeLesson: (lessonId, xpReward) =>
        set((state) => {
          if (state.lessonsCompleted.includes(lessonId)) return state;
          const newCompleted = [...state.lessonsCompleted, lessonId];
          const newLevel = calculateLevel(newCompleted);
          return {
            lessonsCompleted: newCompleted,
            xp: state.xp + xpReward,
            currentLevel: Math.max(state.currentLevel, newLevel),
          };
        }),

      recordPractice: (record) =>
        set((state) => {
          const history = [...state.practiceHistory, record].slice(-100);
          const xpGain = Math.round((record.correctCount / Math.max(record.totalCount, 1)) * 10);
          return {
            practiceHistory: history,
            xp: state.xp + xpGain,
          };
        }),

      recordFlashcardResult: (charKey, result) =>
        set((state) => ({
          flashcardResults: { ...state.flashcardResults, [charKey]: result },
        })),

      levelUp: () =>
        set((state) => ({
          currentLevel: state.currentLevel + 1,
        })),

      reset: () => set({ ...initialState, isLoading: false }),
    }),
    {
      name: 'tabitomo-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        profile: state.profile,
        currentLevel: state.currentLevel,
        xp: state.xp,
        streak: state.streak,
        lessonsCompleted: state.lessonsCompleted,
        practiceHistory: state.practiceHistory,
        flashcardResults: state.flashcardResults,
      }),
    }
  )
);
