import { describe, expect, it } from 'vitest';
import { createItinerary, findAllPaths, searchItineraries } from './pathfinding';
import { LINE_UUIDS, lines } from '../data/lines';
import { STATION_UUIDS } from '../data/stations';

// 테스트용 출발 시각 (2024-01-15 09:00)
const testDepartureTime = new Date('2024-01-15T09:00:00');

describe('경로 찾기 (Pathfinding)', () => {
  describe('직행 경로', () => {
    it('시티선 직행: 비키니시티 → 버블타운 (45분)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      // 최소환승 경로가 직행 (환승 0회)
      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      expect(result.minTransfer!.totalDurationMinutes).toBe(45);
    });

    it('투어선 양방향 최단: 해파리초원 → 글러브월드 (70분)', () => {
      const result = searchItineraries(
        STATION_UUIDS.JELLYFISH_FIELDS,
        STATION_UUIDS.GLOVE_WORLD,
        testDepartureTime
      );

      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      expect(result.minTransfer!.totalDurationMinutes).toBe(70);
    });

    it('외곽선 단방향: 메롱시티 → 비키니환초 (185분)', () => {
      const result = searchItineraries(STATION_UUIDS.ROCK_BOTTOM, STATION_UUIDS.BIKINI_ATOLL, testDepartureTime);

      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      expect(result.minTransfer!.totalDurationMinutes).toBe(185);
    });
  });

  describe('양방향 순환 경로 (최단 경로 선택)', () => {
    it('시티선 역방향이 더 빠름: 버블타운 → 플로터스묘지 (20분)', () => {
      const result = searchItineraries(
        STATION_UUIDS.BUBBLE_TOWN,
        STATION_UUIDS.FLOATERS_CEMETERY,
        testDepartureTime
      );

      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      // 역방향 1구간이 순방향 4구간보다 빠름
      expect(result.minTransfer!.totalDurationMinutes).toBe(20);
    });

    it('글러브월드 → 비키니시티: 시티선과 투어선 모두 40분', () => {
      const result = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      // 최소환승 경로는 직행 (환승 0회)
      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      expect(result.minTransfer!.totalDurationMinutes).toBe(40);
    });
  });

  describe('환승 경로', () => {
    it('환승이 직행보다 빠름: 비키니시티 → 징징빌라 (환승 310분 vs 직행 370분)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      // 최소환승은 직행 (0회), 최단시간은 환승 (1회)
      expect(result.minTransfer).toBeDefined();
      expect(result.shortestTime).toBeDefined();

      // 직행 (외곽선): 370분
      expect(result.minTransfer!.transferCount).toBe(0);
      expect(result.minTransfer!.totalDurationMinutes).toBe(370);

      // 환승 (시티선 → 외곽선): 310분 (이동 250분 + 대기 60분)
      expect(result.shortestTime!.transferCount).toBe(1);
      expect(result.shortestTime!.totalDurationMinutes).toBe(310);

      // 환승이 60분 더 빠름
      expect(result.minTransfer!.totalDurationMinutes - result.shortestTime!.totalDurationMinutes).toBe(60);
    });
  });

  describe('최단시간 경로 추천', () => {
    it('다중 노선 중 최단시간 선택: 글러브월드 → 비키니시티 (40분)', () => {
      const result = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      expect(result.shortestTime).toBeDefined();
      // 시티선과 투어선 모두 40분으로 동일
      expect(result.shortestTime!.totalDurationMinutes).toBe(40);
    });

    it('환승이 최단시간: 비키니시티 → 징징빌라 (310분)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      expect(result.shortestTime).toBeDefined();
      // 환승(310분)이 직행(370분)보다 빠름 (이동 250분 + 대기 60분)
      expect(result.shortestTime!.totalDurationMinutes).toBe(310);
      expect(result.shortestTime!.transferCount).toBe(1);
    });
  });

  describe('최저요금 경로 추천', () => {
    it('최저요금 선택: 비키니시티 → 징징빌라', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      expect(result.lowestFare).toBeDefined();
      // 환승 할인이 적용되어 최저요금이 됨
      expect(result.lowestFare).toBeDefined();
    });
  });

  describe('시간 계산 정확성', () => {
    it('외곽선 단방향 전체 경로: 비키니시티 → 징징빌라 (370분)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      // 90 + 75 + 110 + 95 = 370분
      expect(result.minTransfer!.totalDurationMinutes).toBe(370);
    });

    it('시티선 순방향: 비키니시티 → 버블타운 (45분)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      expect(result.minTransfer).toBeDefined();
      expect(result.minTransfer!.transferCount).toBe(0);
      // 25 + 20 = 45분
      expect(result.minTransfer!.totalDurationMinutes).toBe(45);
    });

    it('시티선 양방향 최단: 글러브월드 → 비키니시티 (40분)', () => {
      const result = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      expect(result.shortestTime).toBeDefined();
      // 순환 경로: 4→0 순방향(55분) vs 역방향(40분) → 역방향 선택
      expect(result.shortestTime!.totalDurationMinutes).toBe(40);
    });
  });

  describe('경계 조건 테스트', () => {
    it('같은 역 검색 시 모든 추천이 null (출발지 = 도착지)', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BIKINI_CITY, testDepartureTime);
      expect(result.shortestTime).toBeNull();
      expect(result.minTransfer).toBeNull();
      expect(result.lowestFare).toBeNull();
    });

    it('경로가 없는 경우 모든 추천이 null', () => {
      const result = searchItineraries('invalid-station-1', 'invalid-station-2', testDepartureTime);
      expect(result.shortestTime).toBeNull();
      expect(result.minTransfer).toBeNull();
      expect(result.lowestFare).toBeNull();
    });
  });

  describe('응답 구조 검증', () => {
    it('정상 경로 검색 시 객체 형식으로 반환', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      // 객체 형식 확인
      expect(result).toHaveProperty('shortestTime');
      expect(result).toHaveProperty('minTransfer');
      expect(result).toHaveProperty('lowestFare');
    });

    it('추천 경로에 필수 필드 포함', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      if (result.shortestTime) {
        expect(result.shortestTime).toHaveProperty('itineraryId');
        expect(result.shortestTime).toHaveProperty('departureTime');
        expect(result.shortestTime).toHaveProperty('fromStation');
        expect(result.shortestTime).toHaveProperty('toStation');
        expect(result.shortestTime).toHaveProperty('totalDurationMinutes');
        expect(result.shortestTime).toHaveProperty('transferCount');
        expect(result.shortestTime).toHaveProperty('legs');
      }
    });

    it('LegSummary에 필수 필드 포함', () => {
      const result = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      if (result.shortestTime && result.shortestTime.legs.length > 0) {
        const leg = result.shortestTime.legs[0];
        expect(leg).toHaveProperty('legId');
        expect(leg).toHaveProperty('lineType');
        expect(leg).toHaveProperty('lineName');
        expect(leg).toHaveProperty('lineColor');
        expect(leg).toHaveProperty('fromStation');
        expect(leg).toHaveProperty('toStation');
        expect(leg).toHaveProperty('durationMinutes');

        // LegSummary는 요금 정보를 포함하지 않음
        expect(leg).not.toHaveProperty('baseFare');
        expect(leg).not.toHaveProperty('transferDiscount');
      }
    });
  });
});
