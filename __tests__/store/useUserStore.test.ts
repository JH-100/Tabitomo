import { useUserStore } from '../../store/useUserStore';
import type { PracticeRecord } from '../../constants/QuizUtils';

// Reset the store before each test
beforeEach(() => {
  useUserStore.getState().reset();
});

describe('useUserStore', () => {
  describe('initial state (after reset)', () => {
    it('has correct default values', () => {
      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false); // reset sets isLoading to false
      expect(state.hasCompletedOnboarding).toBe(false);
      expect(state.profile).toBeNull();
      expect(state.currentLevel).toBe(0);
      expect(state.xp).toBe(0);
      expect(state.streak).toBe(0);
      expect(state.lessonsCompleted).toEqual([]);
      expect(state.practiceHistory).toEqual([]);
      expect(state.flashcardResults).toEqual({});
    });
  });

  describe('setProfile', () => {
    it('sets the user profile', () => {
      const profile = {
        id: 'user-1',
        displayName: 'Tester',
        birthdate: '2000-01-01',
        gender: 'other' as const,
        email: 'test@example.com',
        phone: null,
      };
      useUserStore.getState().setProfile(profile);
      expect(useUserStore.getState().profile).toEqual(profile);
    });
  });

  describe('completeOnboarding', () => {
    it('sets hasCompletedOnboarding to true and currentLevel to 0', () => {
      useUserStore.getState().completeOnboarding();
      const state = useUserStore.getState();
      expect(state.hasCompletedOnboarding).toBe(true);
      expect(state.currentLevel).toBe(0);
    });
  });

  describe('completeLesson', () => {
    it('adds a lesson to lessonsCompleted and increases xp', () => {
      useUserStore.getState().completeLesson('hiragana-a', 20);
      const state = useUserStore.getState();
      expect(state.lessonsCompleted).toContain('hiragana-a');
      expect(state.xp).toBe(20);
    });

    it('does not add duplicate lessons', () => {
      useUserStore.getState().completeLesson('hiragana-a', 20);
      useUserStore.getState().completeLesson('hiragana-a', 20);
      const state = useUserStore.getState();
      expect(state.lessonsCompleted).toEqual(['hiragana-a']);
      expect(state.xp).toBe(20); // XP only awarded once
    });

    it('accumulates xp across different lessons', () => {
      useUserStore.getState().completeLesson('hiragana-a', 20);
      useUserStore.getState().completeLesson('hiragana-ka', 25);
      expect(useUserStore.getState().xp).toBe(45);
    });
  });

  describe('recordPractice', () => {
    it('adds a practice record and awards xp', () => {
      const record: PracticeRecord = {
        mode: 'quiz',
        score: 80,
        correctCount: 8,
        totalCount: 10,
        timestamp: Date.now(),
      };
      useUserStore.getState().recordPractice(record);
      const state = useUserStore.getState();
      expect(state.practiceHistory).toHaveLength(1);
      expect(state.practiceHistory[0]).toEqual(record);
      // xp = round(8/10 * 10) = 8
      expect(state.xp).toBe(8);
    });

    it('keeps at most 100 practice records', () => {
      for (let i = 0; i < 105; i++) {
        useUserStore.getState().recordPractice({
          mode: 'quiz',
          score: 50,
          correctCount: 5,
          totalCount: 10,
          timestamp: i,
        });
      }
      expect(useUserStore.getState().practiceHistory).toHaveLength(100);
    });
  });

  describe('reset', () => {
    it('resets all state to initial values with isLoading false', () => {
      // Modify state first
      useUserStore.getState().completeOnboarding();
      useUserStore.getState().completeLesson('hiragana-a', 20);
      useUserStore.getState().recordPractice({
        mode: 'quiz',
        score: 100,
        correctCount: 10,
        totalCount: 10,
        timestamp: Date.now(),
      });

      // Reset
      useUserStore.getState().reset();

      const state = useUserStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.hasCompletedOnboarding).toBe(false);
      expect(state.profile).toBeNull();
      expect(state.currentLevel).toBe(0);
      expect(state.xp).toBe(0);
      expect(state.lessonsCompleted).toEqual([]);
      expect(state.practiceHistory).toEqual([]);
    });
  });
});
