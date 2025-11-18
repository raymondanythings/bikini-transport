import { describe, it, expect } from 'vitest';
import { getNextDeparture, calculateWaitTime, parseTimeString, applyTimeToDate, addMinutesToTime } from './schedule-utils';
import { lines, LINE_UUIDS } from '../data/lines';
import { STATION_UUIDS } from '../data/stations';

describe('배차 시간표 계산 (Schedule Utils)', () => {
  describe('시간 파싱 및 조작', () => {
    it('시간 문자열 파싱: "06:30" → { hours: 6, minutes: 30 }', () => {
      const result = parseTimeString('06:30');
      expect(result).toEqual({ hours: 6, minutes: 30 });
    });

    it('날짜에 시간 적용', () => {
      const baseDate = new Date('2024-01-15T00:00:00');
      const result = applyTimeToDate(baseDate, '09:30');

      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(30);
    });

    it('시간에 분 추가', () => {
      const baseTime = new Date('2024-01-15T09:00:00');
      const result = addMinutesToTime(baseTime, 45);

      expect(result.getHours()).toBe(9);
      expect(result.getMinutes()).toBe(45);
    });
  });

  describe('환승역 다음 출발 시각 계산', () => {
    const cityLine = lines.find((line) => line.lineId === LINE_UUIDS.CITY_LINE)!;
    const suburbanLine = lines.find((line) => line.lineId === LINE_UUIDS.SUBURBAN_LINE)!;

    it('시티선: 첫차 시각 이전 도착 → 첫차 대기', () => {
      // 06:00에 비키니시티(환승역)에 도착 → 시티선 첫차 06:30
      const arrivalTime = new Date('2024-01-15T06:00:00');
      const nextDeparture = getNextDeparture(cityLine, arrivalTime, STATION_UUIDS.BIKINI_CITY);

      expect(nextDeparture).not.toBeNull();
      expect(nextDeparture!.getHours()).toBe(6);
      expect(nextDeparture!.getMinutes()).toBe(30);
    });

    it('시티선: 배차 간격 중간 도착 → 다음 차량 대기', () => {
      // 07:10에 버블타운 도착 → 다음 차량은 버블타운 07:20 통과
      const arrivalTime = new Date('2024-01-15T07:10:00');
      const nextDeparture = getNextDeparture(cityLine, arrivalTime, STATION_UUIDS.BUBBLE_TOWN);

      expect(nextDeparture).not.toBeNull();
      // 대기 시간 계산 확인
      const waitTime = calculateWaitTime(arrivalTime, nextDeparture);
      expect(waitTime).toBeGreaterThan(0);
      expect(waitTime).toBeLessThanOrEqual(15); // 배차 간격 이내
    });

    it('외곽선: 90분 배차 간격 고려', () => {
      // 07:00에 버블타운 도착 → 다음 차량 대기
      const arrivalTime = new Date('2024-01-15T07:00:00');
      const nextDeparture = getNextDeparture(suburbanLine, arrivalTime, STATION_UUIDS.BUBBLE_TOWN);

      expect(nextDeparture).not.toBeNull();
      const waitTime = calculateWaitTime(arrivalTime, nextDeparture);
      expect(waitTime).toBeGreaterThan(0);
      expect(waitTime).toBeLessThanOrEqual(90); // 배차 간격 이내
    });

    it('막차 이후 도착 → null 반환', () => {
      // 23:00에 비키니시티 도착 → 시티선 막차 23:30 이후
      const arrivalTime = new Date('2024-01-15T23:31:00');
      const nextDeparture = getNextDeparture(cityLine, arrivalTime, STATION_UUIDS.BIKINI_CITY);

      expect(nextDeparture).toBeNull();
    });
  });

  describe('대기 시간 계산', () => {
    it('다음 출발 시각까지 대기 시간 (분 단위)', () => {
      const arrivalTime = new Date('2024-01-15T09:00:00');
      const nextDeparture = new Date('2024-01-15T09:15:00');

      const waitTime = calculateWaitTime(arrivalTime, nextDeparture);
      expect(waitTime).toBe(15);
    });

    it('이미 출발한 차량은 대기 시간 0', () => {
      const arrivalTime = new Date('2024-01-15T09:00:00');
      const nextDeparture = new Date('2024-01-15T08:50:00');

      const waitTime = calculateWaitTime(arrivalTime, nextDeparture);
      expect(waitTime).toBe(0);
    });

    it('다음 출발 시각 null → 대기 시간 0', () => {
      const arrivalTime = new Date('2024-01-15T09:00:00');

      const waitTime = calculateWaitTime(arrivalTime, null);
      expect(waitTime).toBe(0);
    });
  });

  describe('실전 시나리오', () => {
    const suburbanLine = lines.find((line) => line.lineId === LINE_UUIDS.SUBURBAN_LINE)!;

    it('시나리오: 시티선 06:30 출발 → 버블타운 07:15 도착 → 외곽선 대기', () => {
      // 사용자가 제시한 시나리오
      // 시티선 06:30 출발 → 플로터스묘지(25분) → 버블타운(20분) = 07:15 도착
      const arrivalAtBubbleTown = new Date('2024-01-15T07:15:00');

      // 외곽선 다음 차량 계산
      const nextDeparture = getNextDeparture(suburbanLine, arrivalAtBubbleTown, STATION_UUIDS.BUBBLE_TOWN);

      expect(nextDeparture).not.toBeNull();

      // 대기 시간 계산
      const waitTime = calculateWaitTime(arrivalAtBubbleTown, nextDeparture);

      // 외곽선 첫차: 05:00 비키니시티 출발
      // 05:00 → 메롱시티(+90분) → 버블타운(+75분) = 07:45 도착
      // 대기 시간: 07:45 - 07:15 = 30분
      expect(waitTime).toBe(30);
    });
  });
});
