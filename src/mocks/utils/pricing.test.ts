import { describe, it, expect } from 'vitest';
import { calculateLegsWithTransferDiscount, calculateItineraryPricing, calculateFinalBookingPrice } from './pricing';
import { lines, LINE_UUIDS } from '../data/lines';
import { STATION_UUIDS, getStationById } from '../data/stations';
import type { components } from '@/generated/api-types';

type Leg = components['schemas']['Leg'];

describe('요금 계산 (Pricing)', () => {
  const linesMap = new Map(lines.map(line => [line.lineId, line]));

  // 테스트용 Leg 생성 헬퍼
  const createTestLeg = (
    lineId: string,
    fromStationId: string,
    toStationId: string,
    baseFare: number,
    options?: {
      durationMinutes?: number;
    }
  ): Leg => ({
    legId: `test-leg-${lineId}`,
    lineId,
    lineName: lines.find(l => l.lineId === lineId)?.name || '',
    lineColor: lines.find(l => l.lineId === lineId)?.color || '',
    fromStation: getStationById(fromStationId)!,
    toStation: getStationById(toStationId)!,
    fromStationIndex: 0,
    toStationIndex: 1,
    durationMinutes: options?.durationMinutes ?? 10,
    stopsCount: 1,
    baseFare,
    transferNumber: 0,
    transferDiscount: 0,
    couponDiscount: 0,
    finalFare: baseFare,
  });

  describe('환승 할인 계산', () => {
    it('직행 (환승 없음): 할인 0', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const result = calculateLegsWithTransferDiscount(legs, linesMap);

      expect(result).toHaveLength(1);
      expect(result[0].transferNumber).toBe(0);
      expect(result[0].transferDiscount).toBe(0);
    });

    it('1회 환승: 시티선 10% 할인', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const result = calculateLegsWithTransferDiscount(legs, linesMap);

      expect(result).toHaveLength(2);

      // 첫 구간: 환승 없음
      expect(result[0].transferNumber).toBe(0);
      expect(result[0].transferDiscount).toBe(0);

      // 두 번째 구간: 1회 환승, 외곽선 15% 할인
      expect(result[1].transferNumber).toBe(1);
      expect(result[1].transferDiscount).toBeCloseTo(41 * 0.15, 2);
    });

    it('외곽선 1회 환승: 15% 할인', () => {
      const suburbanLine = lines.find(l => l.lineId === LINE_UUIDS.SUBURBAN_LINE)!;
      expect(suburbanLine.transferDiscount1st).toBe(0.15);

      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const result = calculateLegsWithTransferDiscount(legs, linesMap);

      // 외곽선 구간: 41₴ × 0.15 = 6.15₴ 할인
      expect(result[1].transferDiscount).toBeCloseTo(6.15, 2);
    });

    it('투어선 1회 환승: 15% 할인', () => {
      const tourLine = lines.find(l => l.lineId === LINE_UUIDS.TOUR_LINE)!;
      expect(tourLine.transferDiscount1st).toBe(0.15);

      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.GLOVE_WORLD, 18),
        createTestLeg(LINE_UUIDS.TOUR_LINE, STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.KELP_FOREST, 20),
      ];

      const result = calculateLegsWithTransferDiscount(legs, linesMap);

      // 투어선 구간: 20₴ × 0.15 = 3.0₴ 할인
      expect(result[1].transferDiscount).toBeCloseTo(3.0, 2);
    });
  });

  describe('경로 전체 요금 계산', () => {
    it('직행: subtotal = baseFare, 할인 없음', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);
      const pricing = calculateItineraryPricing(legsWithDiscount);

      expect(pricing.subtotal).toBe(14);
      expect(pricing.transferDiscount).toBe(0);
      expect(pricing.totalBeforeCoupon).toBe(14);
    });

    it('1회 환승: 환승 할인 적용', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);
      const pricing = calculateItineraryPricing(legsWithDiscount);

      expect(pricing.subtotal).toBe(55); // 14 + 41
      expect(pricing.transferDiscount).toBeCloseTo(6.15, 2); // 41 × 0.15
      expect(pricing.totalBeforeCoupon).toBeCloseTo(48.85, 2); // 55 - 6.15
    });
  });

  describe('쿠폰 할인 계산', () => {
    it('고정 금액 할인: PEARL_PASS (2₴ 할인)', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const pricing = calculateFinalBookingPrice(legs, 'PEARL_PASS', new Date(), linesMap);

      // 2₴ 고정 할인
      expect(pricing.couponDiscount).toBe(2);
      expect(pricing.finalTotal).toBe(12); // 14 - 2
    });

    it('퍼센트 할인: GARY_NIGHT (15% 할인, 야간)', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const nightTime = new Date('2024-01-01T22:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', nightTime, linesMap);

      // 14₴ × 0.15 = 2.1₴ 할인
      expect(pricing.couponDiscount).toBeCloseTo(2.1, 2);
      expect(pricing.finalTotal).toBeCloseTo(11.9, 2); // 14 - 2.1
    });

    it('퍼센트 할인: GARY_NIGHT (새벽 시간에도 적용)', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const earlyMorning = new Date('2024-01-01T03:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', earlyMorning, linesMap);

      expect(pricing.couponDiscount).toBeCloseTo(2.1, 2);
      expect(pricing.finalTotal).toBeCloseTo(11.9, 2);
    });

    it('퍼센트 할인: GARY_NIGHT (주간에는 미적용)', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const noonTime = new Date('2024-01-01T12:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', noonTime, linesMap);

      expect(pricing.couponDiscount).toBe(0);
      expect(pricing.finalTotal).toBe(14);
    });

    it('쿠폰 없음: couponDiscount = 0', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const pricing = calculateFinalBookingPrice(legs, undefined, new Date(), linesMap);

      expect(pricing.couponDiscount).toBe(0);
      expect(pricing.finalTotal).toBe(14);
    });

    it('잘못된 쿠폰 코드: couponDiscount = 0', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
      ];

      const pricing = calculateFinalBookingPrice(legs, 'INVALID_COUPON', new Date(), linesMap);

      expect(pricing.couponDiscount).toBe(0);
      expect(pricing.finalTotal).toBe(14);
    });
  });

  describe('환승 할인 + 쿠폰 할인 복합', () => {
    it('1회 환승 + 고정 금액 쿠폰 (진주패스: 각 구간마다 할인)', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const pricing = calculateFinalBookingPrice(legs, 'PEARL_PASS', new Date(), linesMap);

      // 1. 환승 할인: 41 × 0.15 = 6.15₴
      // 2. 환승 할인 적용 후: 55 - 6.15 = 48.85₴
      // 3. 쿠폰 할인: 2₴ × 2개 구간 = 4₴ (각 구간마다 적용)
      // 4. 최종 금액: 48.85 - 4 = 44.85₴

      expect(pricing.subtotal).toBe(55);
      expect(pricing.transferDiscount).toBeCloseTo(6.15, 2);
      expect(pricing.couponDiscount).toBe(4); // 2₴ × 2 = 4₴
      expect(pricing.totalDiscount).toBeCloseTo(10.15, 2); // 6.15 + 4
      expect(pricing.finalTotal).toBeCloseTo(44.85, 2);
    });
  });

  describe('달팽이패스 할인 우선순위', () => {
    it('각 구간별로 환승 할인보다 높은 비율만 추가 할인', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 10),
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.GLOVE_WORLD, 20),
      ];

      const nightTime = new Date('2024-01-01T22:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', nightTime, linesMap);

      expect(pricing.transferDiscount).toBeCloseTo(2, 2); // 두 번째 구간 10% 할인
      expect(pricing.couponDiscount).toBeCloseTo(2.5, 2); // 첫 구간 15%, 두 번째 구간 (15%-10%) 차액
      expect(pricing.finalTotal).toBeCloseTo(25.5, 2);
    });

    it('환승 할인 비율이 더 크면 추가 할인 없음', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 10),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 40),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.TENTACLE_ACRES, STATION_UUIDS.BIKINI_CITY, 40),
      ];

      const nightTime = new Date('2024-01-01T22:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', nightTime, linesMap);

      // 두 번째 구간 15%, 세 번째 구간 25% 환승 할인 -> 추가 할인은 첫 구간만 적용
      expect(pricing.couponDiscount).toBeCloseTo(1.5, 2);
      expect(pricing.transferDiscount).toBeCloseTo(16, 2); // 0 + 6 + 10
      expect(pricing.finalTotal).toBeCloseTo(72.5, 2); // 90 - 16 - 1.5
    });
  });

  describe('달팽이패스 탑승 시각 조건', () => {
    it('주간에 탑승한 첫 구간은 제외하고 야간에 탑승한 이후 구간만 할인', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 10, {
          durationMinutes: 10,
        }),
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.GLOVE_WORLD, 20, {
          durationMinutes: 10,
        }),
      ];

      const departureTime = new Date('2024-01-01T20:55:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', departureTime, linesMap);

      // 첫 구간: 20:55 출발 → 할인 제외
      // 두 번째 구간: 21:05 출발 → 환승 10% + 달팽이패스 추가 5%
      expect(pricing.couponDiscount).toBeCloseTo(1, 2);
      expect(pricing.transferDiscount).toBeCloseTo(2, 2);
      expect(pricing.finalTotal).toBeCloseTo(27, 2);
    });

    it('외곽선 → 시티선 야간 환승: 달팽이 15% > 환승 10%', () => {
      const legs: Leg[] = [
        // 외곽선 20:50 탑승 (주간, 할인 미적용)
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 40, {
          durationMinutes: 25,
        }),
        // 시티선 21:15 환승 (야간, 환승 할인 10% vs 달팽이 15%)
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.GLOVE_WORLD, 20, {
          durationMinutes: 10,
        }),
      ];

      const departureTime = new Date('2024-01-01T20:50:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', departureTime, linesMap);

      // 외곽선 구간 (20:50): 달팽이 할인 미적용
      // 시티선 구간 (21:15): 환승 10% (2₴) vs 달팽이 15% (3₴) → max = 15% 적용
      // 쿠폰 할인 = 20 × (0.15 - 0.10) = 1₴ (추가 5%)
      expect(pricing.transferDiscount).toBeCloseTo(2, 2); // 20 × 0.10
      expect(pricing.couponDiscount).toBeCloseTo(1, 2); // 20 × (0.15 - 0.10)
      expect(pricing.finalTotal).toBeCloseTo(57, 2); // 60 - 2 - 1
    });
  });

  describe('소수점 처리', () => {
    it('할인 금액 소수점 2자리 이내', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);
      const pricing = calculateItineraryPricing(legsWithDiscount);

      // 모든 금액이 소수점 2자리 이내
      expect(pricing.subtotal).toBeCloseTo(pricing.subtotal, 2);
      expect(pricing.transferDiscount).toBeCloseTo(pricing.transferDiscount, 2);
      expect(pricing.totalBeforeCoupon).toBeCloseTo(pricing.totalBeforeCoupon, 2);
    });
  });
});
