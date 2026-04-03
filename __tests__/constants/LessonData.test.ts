import HIRAGANA_LESSONS from '../../constants/LessonData';
import KATAKANA_LESSONS from '../../constants/KatakanaData';

const ALL_LESSONS = [...HIRAGANA_LESSONS, ...KATAKANA_LESSONS];

describe('LessonData integrity', () => {
  it('each lesson has a unique ID', () => {
    const ids = ALL_LESSONS.map((l) => l.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each lesson has at least 1 character', () => {
    ALL_LESSONS.forEach((lesson) => {
      expect(lesson.characters.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('each character has char, romaji, exampleWord, and meaning', () => {
    ALL_LESSONS.forEach((lesson) => {
      lesson.characters.forEach((ch) => {
        expect(ch.char).toBeDefined();
        expect(ch.char.length).toBeGreaterThan(0);
        expect(ch.romaji).toBeDefined();
        expect(ch.romaji.length).toBeGreaterThan(0);
        expect(ch.exampleWord).toBeDefined();
        expect(ch.exampleWord.length).toBeGreaterThan(0);
        expect(ch.meaning).toBeDefined();
        expect(ch.meaning.length).toBeGreaterThan(0);
      });
    });
  });

  it('no duplicate characters across all lessons', () => {
    const allChars = ALL_LESSONS.flatMap((l) => l.characters.map((c) => c.char));
    const uniqueChars = new Set(allChars);
    expect(uniqueChars.size).toBe(allChars.length);
  });

  it('hiragana lessons exist', () => {
    expect(HIRAGANA_LESSONS.length).toBeGreaterThan(0);
  });

  it('katakana lessons exist', () => {
    expect(KATAKANA_LESSONS.length).toBeGreaterThan(0);
  });

  it('each lesson has required metadata fields', () => {
    ALL_LESSONS.forEach((lesson) => {
      expect(lesson.id).toBeDefined();
      expect(lesson.title).toBeDefined();
      expect(lesson.titleJa).toBeDefined();
      expect(lesson.description).toBeDefined();
      expect(lesson.icon).toBeDefined();
      expect(lesson.xpReward).toBeGreaterThan(0);
    });
  });
});
