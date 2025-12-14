import type { components } from '@/generated/api-types';
import { STATION_UUIDS } from './stations';

type Line = components['schemas']['Line'];

/**
 * 노선 UUID 상수
 * 고정된 UUID를 사용하여 테스트 및 개발 시 일관성 유지
 */
export const LINE_UUIDS = {
  CITY_LINE: '550e8400-e29b-41d4-a716-446655440001',
  SUBURB_LINE: '550e8400-e29b-41d4-a716-446655440002',
  TOUR_LINE: '550e8400-e29b-41d4-a716-446655440003',
} as const;

/**
 * 비키니시티 버스 노선 데이터
 *
 * 3개 노선 (모든 노선이 순환 노선):
 * 1. 시티선 (City Line) - 도심 순환 (양방향 순환)
 * 2. 외곽선 (SUBURB Line) - 주거 지역 연결 (단방향 순환)
 * 3. 투어선 (Tour Line) - 관광 특화 (양방향 순환)
 *
 * 순환 노선 특징:
 * - 마지막 정거장에서 첫 정거장으로 복귀 (예: 4→0 경로 존재)
 * - 양방향 순환: 양방향 운행 + 최단 경로 자동 선택
 * - 단방향 순환: 한 방향으로만 운행 (0→1→2→3→4→0)
 */
export const lines: Line[] = [
  {
    lineId: LINE_UUIDS.CITY_LINE,
    name: '시티선',
    type: 'CITY',
    color: '#faab9e', // 연한 주황색
    stationIds: [
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티 (환승역)
      STATION_UUIDS.FLOATERS_CEMETERY, // 플로터스 묘지
      STATION_UUIDS.BUBBLE_TOWN, // 버블시티
      STATION_UUIDS.NEW_KELP_CITY, // 뉴 켈프 시티
      STATION_UUIDS.GLOVE_WORLD, // 글러브월드
    ],
    baseFare: 10.0, // 기본요금 10₴
    extraFarePerStop: 2.0, // 정거장당 추가 요금 2₴
    transferDiscount1st: 0.1, // 1회 환승 10% 할인
    transferDiscount2nd: 0.2, // 2회 이상 환승 20% 할인
    schedule: {
      firstDeparture: '06:30', // 첫차
      lastDeparture: '23:30', // 막차
      intervalMinutes: 15, // 배차간격 15분
    },
  },
  {
    lineId: LINE_UUIDS.SUBURB_LINE,
    name: '외곽선',
    type: 'SUBURB',
    color: '#b7dcca', // 연한 청록색
    stationIds: [
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티 (출발)
      STATION_UUIDS.ROCK_BOTTOM, // 메롱시티
      STATION_UUIDS.BUBBLE_TOWN, // 버블시티
      STATION_UUIDS.BIKINI_ATOLL, // 비키니 환초
      STATION_UUIDS.TENTACLE_ACRES, // 징징빌라
    ],
    baseFare: 25.0, // 기본요금 25₴
    extraFarePerStop: 8.0, // 정거장당 추가 요금 8₴
    transferDiscount1st: 0.15, // 1회 환승 15% 할인
    transferDiscount2nd: 0.25, // 2회 이상 환승 25% 할인
    schedule: {
      firstDeparture: '05:00', // 첫차
      lastDeparture: '21:30', // 막차
      intervalMinutes: 90, // 배차간격 1시간 30분
    },
  },
  {
    lineId: LINE_UUIDS.TOUR_LINE,
    name: '투어선',
    type: 'TOUR',
    color: '#ff534f', // 빨간색
    stationIds: [
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티 (환승역)
      STATION_UUIDS.GLOVE_WORLD, // 글러브월드
      STATION_UUIDS.KELP_FOREST, // 다시마숲
      STATION_UUIDS.GOO_LAGOON, // 구-라군
      STATION_UUIDS.JELLYFISH_FIELDS, // 해파리 초원
    ],
    baseFare: 15.0, // 기본요금 15₴
    extraFarePerStop: 5.0, // 정거장당 추가 요금 5₴
    transferDiscount1st: 0.15, // 1회 환승 15% 할인
    transferDiscount2nd: 0.2, // 2회 이상 환승 20% 할인
    schedule: {
      firstDeparture: '06:00', // 첫차
      lastDeparture: '22:00', // 막차
      intervalMinutes: 60, // 배차간격 1시간
    },
  },
];

