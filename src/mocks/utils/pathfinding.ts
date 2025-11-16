import type { components } from '@/generated/api-types';
import { stations, getStationById } from '../data/stations';
import { lines, LINE_UUIDS } from '../data/lines';
import { getDuration } from '../data/duration-map';
import { calculateLegsWithTransferDiscount, calculateItineraryPricing } from './pricing';

type Line = components['schemas']['Line'];
type Leg = components['schemas']['Leg'];
type Itinerary = components['schemas']['Itinerary'];

/**
 * 구간(Leg) 생성 헬퍼
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

  const stopsCount = Math.abs(toIndex - fromIndex);

  // 구간별 정확한 소요시간 조회
  const duration = getDuration(fromStationId, toStationId);
  const durationMinutes = duration !== null ? duration : stopsCount * 5;

  // 요금 계산: 기본 요금 + ((정거장 수 - 1) × 정거장당 추가 요금)
  // 출발지는 요금에 포함되지 않으므로 -1
  const baseFare = line.baseFare + (stopsCount - 1) * (line.extraFarePerStop || 0);

  return {
    legId,
    lineId: line.lineId,
    lineName: line.name,
    lineColor: line.color,
    fromStation,
    toStation,
    fromStationIndex: fromIndex,
    toStationIndex: toIndex,
    durationMinutes,
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
 * 외곽선은 단방향 노선이므로 순방향만 허용
 */
function findDirectPath(fromStationId: string, toStationId: string): Leg[] | null {
  for (const line of lines) {
    const fromIndex = line.stationIds.indexOf(fromStationId);
    const toIndex = line.stationIds.indexOf(toStationId);

    if (fromIndex !== -1 && toIndex !== -1) {
      // 외곽선은 단방향만 허용
      if (line.lineId === LINE_UUIDS.SUBURBAN_LINE) {
        if (fromIndex < toIndex) {
          const leg = createLeg(`leg-${line.lineId}-0`, line, fromStationId, toStationId);
          return [leg];
        }
      } else {
        // 시티선, 투어선은 양방향 허용
        if (fromIndex < toIndex) {
          const leg = createLeg(`leg-${line.lineId}-0`, line, fromStationId, toStationId);
          return [leg];
        }
      }
    }
  }

  return null;
}

/**
 * 1회 환승 경로 찾기
 *
 * 외곽선은 단방향이므로 순방향만 허용
 */
function findOneTransferPaths(fromStationId: string, toStationId: string): Leg[][] {
  const paths: Leg[][] = [];

  // 모든 환승역 찾기 (비키니시티가 주요 환승역)
  const transferStations = stations.filter((station) => {
    return lines.filter((line) => line.stationIds.includes(station.stationId)).length >= 2;
  });

  for (const transferStation of transferStations) {
    const transferId = transferStation.stationId;

    // 출발역 == 환승역 또는 도착역 == 환승역인 경우 제외
    if (transferId === fromStationId || transferId === toStationId) {
      continue;
    }

    // 첫 번째 구간 찾기
    const firstLine = lines.find((line) => {
      const fromIndex = line.stationIds.indexOf(fromStationId);
      const transferIndex = line.stationIds.indexOf(transferId);

      if (fromIndex === -1 || transferIndex === -1) return false;

      // 외곽선은 단방향
      if (line.lineId === LINE_UUIDS.SUBURBAN_LINE) {
        return fromIndex < transferIndex;
      }
      // 다른 노선은 양방향
      return fromIndex < transferIndex;
    });

    if (!firstLine) continue;

    // 두 번째 구간 찾기
    const secondLine = lines.find((line) => {
      const transferIndex = line.stationIds.indexOf(transferId);
      const toIndex = line.stationIds.indexOf(toStationId);

      if (transferIndex === -1 || toIndex === -1) return false;
      if (line.lineId === firstLine.lineId) return false; // 다른 노선이어야 함

      // 외곽선은 단방향
      if (line.lineId === LINE_UUIDS.SUBURBAN_LINE) {
        return transferIndex < toIndex;
      }
      // 다른 노선은 양방향
      return transferIndex < toIndex;
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
 */
export function createItinerary(itineraryId: string, legs: Leg[], linesMap: Map<string, Line>): Itinerary {
  // 환승 할인 적용
  const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);

  // 요금 계산
  const pricing = calculateItineraryPricing(legsWithDiscount);

  // 총 소요 시간
  const totalDurationMinutes = legsWithDiscount.reduce((sum, leg) => sum + leg.durationMinutes, 0);

  // 환승 횟수
  const transferCount = legsWithDiscount.length - 1;

  return {
    itineraryId,
    recommendationTypes: [], // 나중에 결정
    totalDurationMinutes,
    transferCount,
    legs: legsWithDiscount,
    pricing,
  };
}

/**
 * 경로 검색 및 추천
 *
 * 최단시간, 최소환승, 최저요금 기준으로 최대 3개 추천
 */
export function searchItineraries(fromStationId: string, toStationId: string): Itinerary[] {
  // 모든 경로 찾기
  const allPathsLegs = findAllPaths(fromStationId, toStationId);

  if (allPathsLegs.length === 0) {
    return [];
  }

  // 노선 맵 생성
  const linesMap = new Map(lines.map((line) => [line.lineId, line]));

  // Itinerary 객체 생성
  const allItineraries = allPathsLegs.map((legs, index) => createItinerary(`itinerary-${index}`, legs, linesMap));

  // 추천 경로 선정
  const recommendations: Itinerary[] = [];
  const addedIds = new Set<string>();

  // 1. 최단시간 경로
  const shortestTime = [...allItineraries].sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes)[0];
  if (shortestTime && !addedIds.has(shortestTime.itineraryId)) {
    shortestTime.recommendationTypes.push('SHORTEST_TIME');
    recommendations.push(shortestTime);
    addedIds.add(shortestTime.itineraryId);
  }

  // 2. 최소환승 경로
  const minTransfer = [...allItineraries].sort((a, b) => a.transferCount - b.transferCount)[0];
  if (minTransfer) {
    if (addedIds.has(minTransfer.itineraryId)) {
      // 이미 추가된 경로라면 타입만 추가
      const existing = recommendations.find((r) => r.itineraryId === minTransfer.itineraryId);
      if (existing && !existing.recommendationTypes.includes('MIN_TRANSFER')) {
        existing.recommendationTypes.push('MIN_TRANSFER');
      }
    } else {
      minTransfer.recommendationTypes.push('MIN_TRANSFER');
      recommendations.push(minTransfer);
      addedIds.add(minTransfer.itineraryId);
    }
  }

  // 3. 최저요금 경로
  const lowestFare = [...allItineraries].sort((a, b) => a.pricing.totalBeforeCoupon - b.pricing.totalBeforeCoupon)[0];
  if (lowestFare) {
    if (addedIds.has(lowestFare.itineraryId)) {
      // 이미 추가된 경로라면 타입만 추가
      const existing = recommendations.find((r) => r.itineraryId === lowestFare.itineraryId);
      if (existing && !existing.recommendationTypes.includes('LOWEST_FARE')) {
        existing.recommendationTypes.push('LOWEST_FARE');
      }
    } else {
      lowestFare.recommendationTypes.push('LOWEST_FARE');
      recommendations.push(lowestFare);
      addedIds.add(lowestFare.itineraryId);
    }
  }

  // 최대 3개까지만 반환
  return recommendations.slice(0, 3);
}
