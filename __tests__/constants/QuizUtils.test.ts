import {
  generateQuizQuestions,
  generateMatchingPairs,
  calculateXpReward,
} from '../../constants/QuizUtils';

describe('generateQuizQuestions', () => {
  const lessonIds = ['hiragana-a', 'hiragana-ka'];

  it('returns the requested number of questions', () => {
    const questions = generateQuizQuestions(lessonIds, 5);
    expect(questions).toHaveLength(5);
  });

  it('defaults to 10 questions when count is not specified', () => {
    const questions = generateQuizQuestions(lessonIds);
    expect(questions).toHaveLength(10);
  });

  it('each question has exactly 4 options', () => {
    const questions = generateQuizQuestions(lessonIds, 5);
    questions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('correct answer is always included in options', () => {
    const questions = generateQuizQuestions(lessonIds, 5);
    questions.forEach((q) => {
      expect(q.options).toContain(q.correctAnswer);
    });
  });

  it('each question has a valid direction', () => {
    const questions = generateQuizQuestions(lessonIds, 5);
    questions.forEach((q) => {
      expect(['romaji-to-hiragana', 'hiragana-to-romaji']).toContain(q.direction);
    });
  });

  it('respects forced direction parameter', () => {
    const questions = generateQuizQuestions(lessonIds, 5, 'romaji-to-hiragana');
    questions.forEach((q) => {
      expect(q.direction).toBe('romaji-to-hiragana');
    });
  });

  it('returns empty array for unknown lesson IDs', () => {
    const questions = generateQuizQuestions(['nonexistent'], 5);
    expect(questions).toHaveLength(0);
  });

  it('caps at available characters when requesting more than available', () => {
    // hiragana-a has 5 chars, hiragana-ka has 5 chars = 10 total
    const questions = generateQuizQuestions(lessonIds, 20);
    expect(questions.length).toBeLessThanOrEqual(10);
  });
});

describe('generateMatchingPairs', () => {
  const lessonIds = ['hiragana-a', 'hiragana-ka'];

  it('returns the requested number of pairs', () => {
    const pairs = generateMatchingPairs(lessonIds, 3);
    expect(pairs).toHaveLength(3);
  });

  it('defaults to 5 pairs when count is not specified', () => {
    const pairs = generateMatchingPairs(lessonIds);
    expect(pairs).toHaveLength(5);
  });

  it('each pair has char and romaji properties', () => {
    const pairs = generateMatchingPairs(lessonIds, 3);
    pairs.forEach((p) => {
      expect(p).toHaveProperty('char');
      expect(p).toHaveProperty('romaji');
      expect(p.char.length).toBeGreaterThan(0);
      expect(p.romaji.length).toBeGreaterThan(0);
    });
  });

  it('returns no duplicate characters', () => {
    const pairs = generateMatchingPairs(lessonIds, 5);
    const chars = pairs.map((p) => p.char);
    const uniqueChars = new Set(chars);
    expect(uniqueChars.size).toBe(chars.length);
  });
});

describe('calculateXpReward', () => {
  it('returns 0 for 0 correct answers', () => {
    expect(calculateXpReward(0, 10)).toBe(0);
  });

  it('returns 10 for a perfect score', () => {
    expect(calculateXpReward(10, 10)).toBe(10);
  });

  it('returns 0 when totalCount is 0', () => {
    expect(calculateXpReward(0, 0)).toBe(0);
  });

  it('returns a rounded value for partial scores', () => {
    // 3/10 = 0.3 * 10 = 3
    expect(calculateXpReward(3, 10)).toBe(3);
  });

  it('rounds to nearest integer', () => {
    // 1/3 = 0.333... * 10 = 3.33 -> rounds to 3
    expect(calculateXpReward(1, 3)).toBe(3);
  });

  it('handles 1 correct out of 1 total', () => {
    expect(calculateXpReward(1, 1)).toBe(10);
  });
});
