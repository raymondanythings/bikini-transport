import type { components } from '@/generated/api-types';
import { COUPON_CODES, checkLineTypeCondition, checkTimeCondition, getCouponDefinition } from '../data/coupons';

type Line = components['schemas']['Line'];
type Leg = components['schemas']['Leg'];

/**
 * 구간별 요금 계산 (환승 할인 적용)
 *
 * @param legs - 전체 구간 목록
 * @param lines - 노선 정보 맵
 * @returns 환승 할인이 적용된 구간 목록
 */
export function calculateLegsWithTransferDiscount(legs: Leg[], linesMap: Map<string, Line>): Leg[] {
  return legs.map((leg, index) => {
    const line = linesMap.get(leg.lineId);
    if (!line) {
      throw new Error(`Line not found: ${leg.lineId}`);
    }

    // 환승 번호 (0: 첫 구간, 1: 1회 환승, 2: 2회 환승, ...)
    const transferNumber = index;

    // 할인율 결정
    let discountRate = 0;
    if (transferNumber === 1) {
      // 1회 환승 (두 번째 구간)
      discountRate = line.transferDiscount1st;
    } else if (transferNumber >= 2) {
      // 2회 이상 환승 (세 번째 구간부터)
      discountRate = line.transferDiscount2nd;
    }

    // 환승 할인 금액 (baseFare에 대해서만 적용)
    const transferDiscount = leg.baseFare * discountRate;

    // 최종 요금 (환승 할인 적용, 쿠폰 할인은 나중에)
    const finalFare = leg.baseFare - transferDiscount;

    return {
      ...leg,
      transferNumber,
      transferDiscount,
      couponDiscount: 0, // 쿠폰 할인은 별도 계산
      finalFare,
    };
  });
}

/**
 * 경로 전체 요금 계산 (환승 할인만 적용)
 */
export function calculateItineraryPricing(legs: Leg[]): {
  subtotal: number;
  transferDiscount: number;
  totalBeforeCoupon: number;
} {
  const subtotal = legs.reduce((sum, leg) => sum + leg.baseFare, 0);
  const transferDiscount = legs.reduce((sum, leg) => sum + leg.transferDiscount, 0);
  const totalBeforeCoupon = subtotal - transferDiscount;

  return {
    subtotal,
    transferDiscount,
    totalBeforeCoupon,
  };
}

/**
 * 쿠폰 할인 금액 계산
 *
 * @param legs - 구간 목록 (환승 할인 적용된 상태)
 * @param couponCode - 적용할 쿠폰 코드
 * @param departureTime - 전체 여정 출발 시간
 * @param legStartTimes - 각 구간별 실제 탑승 시작 시각
 * @returns 쿠폰 할인 금액
 */
export function calculateCouponDiscount(
  legs: Leg[],
  couponCode: string,
  departureTime: Date,
  linesMap: Map<string, Line>,
  legStartTimes?: Date[]
): number {
  const couponDef = getCouponDefinition(couponCode);
  if (!couponDef) {
    return 0;
  }

  const requiresPerLegTimeCheck = couponDef.couponCode === COUPON_CODES.GARY_NIGHT;

  if (!requiresPerLegTimeCheck && !checkTimeCondition(couponDef, departureTime)) {
    return 0;
  }

  let discount = 0;

  switch (couponDef.discountType) {
    case 'FIXED_AMOUNT': {
      // 진주패스: 각 구간(Leg)마다 고정 금액 할인 적용
      // 예: 3개 노선 탑승 시 2₴ × 3 = 6₴ 할인
      discount = legs.reduce((sum, leg) => {
        if (leg.baseFare <= 0) {
          return sum;
        }
        return sum + couponDef.discountValue;
      }, 0);
      break;
    }

    case 'PERCENTAGE': {
      if (requiresPerLegTimeCheck) {
        const couponRate = couponDef.discountValue;
        const startTimes = legStartTimes && legStartTimes.length === legs.length ? legStartTimes : legs.map(() => departureTime);
        discount = legs.reduce((sum, leg, index) => {
          if (leg.baseFare <= 0) {
            return sum;
          }

          const legStartTime = startTimes[index] ?? departureTime;
          if (!checkTimeCondition(couponDef, legStartTime)) {
            return sum;
          }

          const transferRate = leg.transferDiscount > 0 ? leg.transferDiscount / leg.baseFare : 0;
          const extraRate = Math.max(couponRate - transferRate, 0);
          return sum + leg.baseFare * extraRate;
        }, 0);
        break;
      }

      // 달팽이패스 외의 퍼센트 할인 (투어패스 등)
      if (couponDef.applicableLineTypes && couponDef.applicableLineTypes.length > 0) {
        // 투어패스: 특정 노선만 할인
        const applicableLegs = legs.filter((leg) => {
          const line = linesMap.get(leg.lineId);
          if (!line) return false;
          return checkLineTypeCondition(couponDef, line.type);
        });

        discount = applicableLegs.reduce((sum, leg) => sum + leg.finalFare * couponDef.discountValue, 0);
      } else {
        // 기타 퍼센트 쿠폰: 전체 요금 기준
        const totalBeforeCoupon = legs.reduce((sum, leg) => sum + leg.finalFare, 0);
        discount = totalBeforeCoupon * couponDef.discountValue;
      }
      break;
    }
  }

  return discount;
}

/**
 * 최종 예약 가격 계산
 *
 * @param legs - 구간 목록
 * @param couponCode - 쿠폰 코드 (선택)
 * @param departureTime - 출발 시간
 * @param linesMap - 노선 정보 맵
 */
export function calculateFinalBookingPrice(
  legs: Leg[],
  couponCode: string | undefined,
  departureTime: Date,
  linesMap: Map<string, Line>
): {
  subtotal: number;
  transferDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  finalTotal: number;
} {
  // 1. 환승 할인 적용
  const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap);

  // 2. 가격 계산
  const subtotal = legsWithDiscount.reduce((sum, leg) => sum + leg.baseFare, 0);
  const transferDiscount = legsWithDiscount.reduce((sum, leg) => sum + leg.transferDiscount, 0);

  // 3. 쿠폰 할인 계산
  const legStartTimes = buildLegStartTimes(legsWithDiscount, departureTime);
  let couponDiscount = 0;
  if (couponCode) {
    couponDiscount = calculateCouponDiscount(legsWithDiscount, couponCode, departureTime, linesMap, legStartTimes);
  }

  // 4. 총 할인 금액
  const totalDiscount = transferDiscount + couponDiscount;

  // 5. 최종 금액
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  return {
    subtotal,
    transferDiscount,
    couponDiscount,
    totalDiscount,
    finalTotal,
  };
}

/**
 * 금액 반올림 (소수점 2자리)
 */
export function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

function buildLegStartTimes(legs: Leg[], departureTime: Date): Date[] {
  const startTimes: Date[] = [];
  let currentTime = new Date(departureTime);

  for (const leg of legs) {
    startTimes.push(new Date(currentTime));
    const durationMillis = (leg.durationMinutes || 0) * 60 * 1000;
    currentTime = new Date(currentTime.getTime() + durationMillis);
  }

  return startTimes;
}
