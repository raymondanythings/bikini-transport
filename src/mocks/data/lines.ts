import type { components } from '@/generated/api-types';

type Line = components['schemas']['Line'];

/**
 * 비키니시티 버스 노선 데이터
 *
 * 3개 노선:
 * 1. 시티선 (City Line) - 도심 순환
 * 2. 외곽선 (Suburban Line) - 주거 지역 연결
 * 3. 투어선 (Tour Line) - 관광 특화
 */
export const lines: Line[] = [
  {
    lineId: 'city-line',
    name: '시티선',
    type: 'CITY',
    color: '#FFC107', // 노란색
    stationIds: [
      'new-kelp-city',
      'glove-world',
      'jellyfish-fields',
      'bikini-city', // 환승역
      'floaters-cemetery',
      'bubble-city',
    ],
    baseFare: 5.0, // 기본요금 5₴
    transferDiscount1st: 0.2, // 1회 환승 20% 할인
    transferDiscount2nd: 0.15, // 2회 이상 환승 15% 할인
  },
  {
    lineId: 'suburban-line',
    name: '외곽선',
    type: 'SUBURBAN',
    color: '#4CAF50', // 초록색
    stationIds: [
      'bubble-city',
      'merong-city',
      'bikini-city', // 환승역
      'squidward-villa',
      'bikini-atoll',
    ],
    baseFare: 4.5, // 기본요금 4.5₴
    transferDiscount1st: 0.25, // 1회 환승 25% 할인
    transferDiscount2nd: 0.2, // 2회 이상 환승 20% 할인
  },
  {
    lineId: 'tour-line',
    name: '투어선',
    type: 'TOUR',
    color: '#F44336', // 빨간색
    stationIds: [
      'glove-world',
      'bikini-city', // 환승역
      'jellyfish-fields',
      'old-lagoon',
      'kelp-forest',
    ],
    baseFare: 6.0, // 기본요금 6₴
    transferDiscount1st: 0.15, // 1회 환승 15% 할인
    transferDiscount2nd: 0.1, // 2회 이상 환승 10% 할인
  },
];

/**
 * 노선 ID로 노선 정보 조회
 */
export function getLineById(lineId: string): Line | undefined {
  return lines.find((line) => line.lineId === lineId);
}

/**
 * 특정 역을 경유하는 모든 노선 조회
 */
export function getLinesByStation(stationId: string): Line[] {
  return lines.filter((line) => line.stationIds.includes(stationId));
}

/**
 * 두 역을 모두 포함하는 노선 찾기
 */
export function findDirectLine(fromStationId: string, toStationId: string): Line | undefined {
  return lines.find((line) => line.stationIds.includes(fromStationId) && line.stationIds.includes(toStationId));
}

/**
 * 노선 내에서 두 역 사이의 정거장 수 계산
 */
export function getStopsCount(line: Line, fromStationId: string, toStationId: string): number {
  const fromIndex = line.stationIds.indexOf(fromStationId);
  const toIndex = line.stationIds.indexOf(toStationId);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Station not found in line');
  }

  return Math.abs(toIndex - fromIndex);
}
