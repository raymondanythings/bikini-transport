import type { components } from '@/generated/api-types';

type CouponDefinition = components['schemas']['CouponDefinition'];

/**
 * 쿠폰 코드 상수
 */
export const COUPON_CODES = {
  PEARL_PASS: 'PEARL_PASS' as const,
  GARY_NIGHT: 'GARY_NIGHT' as const,
  TOUR_FUN: 'TOUR_FUN' as const,
};

/**
 * 쿠폰 정의
 *
 * 3가지 쿠폰:
 * 1. 진주패스 - 모든 노선 기본요금 2₴ 할인
 * 2. 달팽이패스 - 21시 이후 전체 요금 40% 할인
 * 3. 투어패스 - 투어선 전용 30% 할인
 */
export const couponDefinitions: CouponDefinition[] = [
  {
    couponCode: COUPON_CODES.PEARL_PASS,
    name: '진주패스',
    description: '모든 노선 기본요금 2₴ 할인',
    emoji: '🦪',
    discountType: 'FIXED_AMOUNT',
    discountValue: 2.0,
    maxOwnedCount: 3,
  },
  {
    couponCode: COUPON_CODES.GARY_NIGHT,
    name: '달팽이패스',
    description: '21시 이후 모든 요금 40% 할인',
    emoji: '🐌',
    discountType: 'PERCENTAGE',
    discountValue: 0.4, // 40%
    maxOwnedCount: 2,
    timeCondition: {
      afterHour: 21,
    },
  },
  {
    couponCode: COUPON_CODES.TOUR_FUN,
    name: '투어패스',
    description: '투어선 전용 30% 할인',
    emoji: '🎢',
    discountType: 'PERCENTAGE',
    discountValue: 0.3, // 30%
    maxOwnedCount: 5,
    applicableLineTypes: ['TOUR'],
  },
];

/**
 * 쿠폰 코드로 쿠폰 정의 조회
 */
export function getCouponDefinition(couponCode: string): CouponDefinition | undefined {
  return couponDefinitions.find((c) => c.couponCode === couponCode);
}

/**
 * 랜덤 쿠폰 선택 (팝업용)
 *
 * 약 10% 확률로 쿠폰 반환
 */
export function getRandomCoupon(): CouponDefinition | null {
  // 10% 확률
  if (Math.random() > 0.1) {
    return null;
  }

  // 랜덤으로 쿠폰 선택
  const randomIndex = Math.floor(Math.random() * couponDefinitions.length);
  return couponDefinitions[randomIndex];
}

/**
 * 쿠폰 시간 조건 체크
 */
export function checkTimeCondition(coupon: CouponDefinition, departureTime: Date): boolean {
  if (!coupon.timeCondition || !coupon.timeCondition.afterHour) {
    return true;
  }

  const hour = departureTime.getHours();
  return hour >= coupon.timeCondition.afterHour;
}

/**
 * 쿠폰 노선 타입 조건 체크
 */
export function checkLineTypeCondition(coupon: CouponDefinition, lineType: 'CITY' | 'SUBURBAN' | 'TOUR'): boolean {
  if (!coupon.applicableLineTypes) {
    return true;
  }

  return coupon.applicableLineTypes.includes(lineType);
}
