import type { components } from '@/generated/api-types';
import { getDuration } from '../data/duration-map';
import { isBidirectional } from '../data/lines';

type Line = components['schemas']['Line'];

/**
 * "HH:MM" 형식의 시간 문자열을 파싱
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * 날짜에 시간 문자열("HH:MM")을 적용
 */
export function applyTimeToDate(date: Date, timeStr: string): Date {
  const { hours, minutes } = parseTimeString(timeStr);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * 시간에 분 추가
 */
export function addMinutesToTime(baseTime: Date, minutes: number): Date {
  return new Date(baseTime.getTime() + minutes * 60 * 1000);
}

/**
 * 순환 노선에서 특정 정류장까지의 소요시간 계산
 *
 * @param line - 노선 정보
 * @param fromStationId - 시작 정류장 (노선의 출발역)
 * @param toStationId - 도착 정류장 (환승역)
 * @returns 소요시간 (분)
 */
export function calculateTimeToStation(line: Line, fromStationId: string, toStationId: string): number {
  const fromIndex = line.stationIds.indexOf(fromStationId);
  const toIndex = line.stationIds.indexOf(toStationId);

  if (fromIndex === -1 || toIndex === -1) {
    return 0;
  }

  if (fromIndex === toIndex) {
    return 0;
  }

  const totalStations = line.stationIds.length;

  // 순환 노선의 최단 경로 계산
  const forwardDistance = toIndex >= fromIndex
    ? toIndex - fromIndex
    : totalStations - fromIndex + toIndex;

  const backwardDistance = fromIndex >= toIndex
    ? fromIndex - toIndex
    : totalStations - toIndex + fromIndex;

  const useForward = isBidirectional(line.lineId)
    ? forwardDistance <= backwardDistance
    : true; // 단방향은 항상 순방향

  let totalDuration = 0;

  if (useForward) {
    // 순방향
    let currentIndex = fromIndex;
    for (let i = 0; i < forwardDistance; i++) {
      const nextIndex = (currentIndex + 1) % totalStations;
      const duration = getDuration(line.stationIds[currentIndex], line.stationIds[nextIndex]);
      totalDuration += duration !== null ? duration : 5;
      currentIndex = nextIndex;
    }
  } else {
    // 역방향
    let currentIndex = fromIndex;
    for (let i = 0; i < backwardDistance; i++) {
      const nextIndex = currentIndex === 0 ? totalStations - 1 : currentIndex - 1;
      const duration = getDuration(line.stationIds[currentIndex], line.stationIds[nextIndex]);
      totalDuration += duration !== null ? duration : 5;
      currentIndex = nextIndex;
    }
  }

  return totalDuration;
}

/**
 * 환승역에서 다음 노선의 다음 출발 시각 계산
 *
 * @param line - 다음 노선 정보
 * @param arrivalTime - 환승역 도착 시각
 * @param transferStationId - 환승역 ID
 * @returns 다음 출발 시각 (막차 이후면 null)
 */
export function getNextDeparture(line: Line, arrivalTime: Date, transferStationId: string): Date | null {
  if (!line.schedule) {
    return null;
  }

  const { firstDeparture, lastDeparture, intervalMinutes } = line.schedule;

  // 해당 날짜의 첫차/막차 시각
  const firstDepartureTime = applyTimeToDate(arrivalTime, firstDeparture);
  const lastDepartureTime = applyTimeToDate(arrivalTime, lastDeparture);

  // 노선의 출발역 (stationIds[0])
  const lineStartStationId = line.stationIds[0];

  // 노선 출발역에서 환승역까지의 소요시간
  const timeToTransferStation = calculateTimeToStation(line, lineStartStationId, transferStationId);

  // 환승역 최소 도착 가능 시각 (도착 시각 이후여야 함)
  let currentDepartureFromStart = firstDepartureTime;

  while (currentDepartureFromStart <= lastDepartureTime) {
    // 이 차량이 환승역에 도착하는 시각
    const arrivalAtTransferStation = addMinutesToTime(currentDepartureFromStart, timeToTransferStation);

    // 환승역 도착 시각 이후에 오는 차량이면 선택
    if (arrivalAtTransferStation >= arrivalTime) {
      return arrivalAtTransferStation;
    }

    // 다음 배차 시각
    currentDepartureFromStart = addMinutesToTime(currentDepartureFromStart, intervalMinutes);
  }

  // 막차 이후
  return null;
}

/**
 * 대기 시간 계산 (분 단위)
 */
export function calculateWaitTime(arrivalTime: Date, nextDeparture: Date | null): number {
  if (!nextDeparture) {
    return 0;
  }

  const waitTimeMs = nextDeparture.getTime() - arrivalTime.getTime();
  return Math.max(0, Math.round(waitTimeMs / (60 * 1000)));
}
