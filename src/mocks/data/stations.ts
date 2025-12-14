import type { components } from '@/generated/api-types';

type Station = components['schemas']['Station'];

/**
 * 역 UUID 상수
 * 고정된 UUID를 사용하여 테스트 및 개발 시 일관성 유지
 */
export const STATION_UUIDS = {
  NEW_KELP_CITY: '660e8400-e29b-41d4-a716-446655440001',
  GLOVE_WORLD: '660e8400-e29b-41d4-a716-446655440002',
  BIKINI_CITY: '660e8400-e29b-41d4-a716-446655440003',
  FLOATERS_CEMETERY: '660e8400-e29b-41d4-a716-446655440004',
  BUBBLE_TOWN: '660e8400-e29b-41d4-a716-446655440005',
  ROCK_BOTTOM: '660e8400-e29b-41d4-a716-446655440006',
  TENTACLE_ACRES: '660e8400-e29b-41d4-a716-446655440007',
  BIKINI_ATOLL: '660e8400-e29b-41d4-a716-446655440008',
  GOO_LAGOON: '660e8400-e29b-41d4-a716-446655440009',
  KELP_FOREST: '660e8400-e29b-41d4-a716-446655440010',
  JELLYFISH_FIELDS: '660e8400-e29b-41d4-a716-446655440011',
} as const;

/**
 * 비키니시티 전체 역(정류장) 데이터
 *
 * 3개 노선의 모든 정류장을 포함합니다:
 * - 시티선 (City Line)
 * - 외곽선 (SUBURB Line)
 * - 투어선 (Tour Line)
 */
export const stations: Station[] = [
  // 시티선 정류장
  {
    stationId: STATION_UUIDS.NEW_KELP_CITY,
    name: '뉴 켈프 시티',
  },
  {
    stationId: STATION_UUIDS.GLOVE_WORLD,
    name: '글러브월드',
  },
  {
    stationId: STATION_UUIDS.BIKINI_CITY,
    name: '비키니 시티', // 중심 환승역
  },
  {
    stationId: STATION_UUIDS.FLOATERS_CEMETERY,
    name: '플로터스 묘지',
  },
  {
    stationId: STATION_UUIDS.BUBBLE_TOWN,
    name: '버블타운',
  },

  // 외곽선 정류장 (중복 제외)
  {
    stationId: STATION_UUIDS.ROCK_BOTTOM,
    name: '메롱시티',
  },
  {
    stationId: STATION_UUIDS.TENTACLE_ACRES,
    name: '징징빌라',
  },
  {
    stationId: STATION_UUIDS.BIKINI_ATOLL,
    name: '비키니 환초',
  },

  // 투어선 정류장 (중복 제외)
  {
    stationId: STATION_UUIDS.GOO_LAGOON,
    name: '구-라군',
  },
  {
    stationId: STATION_UUIDS.KELP_FOREST,
    name: '다시마숲',
  },
  {
    stationId: STATION_UUIDS.JELLYFISH_FIELDS,
    name: '해파리 초원',
  },
];

/**
 * 역 ID로 역 정보 조회
 */
export function getStationById(stationId: string): Station | undefined {
  return stations.find(station => station.stationId === stationId);
}

/**
 * 여러 역 ID로 역 정보 목록 조회
 */
export function getStationsByIds(stationIds: string[]): Station[] {
  return stationIds.map(id => getStationById(id)).filter((station): station is Station => station !== undefined);
}
