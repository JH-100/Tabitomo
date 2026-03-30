export type TravelStage = {
  level: number;
  location: string;
  locationJa: string;
  requirement: string;
  icon: string;
};

const TRAVEL_STAGES: TravelStage[] = [
  {
    level: 0,
    location: '여권 만들기',
    locationJa: 'パスポート作成',
    requirement: '앱 가입 + 온보딩',
    icon: '📋',
  },
  {
    level: 1,
    location: '항공권 예매',
    locationJa: '航空券予約',
    requirement: '히라가나 완료',
    icon: '🎫',
  },
  {
    level: 2,
    location: '짐 싸기',
    locationJa: '荷造り',
    requirement: '카타카나 완료',
    icon: '🧳',
  },
  {
    level: 3,
    location: '공항 도착',
    locationJa: '空港到着',
    requirement: '기초 인사/숫자',
    icon: '🏢',
  },
  {
    level: 4,
    location: '비행기 탑승',
    locationJa: '搭乗',
    requirement: '기초 문법 완료',
    icon: '✈️',
  },
  {
    level: 5,
    location: '나리타 도착',
    locationJa: '成田到着',
    requirement: '기초 회화 10개',
    icon: '🛬',
  },
  {
    level: 6,
    location: '시부야',
    locationJa: '渋谷',
    requirement: '중급 회화 시작',
    icon: '🗼',
  },
  {
    level: 7,
    location: '교토',
    locationJa: '京都',
    requirement: '계속 확장...',
    icon: '⛩️',
  },
  {
    level: 8,
    location: '오사카',
    locationJa: '大阪',
    requirement: '계속 확장...',
    icon: '🏯',
  },
];

export default TRAVEL_STAGES;