/**
 * 노선의 운행 방향 타입
 * - BIDIRECTIONAL: 양방향 운행 (시티선, 투어선)
 * - UNIDIRECTIONAL: 단방향 운행 (외곽선)
 */
type LineDirection = 'BIDIRECTIONAL' | 'UNIDIRECTIONAL';

/**
 * 노선별 운행 방향 매핑
 */
const LINE_DIRECTIONS: Record<string, LineDirection> = {
  [LINE_UUIDS.CITY_LINE]: 'BIDIRECTIONAL',
  [LINE_UUIDS.SUBURB_LINE]: 'UNIDIRECTIONAL',
  [LINE_UUIDS.TOUR_LINE]: 'BIDIRECTIONAL',
};

/**
 * 노선 ID로 노선 정보 조회
 */
export function getLineById(lineId: string): Line | undefined {
  return lines.find(line => line.lineId === lineId);
}

/**
 * 노선의 운행 방향 조회
 */
export function getLineDirection(lineId: string): LineDirection {
  return LINE_DIRECTIONS[lineId] || 'UNIDIRECTIONAL';
}

/**
 * 노선이 양방향 운행하는지 확인
 */
export function isBidirectional(lineId: string): boolean {
  return LINE_DIRECTIONS[lineId] === 'BIDIRECTIONAL';
}

/**
 * 특정 역을 경유하는 모든 노선 조회
 */
export function getLinesByStation(stationId: string): Line[] {
  return lines.filter(line => line.stationIds.includes(stationId));
}

/**
 * 두 역을 모두 포함하는 노선 찾기
 * 모든 노선이 순환하므로 두 역이 포함되면 항상 경로 존재
 */
export function findDirectLine(fromStationId: string, toStationId: string): Line | undefined {
  return lines.find(line => {
    const hasFrom = line.stationIds.includes(fromStationId);
    const hasTo = line.stationIds.includes(toStationId);

    if (!hasFrom || !hasTo) return false;
    if (fromStationId === toStationId) return false; // 같은 역 제외

    // 모든 노선이 순환하므로 두 역이 있으면 항상 경로 존재
    return true;
  });
}

/**
 * 노선 내에서 두 역 사이의 정거장 수 계산 (순환 노선 고려)
 *
 * 양방향 순환 노선: 두 방향 중 짧은 경로 자동 선택
 * 단방향 순환 노선: 한 방향으로만 순환하여 계산
 *
 * @example
 * // 시티선 (5개 정거장, 양방향 순환): GLOVE_WORLD(4) → BIKINI_CITY(0)
 * getStopsCount(cityLine, "GLOVE_WORLD", "BIKINI_CITY")
 * // → 1 (순환 경로: 4→0, 역방향 4→3→2→1→0보다 짧음)
 *
 * // 외곽선 (5개 정거장, 단방향 순환): TENTACLE_ACRES(4) → BIKINI_CITY(0)
 * getStopsCount(SUBURBLine, "TENTACLE_ACRES", "BIKINI_CITY")
 * // → 1 (순환 경로: 4→0)
 *
 * @throws {Error} 역을 찾을 수 없는 경우
 */
export function getStopsCount(line: Line, fromStationId: string, toStationId: string): number {
  const fromIndex = line.stationIds.indexOf(fromStationId);
  const toIndex = line.stationIds.indexOf(toStationId);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Station not found in line');
  }

  if (fromIndex === toIndex) {
    return 0; // 같은 역
  }

  const totalStations = line.stationIds.length;

  if (isBidirectional(line.lineId)) {
    // 양방향 순환: 두 방향 중 짧은 경로 선택
    const forwardDistance = toIndex >= fromIndex ? toIndex - fromIndex : totalStations - fromIndex + toIndex;

    const backwardDistance = fromIndex >= toIndex ? fromIndex - toIndex : totalStations - toIndex + fromIndex;

    return Math.min(forwardDistance, backwardDistance);
  } else {
    // 단방향 순환: 한 방향으로만 (순방향 또는 순환)
    if (toIndex >= fromIndex) {
      return toIndex - fromIndex;
    } else {
      // 순환 경로: 마지막까지 가서 처음으로
      return totalStations - fromIndex + toIndex;
    }
  }
}
