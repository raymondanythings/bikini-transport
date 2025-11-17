import { STATION_UUIDS } from './stations';

/**
 * 구간별 실제 소요시간 맵
 *
 * 키 형식: "출발역ID|도착역ID" (양방향 모두 저장)
 * 값: 소요시간 (분)
 *
 * 지도상 거리와 노선 특성을 고려하여 설정
 */

export const durationMap: Record<string, number> = {
  // 시티선 (양방향) - 파란색 노선, 외곽 순환선
  // 순환: 비키니 시티 → 플로터스 묘지 → 버블타운 → 뉴 켈프 시티 → 글러브월드 → 비키니 시티
  [`${STATION_UUIDS.BIKINI_CITY}|${STATION_UUIDS.FLOATERS_CEMETERY}`]: 25,
  [`${STATION_UUIDS.FLOATERS_CEMETERY}|${STATION_UUIDS.BIKINI_CITY}`]: 25,

  [`${STATION_UUIDS.FLOATERS_CEMETERY}|${STATION_UUIDS.BUBBLE_TOWN}`]: 20,
  [`${STATION_UUIDS.BUBBLE_TOWN}|${STATION_UUIDS.FLOATERS_CEMETERY}`]: 20,

  [`${STATION_UUIDS.BUBBLE_TOWN}|${STATION_UUIDS.NEW_KELP_CITY}`]: 35,
  [`${STATION_UUIDS.NEW_KELP_CITY}|${STATION_UUIDS.BUBBLE_TOWN}`]: 35,

  [`${STATION_UUIDS.NEW_KELP_CITY}|${STATION_UUIDS.GLOVE_WORLD}`]: 45,
  [`${STATION_UUIDS.GLOVE_WORLD}|${STATION_UUIDS.NEW_KELP_CITY}`]: 45,

  [`${STATION_UUIDS.GLOVE_WORLD}|${STATION_UUIDS.BIKINI_CITY}`]: 55, // 긴 외곽 구간
  [`${STATION_UUIDS.BIKINI_CITY}|${STATION_UUIDS.GLOVE_WORLD}`]: 55,

  // 외곽선 (단방향만) - 청록색 노선, 가장 외곽 지역 연결
  // 단방향: 비키니 시티 → 메롱시티 → 버블타운 → 비키니 환초 → 징징빌라 → 비키니 시티
  [`${STATION_UUIDS.BIKINI_CITY}|${STATION_UUIDS.ROCK_BOTTOM}`]: 90, // 메롱시티는 가장 아래 먼 지역
  [`${STATION_UUIDS.ROCK_BOTTOM}|${STATION_UUIDS.BUBBLE_TOWN}`]: 75,
  [`${STATION_UUIDS.BUBBLE_TOWN}|${STATION_UUIDS.BIKINI_ATOLL}`]: 110, // 비키니 환초는 가장 오른쪽 먼 지역
  [`${STATION_UUIDS.BIKINI_ATOLL}|${STATION_UUIDS.TENTACLE_ACRES}`]: 95, // 징징빌라까지
  [`${STATION_UUIDS.TENTACLE_ACRES}|${STATION_UUIDS.BIKINI_CITY}`]: 80, // 다시 중심으로

  // 투어선 (양방향) - 빨간색 노선, 관광 특화
  // 순환: 비키니 시티 → 글러브월드 → 다시마숲 → 구-라군 → 해파리 초원 → 비키니 시티
  [`${STATION_UUIDS.BIKINI_CITY}|${STATION_UUIDS.GLOVE_WORLD}`]: 40,
  [`${STATION_UUIDS.GLOVE_WORLD}|${STATION_UUIDS.BIKINI_CITY}`]: 40,

  [`${STATION_UUIDS.GLOVE_WORLD}|${STATION_UUIDS.KELP_FOREST}`]: 50, // 다시마숲까지
  [`${STATION_UUIDS.KELP_FOREST}|${STATION_UUIDS.GLOVE_WORLD}`]: 50,

  [`${STATION_UUIDS.KELP_FOREST}|${STATION_UUIDS.GOO_LAGOON}`]: 45, // 구-라군까지
  [`${STATION_UUIDS.GOO_LAGOON}|${STATION_UUIDS.KELP_FOREST}`]: 45,

  [`${STATION_UUIDS.GOO_LAGOON}|${STATION_UUIDS.JELLYFISH_FIELDS}`]: 40, // 해파리 초원까지
  [`${STATION_UUIDS.JELLYFISH_FIELDS}|${STATION_UUIDS.GOO_LAGOON}`]: 40,

  [`${STATION_UUIDS.JELLYFISH_FIELDS}|${STATION_UUIDS.BIKINI_CITY}`]: 30, // 중심으로 복귀
  [`${STATION_UUIDS.BIKINI_CITY}|${STATION_UUIDS.JELLYFISH_FIELDS}`]: 30,
};

/**
 * 두 역 사이의 소요시간 조회
 */
export function getDuration(fromStationId: string, toStationId: string): number | null {
  const key = `${fromStationId}|${toStationId}`;
  return durationMap[key] || null;
}

/**
 * 여러 역을 거쳐가는 경로의 총 소요시간 계산
 */
export function calculateTotalDuration(stationIds: string[]): number {
  if (stationIds.length < 2) {
    throw new Error('At least 2 stations are required to calculate duration');
  }

  let totalDuration = 0;

  for (let i = 0; i < stationIds.length - 1; i++) {
    const duration = getDuration(stationIds[i], stationIds[i + 1]);

    if (duration === null) {
      throw new Error(
        `Duration not found for route: ${stationIds[i]} → ${stationIds[i + 1]}. ` + 'Please check durationMap data integrity.'
      );
    }

    totalDuration += duration;
  }

  return totalDuration;
}
