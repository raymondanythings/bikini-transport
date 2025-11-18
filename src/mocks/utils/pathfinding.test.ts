import { describe, it, expect } from 'vitest';
import { searchItineraries, findAllPaths, createItinerary } from './pathfinding';
import { STATION_UUIDS } from '../data/stations';
import { lines, LINE_UUIDS } from '../data/lines';

// 테스트용 출발 시각 (2024-01-15 09:00)
const testDepartureTime = new Date('2024-01-15T09:00:00');

describe('경로 찾기 (Pathfinding)', () => {
  describe('직행 경로', () => {
    it('시티선 직행: 비키니시티 → 버블타운 (45분, 10₴)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      expect(itineraries.length).toBeGreaterThan(0);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();
      expect(direct!.totalDurationMinutes).toBe(45);
      expect(direct!.legs[0].baseFare).toBe(10);
    });

    it('투어선 양방향 최단: 해파리초원 → 글러브월드 (70분, 15₴)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.JELLYFISH_FIELDS, STATION_UUIDS.GLOVE_WORLD, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();
      expect(direct!.totalDurationMinutes).toBe(70);
      expect(direct!.legs[0].baseFare).toBe(15);
      expect(direct!.legs[0].lineId).toBe(LINE_UUIDS.TOUR_LINE);
    });

    it('외곽선 단방향: 메롱시티 → 비키니환초 (185분, 25₴)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.ROCK_BOTTOM, STATION_UUIDS.BIKINI_ATOLL, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();
      expect(direct!.totalDurationMinutes).toBe(185);
      expect(direct!.legs[0].baseFare).toBe(25);
      expect(direct!.legs[0].lineId).toBe(LINE_UUIDS.SUBURBAN_LINE);
    });
  });

  describe('양방향 순환 경로 (최단 경로 선택)', () => {
    it('시티선 역방향이 더 빠름: 버블타운 → 플로터스묘지 (20분, 10₴)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.FLOATERS_CEMETERY, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0 && it.legs[0].lineId === LINE_UUIDS.CITY_LINE);
      expect(direct).toBeDefined();
      // 역방향 1구간이 순방향 4구간보다 빠름
      expect(direct!.totalDurationMinutes).toBe(20);
      expect(direct!.legs[0].baseFare).toBe(10);
    });

    it('글러브월드 → 비키니시티: 시티선과 투어선 모두 40분', () => {
      const itineraries = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      // 시티선과 투어선 모두 40분으로 동일 (둘 다 가능)
      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();
      expect(direct!.totalDurationMinutes).toBe(40);
    });
  });

  describe('환승 경로', () => {
    it('환승이 직행보다 빠름: 비키니시티 → 징징빌라 (환승 310분 vs 직행 370분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      expect(itineraries.length).toBeGreaterThan(1);

      const direct = itineraries.find((it) => it.transferCount === 0);
      const transfer = itineraries.find((it) => it.transferCount === 1);

      expect(direct).toBeDefined();
      expect(transfer).toBeDefined();

      // 직행 (외곽선): 370분
      expect(direct!.totalDurationMinutes).toBe(370);

      // 환승 (시티선 → 외곽선): 310분 (이동 250분 + 대기 60분)
      expect(transfer!.totalDurationMinutes).toBe(310);

      // 환승이 60분 더 빠름
      expect(direct!.totalDurationMinutes - transfer!.totalDurationMinutes).toBe(60);
    });

    it('환승 할인 적용: 시티선 → 외곽선', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const transfer = itineraries.find((it) => it.transferCount === 1);
      expect(transfer).toBeDefined();

      // 환승 구간의 할인 확인
      const leg2 = transfer!.legs[1];
      expect(leg2.transferNumber).toBe(1);
      expect(leg2.transferDiscount).toBeGreaterThan(0);

      // 전체 요금이 할인 적용됨
      expect(transfer!.pricing.transferDiscount).toBeGreaterThan(0);
    });
  });

  describe('최단시간 경로 추천', () => {
    it('다중 노선 중 최단시간 선택: 글러브월드 → 비키니시티 (40분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      const shortest = itineraries.find((it) => it.recommendationTypes.includes('SHORTEST_TIME'));
      expect(shortest).toBeDefined();

      // 시티선과 투어선 모두 40분으로 동일
      expect(shortest!.totalDurationMinutes).toBe(40);
    });

    it('환승이 최단시간: 비키니시티 → 징징빌라 (310분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const shortest = itineraries.find((it) => it.recommendationTypes.includes('SHORTEST_TIME'));
      expect(shortest).toBeDefined();

      // 환승(310분)이 직행(370분)보다 빠름 (이동 250분 + 대기 60분)
      expect(shortest!.totalDurationMinutes).toBe(310);
      expect(shortest!.transferCount).toBe(1);
    });
  });

  describe('최저요금 경로 추천', () => {
    it('최저요금 선택: 비키니시티 → 징징빌라', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const lowestFare = itineraries.find((it) => it.recommendationTypes.includes('LOWEST_FARE'));
      expect(lowestFare).toBeDefined();

      // 환승 할인으로 인해 환승이 더 저렴함
      expect(lowestFare!.pricing.totalBeforeCoupon).toBeLessThan(41); // 직행 요금 (25 + 2×8)
    });
  });

  describe('시간 계산 정확성', () => {
    it('외곽선 단방향 전체 경로: 비키니시티 → 징징빌라 (370분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 90 + 75 + 110 + 95 = 370분
      expect(direct!.totalDurationMinutes).toBe(370);
    });

    it('시티선 순방향: 비키니시티 → 버블타운 (45분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 25 + 20 = 45분
      expect(direct!.totalDurationMinutes).toBe(45);
    });

    it('시티선 양방향 최단: 글러브월드 → 비키니시티 (40분)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY, testDepartureTime);

      const cityLine = itineraries.find(
        (it) => it.transferCount === 0 && it.legs[0].lineId === LINE_UUIDS.CITY_LINE
      );
      expect(cityLine).toBeDefined();

      // 순환 경로: 4→0 순방향(55분) vs 역방향(40분) → 역방향 선택
      expect(cityLine!.totalDurationMinutes).toBe(40);
    });
  });

  describe('요금 계산 정확성', () => {
    it('시티선: 기본 10₴ + 정거장당 2₴ (2정거장까지 무료)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 2정거장 이동: 10 + max(0, 2-2) × 2 = 10₴
      expect(direct!.legs[0].baseFare).toBe(10);
    });

    it('시티선: 양방향 순환으로 최단 경로 선택 (비키니시티 → 뉴켈프시티)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.NEW_KELP_CITY, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 순방향: 0→1→2→3 (3정거장)
      // 역방향: 0→4→3 (2정거장) ✓ 더 짧음
      // 2정거장 이동: 10 + max(0, 2-2) × 2 = 10₴
      expect(direct!.legs[0].baseFare).toBe(10);
    });

    it('외곽선: 기본 25₴ + 정거장당 8₴ (2정거장까지 무료)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.ROCK_BOTTOM, STATION_UUIDS.BIKINI_ATOLL, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 2정거장 이동: 25 + max(0, 2-2) × 8 = 25₴
      expect(direct!.legs[0].baseFare).toBe(25);
    });

    it('외곽선: 4정거장 이동 시 추가요금 (비키니시티 → 징징빌라)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0);
      expect(direct).toBeDefined();

      // 4정거장 이동: 25 + max(0, 4-2) × 8 = 25 + 2×8 = 41₴
      expect(direct!.legs[0].baseFare).toBe(41);
    });

    it('투어선: 기본 15₴ + 정거장당 5₴ (2정거장까지 무료)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.JELLYFISH_FIELDS, STATION_UUIDS.GLOVE_WORLD, testDepartureTime);

      const direct = itineraries.find((it) => it.transferCount === 0 && it.legs[0].lineId === LINE_UUIDS.TOUR_LINE);
      expect(direct).toBeDefined();

      // 2정거장 이동 (최단경로): 15 + max(0, 2-2) × 5 = 15₴
      expect(direct!.legs[0].baseFare).toBe(15);
    });
  });

  describe('경계 조건 테스트', () => {
    it('같은 역 검색 시 빈 배열 반환 (출발지 = 도착지)', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BIKINI_CITY, testDepartureTime);
      expect(itineraries).toEqual([]);
      expect(itineraries.length).toBe(0);
    });

    it('경로가 없는 경우 빈 배열 반환', () => {
      const itineraries = searchItineraries('invalid-station-1', 'invalid-station-2', testDepartureTime);
      expect(itineraries).toEqual([]);
    });

    it('최대 3개의 추천 경로만 반환', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);
      expect(itineraries.length).toBeLessThanOrEqual(3);
    });
  });

  describe('추천 타입 정확성', () => {
    it('모든 추천 경로에 추천 타입이 있음', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      itineraries.forEach((itinerary) => {
        expect(itinerary.recommendationTypes.length).toBeGreaterThan(0);
      });
    });

    it('SHORTEST_TIME, MIN_TRANSFER, LOWEST_FARE 중 하나 이상 포함', () => {
      const itineraries = searchItineraries(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, testDepartureTime);

      const hasShortestTime = itineraries.some((it) => it.recommendationTypes.includes('SHORTEST_TIME'));
      const hasMinTransfer = itineraries.some((it) => it.recommendationTypes.includes('MIN_TRANSFER'));
      const hasLowestFare = itineraries.some((it) => it.recommendationTypes.includes('LOWEST_FARE'));

      expect(hasShortestTime).toBe(true);
      expect(hasMinTransfer).toBe(true);
      expect(hasLowestFare).toBe(true);
    });
  });
});
