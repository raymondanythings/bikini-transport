import type { components } from '@/generated/api-types';
import { getDuration } from '../data/duration-map';
import { getStopsCount, isBidirectional, lines } from '../data/lines';
import { getStationById, stations } from '../data/stations';
import { saveItineraries } from '../storage';
import { calculateItineraryPricing, calculateLegsWithTransferDiscount } from './pricing';
import { addMinutesToTime, calculateWaitTime, getNextDeparture } from './schedule-utils';

type Line = components['schemas']['Line'];
type Leg = components['schemas']['Leg'];
type LegSummary = components['schemas']['LegSummary'];
type Itinerary = components['schemas']['Itinerary'];
type ItineraryRecommendation = components['schemas']['ItineraryRecommendation'];

interface SearchItinerariesResponse {
  shortestTime: ItineraryRecommendation | null;
  minTransfer: ItineraryRecommendation | null;
  lowestFare: ItineraryRecommendation | null;
}

/**
 * 구간(Leg) 생성 헬퍼
 * 순환 노선의 최단 경로를 자동으로 계산
 */
function createLeg(legId: string, line: Line, fromStationId: string, toStationId: string): Leg {
  const fromStation = getStationById(fromStationId);
  const toStation = getStationById(toStationId);

  if (!fromStation || !toStation) {
    throw new Error('Station not found');
  }

  const fromIndex = line.stationIds.indexOf(fromStationId);
  const toIndex = line.stationIds.indexOf(toStationId);

  if (fromIndex === -1 || toIndex === -1) {
    throw new Error('Station not in line');
  }

  // ✅ 순환 노선 고려한 정거장 수 계산
  const stopsCount = getStopsCount(line, fromStationId, toStationId);

  // 구간별 정확한 소요시간 계산: 경로상의 모든 인접 구간을 합산
  let durationMinutes = 0;
  const totalStations = line.stationIds.length;

  // 순환 노선에서 최단 경로 결정 (양방향 vs 단방향)
  const forwardDistance = toIndex >= fromIndex ? toIndex - fromIndex : totalStations - fromIndex + toIndex;

  const backwardDistance = fromIndex >= toIndex ? fromIndex - toIndex : totalStations - toIndex + fromIndex;

  const useForward = isBidirectional(line.lineId) ? forwardDistance <= backwardDistance : true; // 단방향은 항상 순방향

  // 경로상의 모든 구간 시간을 합산
  if (useForward) {
    // 순방향: fromIndex → toIndex
    let currentIndex = fromIndex;
    for (let i = 0; i < forwardDistance; i++) {
      const nextIndex = (currentIndex + 1) % totalStations;
      const segmentDuration = getDuration(line.stationIds[currentIndex], line.stationIds[nextIndex]);
      durationMinutes += segmentDuration !== null ? segmentDuration : 5;
      currentIndex = nextIndex;
    }
  } else {
    // 역방향: fromIndex → toIndex (역순)
    let currentIndex = fromIndex;
    for (let i = 0; i < backwardDistance; i++) {
      const nextIndex = currentIndex === 0 ? totalStations - 1 : currentIndex - 1;
      const segmentDuration = getDuration(line.stationIds[currentIndex], line.stationIds[nextIndex]);
      durationMinutes += segmentDuration !== null ? segmentDuration : 5;
      currentIndex = nextIndex;
    }
  }

  // 요금 계산: 기본 요금 + (추가 정거장 수 × 정거장당 추가 요금)
  // 탑승지(0번째)와 1번째 정거장은 무료, 2번째 정거장부터 추가요금 부과
  const extraStops = Math.max(0, stopsCount - 2);
  const baseFare = line.baseFare + extraStops * (line.extraFarePerStop || 0);

  return {
    legId,
    line,
    fromStation,
    toStation,
    fromStationIndex: fromIndex,
    toStationIndex: toIndex,
    durationMinutes,
    waitTimeMinutes: 0, // 나중에 계산 (환승 시에만)
    stopsCount,
    baseFare,
    transferNumber: 0, // 나중에 계산
    transferDiscount: 0, // 나중에 계산
    couponDiscount: 0, // 나중에 계산
    finalFare: baseFare, // 나중에 계산
  };
}

/**
 * 직행 경로 찾기 (환승 없음)
 *
 * 모든 노선이 순환하므로 두 역이 같은 노선에 있으면 항상 경로 존재
 */
