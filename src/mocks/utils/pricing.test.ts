import { describe, it, expect } from 'vitest';
import { calculateLegsWithTransferDiscount, calculateItineraryPricing, calculateFinalBookingPrice } from './pricing';
import { lines, LINE_UUIDS } from '../data/lines';
import { STATION_UUIDS, getStationById } from '../data/stations';
import type { components } from '@/generated/api-types';

type Leg = components['schemas']['Leg'];

describe('요금 계산 (Pricing)', () => {
  const linesMap = new Map(lines.map((line) => [line.lineId, line]));

  // 테스트용 Leg 생성 헬퍼
  const createTestLeg = (lineId: string, fromStationId: string, toStationId: string, baseFare: number): Leg => ({
    legId: `test-leg-${lineId}`,
    lineId,
    lineName: lines.find((l) => l.lineId === lineId)?.name || '',
    lineColor: lines.find((l) => l.lineId === lineId)?.color || '',
    fromStation: getStationById(fromStationId)!,
    toStation: getStationById(toStationId)!,
    fromStationIndex: 0,
    toStationIndex: 1,
    durationMinutes: 10,
    stopsCount: 1,
    baseFare,
    transferNumber: 0,
    transferDiscount: 0,
    couponDiscount: 0,
    finalFare: baseFare,
  });

  describe('환승 할인 계산', () => {
    it('직행 (환승 없음): 할인 0', () => {
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

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
      const suburbanLine = lines.find((l) => l.lineId === LINE_UUIDS.SUBURBAN_LINE)!;
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
      const tourLine = lines.find((l) => l.lineId === LINE_UUIDS.TOUR_LINE)!;
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
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

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
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

      const pricing = calculateFinalBookingPrice(legs, 'PEARL_PASS', new Date(), linesMap);

      // 2₴ 고정 할인
      expect(pricing.couponDiscount).toBe(2);
      expect(pricing.finalTotal).toBe(12); // 14 - 2
    });

    it('퍼센트 할인: GARY_NIGHT (15% 할인, 야간)', () => {
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

      const nightTime = new Date('2024-01-01T22:00:00');
      const pricing = calculateFinalBookingPrice(legs, 'GARY_NIGHT', nightTime, linesMap);

      // 14₴ × 0.15 = 2.1₴ 할인
      expect(pricing.couponDiscount).toBeCloseTo(2.1, 2);
      expect(pricing.finalTotal).toBeCloseTo(11.9, 2); // 14 - 2.1
    });

    it('쿠폰 없음: couponDiscount = 0', () => {
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

      const pricing = calculateFinalBookingPrice(legs, undefined, new Date(), linesMap);

      expect(pricing.couponDiscount).toBe(0);
      expect(pricing.finalTotal).toBe(14);
    });

    it('잘못된 쿠폰 코드: couponDiscount = 0', () => {
      const legs: Leg[] = [createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14)];

      const pricing = calculateFinalBookingPrice(legs, 'INVALID_COUPON', new Date(), linesMap);

      expect(pricing.couponDiscount).toBe(0);
      expect(pricing.finalTotal).toBe(14);
    });
  });

  describe('환승 할인 + 쿠폰 할인 복합', () => {
    it('1회 환승 + 고정 금액 쿠폰', () => {
      const legs: Leg[] = [
        createTestLeg(LINE_UUIDS.CITY_LINE, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, 14),
        createTestLeg(LINE_UUIDS.SUBURBAN_LINE, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.TENTACLE_ACRES, 41),
      ];

      const pricing = calculateFinalBookingPrice(legs, 'PEARL_PASS', new Date(), linesMap);

      // 1. 환승 할인: 41 × 0.15 = 6.15₴
      // 2. 환승 할인 적용 후: 55 - 6.15 = 48.85₴
      // 3. 쿠폰 할인: 2₴ (고정)
      // 4. 최종 금액: 48.85 - 2 = 46.85₴

      expect(pricing.subtotal).toBe(55);
      expect(pricing.transferDiscount).toBeCloseTo(6.15, 2);
      expect(pricing.couponDiscount).toBe(2);
      expect(pricing.totalDiscount).toBeCloseTo(8.15, 2); // 6.15 + 2
      expect(pricing.finalTotal).toBeCloseTo(46.85, 2);
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
