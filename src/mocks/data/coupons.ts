import type { components } from '@/generated/api-types';

type CouponDefinition = components['schemas']['CouponDefinition'];
type UserCoupon = components['schemas']['UserCoupon'];
type BaseTimeCondition = NonNullable<CouponDefinition['timeCondition']>;

export type CouponTimeCondition = BaseTimeCondition & {
  beforeHour?: number;
};

export type AppCouponDefinition = Omit<CouponDefinition, 'timeCondition'> & {
  timeCondition?: CouponTimeCondition | null;
  discountValue: number;
  maxOwnedCount: number;
};

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
 */
export const couponDefinitions: AppCouponDefinition[] = [
  {
    couponCode: COUPON_CODES.PEARL_PASS,
    name: '진주(Pearl) 패스',
    description: ['모든 노선에 적용 가능', '중복 할인 시 높은 할인률이 적용됨'],
    discountType: 'FIXED_AMOUNT',
    discountLabel: '기본 요금 2₴ 할인',
    discountValue: 2.0,
    maxOwnedCount: 3,
  },
  {
    couponCode: COUPON_CODES.GARY_NIGHT,
    name: '달팽이 패스',
    description: ['야간(21시 ~ 05시) 탑승 시 15% 요금 할인', '중복 할인 시 높은 할인률이 적용됨'],
    discountType: 'PERCENTAGE',
    discountLabel: '15% 요금 할인',
    discountValue: 0.15,
    maxOwnedCount: 2,
    timeCondition: {
      afterHour: 21,
      beforeHour: 5,
    },
  },
  {
    couponCode: COUPON_CODES.TOUR_FUN,
    name: '투어 패스',
    description: ['투어선 이외의 노선 이용 시 적용 불가', '중복 할인 시 높은 할인률이 적용됨'],
    discountType: 'PERCENTAGE',
    discountLabel: '30% 요금 할인',
    discountValue: 0.3,
    maxOwnedCount: 5,
    applicableLineTypes: ['TOUR'],
  },
];

function toPublicCouponDefinition(coupon: AppCouponDefinition): CouponDefinition {
  const { discountValue: _discountValue, maxOwnedCount: _maxOwnedCount, ...publicCoupon } = coupon;
  return publicCoupon;
}

export function toUserCoupon(coupon: AppCouponDefinition, ownedCount: number): UserCoupon {
  return {
    ...toPublicCouponDefinition(coupon),
    ownedCount,
  };
}

/**
 * 쿠폰 코드로 쿠폰 정의 조회
 */
export function getCouponDefinition(couponCode: string): AppCouponDefinition | undefined {
  return couponDefinitions.find(c => c.couponCode === couponCode);
}

/**
 * 랜덤 쿠폰 선택 (팝업용, UUID 생성)
 *
 * 약 10% 확률로 쿠폰 반환
 */
export function getRandomCoupon(): { coupon: CouponDefinition; uuid: string; expiresAt: Date } | null {
  // 10% 확률
  if (Math.random() > 0.1) {
    return null;
  }

  // 랜덤으로 쿠폰 선택
  const randomIndex = Math.floor(Math.random() * couponDefinitions.length);
  const coupon = couponDefinitions[randomIndex];

  if (!coupon) return null;

  // UUID 생성 및 만료 시간 설정
  const uuid = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60000); // 1분 TTL

  return {
    coupon: toPublicCouponDefinition(coupon),
    uuid,
    expiresAt,
  };
}

/**
 * 쿠폰 시간 조건 체크
 */
export function checkTimeCondition(coupon: AppCouponDefinition, departureTime: Date): boolean {
  if (!coupon.timeCondition) {
    return true;
  }

  const { afterHour, beforeHour } = coupon.timeCondition;
  const hour = departureTime.getHours();

  if (afterHour === undefined && beforeHour === undefined) {
    return true;
  }

  if (afterHour !== undefined && beforeHour !== undefined) {
    if (afterHour <= beforeHour) {
      return hour >= afterHour && hour <= beforeHour;
    }

    return hour >= afterHour || hour <= beforeHour;
  }

  if (afterHour !== undefined) {
    return hour >= afterHour;
  }

  return hour <= beforeHour!;
}

/**
 * 쿠폰 노선 타입 조건 체크
 */
export function checkLineTypeCondition(coupon: AppCouponDefinition, lineType: 'CITY' | 'SUBURB' | 'TOUR'): boolean {
  if (!coupon.applicableLineTypes) {
    return true;
  }

  return coupon.applicableLineTypes.includes(lineType);
}
