export type HiraganaChar = {
  char: string;
  romaji: string;
  exampleWord: string;
  exampleRomaji: string;
  meaning: string;
};

export type HiraganaLesson = {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: string;
  characters: HiraganaChar[];
  xpReward: number;
};

const HIRAGANA_LESSONS: HiraganaLesson[] = [
  {
    id: 'hiragana-a',
    title: 'あ행 — 모음',
    titleJa: 'あ行',
    description: '일본어의 5가지 기본 모음을 배워보세요',
    icon: '🌸',
    xpReward: 20,
    characters: [
      { char: 'あ', romaji: 'a', exampleWord: 'あめ', exampleRomaji: 'ame', meaning: '비' },
      { char: 'い', romaji: 'i', exampleWord: 'いぬ', exampleRomaji: 'inu', meaning: '개' },
      { char: 'う', romaji: 'u', exampleWord: 'うみ', exampleRomaji: 'umi', meaning: '바다' },
      { char: 'え', romaji: 'e', exampleWord: 'えき', exampleRomaji: 'eki', meaning: '역' },
      { char: 'お', romaji: 'o', exampleWord: 'おちゃ', exampleRomaji: 'ocha', meaning: '차(茶)' },
    ],
  },
  {
    id: 'hiragana-ka',
    title: 'か행',
    titleJa: 'か行',
    description: 'K 자음과 모음의 조합을 배워보세요',
    icon: '🍃',
    xpReward: 25,
    characters: [
      { char: 'か', romaji: 'ka', exampleWord: 'かさ', exampleRomaji: 'kasa', meaning: '우산' },
      { char: 'き', romaji: 'ki', exampleWord: 'きって', exampleRomaji: 'kitte', meaning: '우표' },
      { char: 'く', romaji: 'ku', exampleWord: 'くち', exampleRomaji: 'kuchi', meaning: '입' },
      { char: 'け', romaji: 'ke', exampleWord: 'けむり', exampleRomaji: 'kemuri', meaning: '연기' },
      { char: 'こ', romaji: 'ko', exampleWord: 'こえ', exampleRomaji: 'koe', meaning: '목소리' },
    ],
  },
  {
    id: 'hiragana-sa',
    title: 'さ행',
    titleJa: 'さ行',
    description: 'S 자음과 모음의 조합을 배워보세요',
    icon: '🌊',
    xpReward: 25,
    characters: [
      { char: 'さ', romaji: 'sa', exampleWord: 'さくら', exampleRomaji: 'sakura', meaning: '벚꽃' },
      { char: 'し', romaji: 'shi', exampleWord: 'しろ', exampleRomaji: 'shiro', meaning: '하얀' },
      { char: 'す', romaji: 'su', exampleWord: 'すし', exampleRomaji: 'sushi', meaning: '초밥' },
      { char: 'せ', romaji: 'se', exampleWord: 'せかい', exampleRomaji: 'sekai', meaning: '세계' },
      { char: 'そ', romaji: 'so', exampleWord: 'そら', exampleRomaji: 'sora', meaning: '하늘' },
    ],
  },
  {
    id: 'hiragana-ta',
    title: 'た행',
    titleJa: 'た行',
    description: 'T 자음과 모음의 조합을 배워보세요',
    icon: '⛩️',
    xpReward: 25,
    characters: [
      { char: 'た', romaji: 'ta', exampleWord: 'たまご', exampleRomaji: 'tamago', meaning: '계란' },
      {
        char: 'ち',
        romaji: 'chi',
        exampleWord: 'ちかてつ',
        exampleRomaji: 'chikatetsu',
        meaning: '지하철',
      },
      { char: 'つ', romaji: 'tsu', exampleWord: 'つき', exampleRomaji: 'tsuki', meaning: '달' },
      { char: 'て', romaji: 'te', exampleWord: 'てがみ', exampleRomaji: 'tegami', meaning: '편지' },
      { char: 'と', romaji: 'to', exampleWord: 'とり', exampleRomaji: 'tori', meaning: '새' },
    ],
  },
  {
    id: 'hiragana-na',
    title: 'な행',
    titleJa: 'な行',
    description: 'N 자음과 모음의 조합을 배워보세요',
    icon: '🗻',
    xpReward: 25,
    characters: [
      { char: 'な', romaji: 'na', exampleWord: 'なつ', exampleRomaji: 'natsu', meaning: '여름' },
      { char: 'に', romaji: 'ni', exampleWord: 'にほん', exampleRomaji: 'nihon', meaning: '일본' },
      { char: 'ぬ', romaji: 'nu', exampleWord: 'ぬの', exampleRomaji: 'nuno', meaning: '천' },
      { char: 'ね', romaji: 'ne', exampleWord: 'ねこ', exampleRomaji: 'neko', meaning: '고양이' },
      { char: 'の', romaji: 'no', exampleWord: 'のり', exampleRomaji: 'nori', meaning: '김' },
    ],
  },
  {
    id: 'hiragana-ha',
    title: 'は행',
    titleJa: 'は行',
    description: 'H 자음과 모음의 조합을 배워보세요',
    icon: '🎋',
    xpReward: 25,
    characters: [
      { char: 'は', romaji: 'ha', exampleWord: 'はな', exampleRomaji: 'hana', meaning: '꽃' },
      { char: 'ひ', romaji: 'hi', exampleWord: 'ひと', exampleRomaji: 'hito', meaning: '사람' },
      { char: 'ふ', romaji: 'fu', exampleWord: 'ふね', exampleRomaji: 'fune', meaning: '배' },
      { char: 'へ', romaji: 'he', exampleWord: 'へや', exampleRomaji: 'heya', meaning: '방' },
      { char: 'ほ', romaji: 'ho', exampleWord: 'ほし', exampleRomaji: 'hoshi', meaning: '별' },
    ],
  },
  {
    id: 'hiragana-ma',
    title: 'ま행',
    titleJa: 'ま行',
    description: 'M 자음과 모음의 조합을 배워보세요',
    icon: '🍡',
    xpReward: 25,
    characters: [
      { char: 'ま', romaji: 'ma', exampleWord: 'まち', exampleRomaji: 'machi', meaning: '거리' },
      { char: 'み', romaji: 'mi', exampleWord: 'みず', exampleRomaji: 'mizu', meaning: '물' },
      { char: 'む', romaji: 'mu', exampleWord: 'むし', exampleRomaji: 'mushi', meaning: '벌레' },
      { char: 'め', romaji: 'me', exampleWord: 'めがね', exampleRomaji: 'megane', meaning: '안경' },
      { char: 'も', romaji: 'mo', exampleWord: 'もり', exampleRomaji: 'mori', meaning: '숲' },
    ],
  },
  {
    id: 'hiragana-ya',
    title: 'や행',
    titleJa: 'や行',
    description: 'Y 자음과 모음의 조합을 배워보세요',
    icon: '🏔️',
    xpReward: 20,
    characters: [
      { char: 'や', romaji: 'ya', exampleWord: 'やま', exampleRomaji: 'yama', meaning: '산' },
      { char: 'ゆ', romaji: 'yu', exampleWord: 'ゆき', exampleRomaji: 'yuki', meaning: '눈(雪)' },
      { char: 'よ', romaji: 'yo', exampleWord: 'よる', exampleRomaji: 'yoru', meaning: '밤' },
    ],
  },
  {
    id: 'hiragana-ra',
    title: 'ら행',
    titleJa: 'ら行',
    description: 'R 자음과 모음의 조합을 배워보세요',
    icon: '🎐',
    xpReward: 25,
    characters: [
      {
        char: 'ら',
        romaji: 'ra',
        exampleWord: 'らいねん',
        exampleRomaji: 'rainen',
        meaning: '내년',
      },
      { char: 'り', romaji: 'ri', exampleWord: 'りんご', exampleRomaji: 'ringo', meaning: '사과' },
      { char: 'る', romaji: 'ru', exampleWord: 'るす', exampleRomaji: 'rusu', meaning: '부재' },
      {
        char: 'れ',
        romaji: 're',
        exampleWord: 'れきし',
        exampleRomaji: 'rekishi',
        meaning: '역사',
      },
      { char: 'ろ', romaji: 'ro', exampleWord: 'ろく', exampleRomaji: 'roku', meaning: '6' },
    ],
  },
  {
    id: 'hiragana-wa',
    title: 'わ행 + ん',
    titleJa: 'わ行',
    description: 'W 자음과 받침 ん을 배워보세요',
    icon: '🎌',
    xpReward: 20,
    characters: [
      { char: 'わ', romaji: 'wa', exampleWord: 'わたし', exampleRomaji: 'watashi', meaning: '나' },
      {
        char: 'を',
        romaji: 'wo',
        exampleWord: 'みずを',
        exampleRomaji: 'mizu wo',
        meaning: '물을 (조사)',
      },
      { char: 'ん', romaji: 'n', exampleWord: 'にほん', exampleRomaji: 'nihon', meaning: '일본' },
    ],
  },
];

export default HIRAGANA_LESSONS;

// 전체 레슨 (히라가나 + 카타카나) 통합 export
export { default as KATAKANA_LESSONS } from './KatakanaData';
