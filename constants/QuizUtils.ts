import HIRAGANA_LESSONS, { HiraganaChar } from './LessonData';
import KATAKANA_LESSONS from './KatakanaData';

const ALL_LESSONS = [...HIRAGANA_LESSONS, ...KATAKANA_LESSONS];

export type QuizDirection = 'romaji-to-hiragana' | 'hiragana-to-romaji';

export type QuizQuestion = {
  /** 문제 (로마자 또는 히라가나) */
  prompt: string;
  /** 정답 */
  correctAnswer: string;
  /** 보기 4개 */
  options: string[];
  /** 문제 방향 */
  direction: QuizDirection;
  lessonId: string;
};

export type MatchingPair = {
  char: string;
  romaji: string;
};

export type PracticeRecord = {
  mode: 'quiz' | 'input' | 'matching' | 'handwriting';
  score: number;
  correctCount: number;
  totalCount: number;
  timestamp: number;
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getAllCharacters(lessonIds: string[]): (HiraganaChar & { lessonId: string })[] {
  return ALL_LESSONS.filter((l) => lessonIds.includes(l.id)).flatMap((l) =>
    l.characters.map((c) => ({ ...c, lessonId: l.id }))
  );
}

function getAllHiragana(): string[] {
  return ALL_LESSONS.flatMap((l) => l.characters.map((c) => c.char));
}

function getAllRomaji(): string[] {
  return ALL_LESSONS.flatMap((l) => l.characters.map((c) => c.romaji));
}

function generateDistractors(correct: string, pool: string[], count: number): string[] {
  const filtered = pool.filter((r) => r !== correct);
  const shuffled = shuffleArray(filtered);
  return shuffled.slice(0, count);
}

/** 양방향 퀴즈 생성 — 로마자→히라가나 / 히라가나→로마자 랜덤 섞임 */
export function generateQuizQuestions(
  lessonIds: string[],
  questionCount: number = 10,
  direction?: QuizDirection
): QuizQuestion[] {
  const chars = getAllCharacters(lessonIds);
  const hiraganaPool = getAllHiragana();
  const romajiPool = getAllRomaji();
  const selected = shuffleArray(chars).slice(0, questionCount);

  return selected.map((c) => {
    const dir = direction ?? (Math.random() > 0.5 ? 'romaji-to-hiragana' : 'hiragana-to-romaji');

    if (dir === 'romaji-to-hiragana') {
      const distractors = generateDistractors(c.char, hiraganaPool, 3);
      return {
        prompt: c.romaji,
        correctAnswer: c.char,
        options: shuffleArray([c.char, ...distractors]),
        direction: dir,
        lessonId: c.lessonId,
      };
    } else {
      const distractors = generateDistractors(c.romaji, romajiPool, 3);
      return {
        prompt: c.char,
        correctAnswer: c.romaji,
        options: shuffleArray([c.romaji, ...distractors]),
        direction: dir,
        lessonId: c.lessonId,
      };
    }
  });
}

export function generateMatchingPairs(lessonIds: string[], pairCount: number = 5): MatchingPair[] {
  const chars = getAllCharacters(lessonIds);
  const selected = shuffleArray(chars).slice(0, pairCount);
  return selected.map((c) => ({ char: c.char, romaji: c.romaji }));
}

export function calculateXpReward(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 10);
}
