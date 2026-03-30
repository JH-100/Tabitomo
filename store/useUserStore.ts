import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Actions
  setLoading: (loading: boolean) => void;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => void;
  updateProgress: (updates: Partial<Pick<UserState, 'currentLevel' | 'xp' | 'streak' | 'lessonsCompleted'>>) => void;
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
  lessonsCompleted: [],
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setLoading: (isLoading) => set({ isLoading }),

      setProfile: (profile) => set({ profile }),

      completeOnboarding: () => set({
        hasCompletedOnboarding: true,
        currentLevel: 0,
      }),

      updateProgress: (updates) => set((state) => ({ ...state, ...updates })),

      levelUp: () => set((state) => ({
        currentLevel: state.currentLevel + 1,
      })),

      reset: () => set(initialState),
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
      }),
    }
  )
);
