import type { components } from '@/generated/api-types';
import { STATION_UUIDS } from './stations';

type Line = components['schemas']['Line'];

/**
 * 노선 UUID 상수
 * 고정된 UUID를 사용하여 테스트 및 개발 시 일관성 유지
 */
export const LINE_UUIDS = {
  CITY_LINE: '550e8400-e29b-41d4-a716-446655440001',
  SUBURBAN_LINE: '550e8400-e29b-41d4-a716-446655440002',
  TOUR_LINE: '550e8400-e29b-41d4-a716-446655440003',
} as const;

/**
 * 비키니시티 버스 노선 데이터
 *
 * 3개 노선:
 * 1. 시티선 (City Line) - 도심 순환 (양방향)
 * 2. 외곽선 (Suburban Line) - 주거 지역 연결 (단방향)
 * 3. 투어선 (Tour Line) - 관광 특화 (양방향)
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
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티로 순환 (종점)
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
    lineId: LINE_UUIDS.SUBURBAN_LINE,
    name: '외곽선',
    type: 'SUBURBAN',
    color: '#b7dcca', // 연한 청록색
    stationIds: [
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티 (출발)
      STATION_UUIDS.ROCK_BOTTOM, // 메롱시티
      STATION_UUIDS.BUBBLE_TOWN, // 버블시티
      STATION_UUIDS.BIKINI_ATOLL, // 비키니 환초
      STATION_UUIDS.TENTACLE_ACRES, // 징징빌라
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티로 복귀 (종점, 단방향)
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
      STATION_UUIDS.BIKINI_CITY, // 비키니 시티로 복귀 (종점)
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