function findDirectPath(fromStationId: string, toStationId: string): Leg[] | null {
  for (const line of lines) {
    const fromIndex = line.stationIds.indexOf(fromStationId);
    const toIndex = line.stationIds.indexOf(toStationId);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      // ✅ 순환 노선: 두 역이 있으면 항상 경로 존재
      const leg = createLeg(`leg-${line.lineId}-0`, line, fromStationId, toStationId);
      return [leg];
    }
  }

  return null;
}

/**
 * 1회 환승 경로 찾기
 *
 * 순환 노선이므로 두 역이 노선에 있으면 항상 경로 존재
 */
function findOneTransferPaths(fromStationId: string, toStationId: string): Leg[][] {
  const paths: Leg[][] = [];

  // 모든 환승역 찾기 (비키니시티가 주요 환승역)
  const transferStations = stations.filter(station => {
    return lines.filter(line => line.stationIds.includes(station.stationId)).length >= 2;
  });

  for (const transferStation of transferStations) {
    const transferId = transferStation.stationId;

    // 출발역 == 환승역 또는 도착역 == 환승역인 경우 제외
    if (transferId === fromStationId || transferId === toStationId) {
      continue;
    }

    // 첫 번째 구간 찾기
    const firstLine = lines.find(line => {
      const fromIndex = line.stationIds.indexOf(fromStationId);
      const transferIndex = line.stationIds.indexOf(transferId);

      if (fromIndex === -1 || transferIndex === -1) return false;
      if (fromIndex === transferIndex) return false;

      // ✅ 순환 노선: 두 역이 있으면 항상 경로 존재
      return true;
    });

    if (!firstLine) continue;

    // 두 번째 구간 찾기
    const secondLine = lines.find(line => {
      const transferIndex = line.stationIds.indexOf(transferId);
      const toIndex = line.stationIds.indexOf(toStationId);

      if (transferIndex === -1 || toIndex === -1) return false;
      if (transferIndex === toIndex) return false;
      if (line.lineId === firstLine.lineId) return false; // 다른 노선이어야 함

      // ✅ 순환 노선: 두 역이 있으면 항상 경로 존재
      return true;
    });

    if (!secondLine) continue;

    // 경로 생성
    const leg1 = createLeg(`leg-${firstLine.lineId}-0`, firstLine, fromStationId, transferId);
    const leg2 = createLeg(`leg-${secondLine.lineId}-1`, secondLine, transferId, toStationId);

    paths.push([leg1, leg2]);
  }

  return paths;
}

/**
 * 모든 가능한 경로 찾기
 */
export function findAllPaths(fromStationId: string, toStationId: string): Leg[][] {
  // 출발지와 도착지가 같은 경우 빈 배열 반환
  if (fromStationId === toStationId) {
    return [];
  }

  const allPaths: Leg[][] = [];

  // 1. 직행 경로
  const directPath = findDirectPath(fromStationId, toStationId);
  if (directPath) {
    allPaths.push(directPath);
  }

  // 2. 1회 환승 경로
  const oneTransferPaths = findOneTransferPaths(fromStationId, toStationId);
  allPaths.push(...oneTransferPaths);

  // 3. 2회 환승 경로 (선택적)
  // const twoTransferPaths = findTwoTransferPaths(fromStationId, toStationId)
  // allPaths.push(...twoTransferPaths)

  return allPaths;
}

/**
 * Leg 배열을 Itinerary로 변환
 *
 * @param itineraryId - 여정 ID
 * @param legs - 구간 목록
 * @param linesMap - 노선 정보 맵
 * @param departureTime - 출발 시각 (대기 시간 계산용)
 */
