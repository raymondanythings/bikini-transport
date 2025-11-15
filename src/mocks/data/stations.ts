import type { components } from '@/generated/api-types';

type Station = components['schemas']['Station'];

/**
 * 비키니시티 전체 역(정류장) 데이터
 *
 * 3개 노선의 모든 정류장을 포함합니다:
 * - 시티선 (City Line)
 * - 외곽선 (Suburban Line)
 * - 투어선 (Tour Line)
 */
export const stations: Station[] = [
  // 시티선 정류장
  {
    stationId: 'new-kelp-city',
    name: '뉴캘프시티',
  },
  {
    stationId: 'glove-world',
    name: '글러브월드',
  },
  {
    stationId: 'jellyfish-fields',
    name: '해파리초원',
  },
  {
    stationId: 'bikini-city',
    name: '비키니시티', // 중심 환승역
  },
  {
    stationId: 'floaters-cemetery',
    name: '플로터스묘지',
  },
  {
    stationId: 'bubble-city',
    name: '버블시티',
  },

  // 외곽선 정류장 (중복 제외)
  {
    stationId: 'merong-city',
    name: '메롱시티',
  },
  {
    stationId: 'squidward-villa',
    name: '징징빌라',
  },
  {
    stationId: 'bikini-atoll',
    name: '비키니환초',
  },

  // 투어선 정류장 (중복 제외)
  {
    stationId: 'old-lagoon',
    name: '구 라군',
  },
  {
    stationId: 'kelp-forest',
    name: '다시마숲',
  },
];

/**
 * 역 ID로 역 정보 조회
 */
export function getStationById(stationId: string): Station | undefined {
  return stations.find((station) => station.stationId === stationId);
}

/**
 * 여러 역 ID로 역 정보 목록 조회
 */
export function getStationsByIds(stationIds: string[]): Station[] {
  return stationIds.map((id) => getStationById(id)).filter((station): station is Station => station !== undefined);
}