export function createItinerary(
  itineraryId: string,
  legs: Leg[],
  linesMap: Map<string, Line>,
  departureTime: Date
): Itinerary {
  // 환승 할인 적용
  const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);

  // 각 구간의 대기 시간 계산
  const legsWithWaitTime = legsWithDiscount.map((leg, index) => {
    if (index === 0) {
      // 첫 구간: 대기 시간 없음
      return { ...leg, waitTimeMinutes: 0 };
    }

    // 이전 구간의 도착 시각 계산
    let currentTime = new Date(departureTime);
    for (let i = 0; i < index; i++) {
      const prevLeg = legsWithDiscount[i];
      currentTime = addMinutesToTime(currentTime, prevLeg.waitTimeMinutes || 0);
      currentTime = addMinutesToTime(currentTime, prevLeg.durationMinutes);
    }

    // 환승역 도착 시각
    const arrivalAtTransferStation = currentTime;

    // 다음 노선의 다음 출발 시각
    const line = linesMap.get(leg.line.lineId);
    if (!line) {
      return { ...leg, waitTimeMinutes: 0 };
    }

    const nextDeparture = getNextDeparture(line, arrivalAtTransferStation, leg.fromStation.stationId);
    const waitTime = calculateWaitTime(arrivalAtTransferStation, nextDeparture);

    return { ...leg, departureTime, waitTimeMinutes: waitTime };
  });

  // 요금 계산
  const pricing = calculateItineraryPricing(legsWithWaitTime);

  // 총 소요 시간 (이동 시간 + 대기 시간)
  const totalDurationMinutes = legsWithWaitTime.reduce(
    (sum, leg) => sum + leg.durationMinutes + (leg.waitTimeMinutes || 0),
    0
  );

  // 환승 횟수
  const transferCount = legsWithWaitTime.length - 1;

  return {
    itineraryId,
    totalDurationMinutes,
    transferCount,
    legs: legsWithWaitTime,
    pricing,
    departureTime: departureTime.toISOString(),
  };
}

/**
 * Leg를 LegSummary로 변환
 */
export function convertToLegSummary(leg: Leg, line: Line): LegSummary {
  return {
    legId: leg.legId,
    line: {
      id: line.lineId,
      name: line.name,
      type: line.type,
      color: line.color,
    },
    fromStation: leg.fromStation,
    toStation: leg.toStation,
    durationMinutes: leg.durationMinutes,
    stopsCount: leg.stopsCount,
    waitTimeMinutes: leg.waitTimeMinutes,
  };
}

/**
 * Itinerary를 ItineraryRecommendation으로 변환
 */
export function convertToRecommendation(itinerary: Itinerary, linesMap: Map<string, Line>): ItineraryRecommendation {
  const fromStation = itinerary.legs[0]?.fromStation;
  const toStation = itinerary.legs[itinerary.legs.length - 1]?.toStation;

  if (!fromStation || !toStation) {
    throw new Error('Invalid itinerary: missing fromStation or toStation');
  }

  const legsSummary = itinerary.legs.map(leg => {
    const line = linesMap.get(leg.line.lineId);
    if (!line) {
      throw new Error(`Line not found: ${leg.line.lineId}`);
    }
    return convertToLegSummary(leg, line);
  });

  return {
    itineraryId: itinerary.itineraryId,
    departureTime: itinerary.departureTime,
    fromStation,
    toStation,
    totalDurationMinutes: itinerary.totalDurationMinutes,
    transferCount: itinerary.transferCount,
    legs: legsSummary,
  };
}

/**
 * 경로 검색 및 추천
 *
 * 최단시간, 최소환승, 최저요금 기준으로 객체 형식으로 반환
 *
 * @param fromStationId - 출발 정류장 ID
 * @param toStationId - 도착 정류장 ID
 * @param departureTime - 출발 시각
 */
export function searchItineraries(
  fromStationId: string,
  toStationId: string,
  departureTime: Date
): SearchItinerariesResponse {
  // 모든 경로 찾기
  const allPathsLegs = findAllPaths(fromStationId, toStationId);

  if (allPathsLegs.length === 0) {
    return {
      shortestTime: null,
      minTransfer: null,
      lowestFare: null,
    };
  }

  // 노선 맵 생성
  const linesMap = new Map(lines.map(line => [line.lineId, line]));

  // Itinerary 객체 생성
  const allItineraries = allPathsLegs.map((legs, index) =>
    createItinerary(`itinerary-${index}`, legs, linesMap, departureTime)
  );

  // 생성된 모든 Itinerary를 저장 (쿠폰/예약 단계에서 참조)
  saveItineraries(allItineraries);

  // 1. 최단시간 경로
  const shortestTimeItinerary = [...allItineraries].sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes)[0];

  // 2. 최소환승 경로
  const minTransferItinerary = [...allItineraries].sort((a, b) => a.transferCount - b.transferCount)[0];

  // 3. 최저요금 경로
  const lowestFareItinerary = [...allItineraries].sort(
    (a, b) => a.pricing.totalBeforeCoupon - b.pricing.totalBeforeCoupon
  )[0];

  return {
    shortestTime: shortestTimeItinerary ? convertToRecommendation(shortestTimeItinerary, linesMap) : null,
    minTransfer: minTransferItinerary ? convertToRecommendation(minTransferItinerary, linesMap) : null,
    lowestFare: lowestFareItinerary ? convertToRecommendation(lowestFareItinerary, linesMap) : null,
  };
}
