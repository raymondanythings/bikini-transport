import type { components } from '@/generated/api-types'
import { calculateExtraFare, getStopsCount } from '../data/lines'
import {
	checkLineTypeCondition,
	checkTimeCondition,
	getCouponDefinition,
} from '../data/coupons'

type Line = components['schemas']['Line']
type Leg = components['schemas']['Leg']
type Coupon = components['schemas']['Coupon']

/**
 * 구간별 요금 계산 (환승 할인 적용)
 *
 * @param legs - 전체 구간 목록
 * @param lines - 노선 정보 맵
 * @returns 환승 할인이 적용된 구간 목록
 */
export function calculateLegsWithTransferDiscount(
	legs: Leg[],
	linesMap: Map<string, Line>,
): Leg[] {
	return legs.map((leg, index) => {
		const line = linesMap.get(leg.lineId)
		if (!line) {
			throw new Error(`Line not found: ${leg.lineId}`)
		}

		// 환승 인덱스 (0: 첫 구간, 1: 1회 환승, 2: 2회 환승, ...)
		const transferIndex = index

		// 할인율 결정
		let discountRate = 0
		if (transferIndex === 1) {
			// 1회 환승 (두 번째 구간)
			discountRate = line.transferDiscount1st
		} else if (transferIndex >= 2) {
			// 2회 이상 환승 (세 번째 구간부터)
			discountRate = line.transferDiscount2nd
		}

		// 할인 전 요금
		const fareBeforeDiscount = leg.baseFare + leg.extraFare

		// 환승 할인 금액
		const transferDiscount = fareBeforeDiscount * discountRate

		// 최종 요금 (환승 할인 적용)
		const finalFare = fareBeforeDiscount - transferDiscount

		return {
			...leg,
			fareBeforeDiscount,
			transferDiscount,
			finalFare,
		}
	})
}

/**
 * 경로 전체 요금 계산 (환승 할인만 적용)
 */
export function calculateItineraryPricing(legs: Leg[]): {
	subtotal: number
	transferDiscount: number
	totalBeforeCoupon: number
} {
	const subtotal = legs.reduce(
		(sum, leg) => sum + leg.fareBeforeDiscount,
		0,
	)
	const transferDiscount = legs.reduce(
		(sum, leg) => sum + leg.transferDiscount,
		0,
	)
	const totalBeforeCoupon = subtotal - transferDiscount

	return {
		subtotal,
		transferDiscount,
		totalBeforeCoupon,
	}
}

/**
 * 쿠폰 할인 금액 계산
 *
 * @param legs - 구간 목록 (환승 할인 적용된 상태)
 * @param couponCode - 적용할 쿠폰 코드
 * @param departureTime - 출발 시간
 * @returns 쿠폰 할인 금액
 */
export function calculateCouponDiscount(
	legs: Leg[],
	couponCode: string,
	departureTime: Date,
	linesMap: Map<string, Line>,
): number {
	const couponDef = getCouponDefinition(couponCode)
	if (!couponDef) {
		return 0
	}

	// 시간 조건 체크
	if (!checkTimeCondition(couponDef, departureTime)) {
		return 0
	}

	let discount = 0

	switch (couponDef.discountType) {
		case 'FIXED_BASE_FARE': {
			// 진주패스: 모든 구간의 기본요금에서 0.5₴ 할인
			discount = legs.length * couponDef.discountValue
			break
		}

		case 'PERCENTAGE_TOTAL': {
			// 달팽이패스: 전체 요금(환승 할인 후)에서 40% 할인
			const totalBeforeCoupon = legs.reduce((sum, leg) => sum + leg.finalFare, 0)
			discount = totalBeforeCoupon * couponDef.discountValue
			break
		}

		case 'PERCENTAGE_LINE': {
			// 투어패스: 특정 노선만 30% 할인
			const applicableLegs = legs.filter((leg) => {
				const line = linesMap.get(leg.lineId)
				if (!line) return false
				return checkLineTypeCondition(couponDef, line.type)
			})

			discount = applicableLegs.reduce(
				(sum, leg) => sum + leg.finalFare * couponDef.discountValue,
				0,
			)
			break
		}
	}

	return discount
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
	linesMap: Map<string, Line>,
): {
	subtotal: number
	transferDiscount: number
	subtotalAfterTransfer: number
	couponDiscount: number
	finalTotal: number
} {
	// 1. 환승 할인 적용
	const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap)

	// 2. 가격 계산
	const subtotal = legsWithDiscount.reduce(
		(sum, leg) => sum + leg.fareBeforeDiscount,
		0,
	)
	const transferDiscount = legsWithDiscount.reduce(
		(sum, leg) => sum + leg.transferDiscount,
		0,
	)
	const subtotalAfterTransfer = subtotal - transferDiscount

	// 3. 쿠폰 할인 계산
	let couponDiscount = 0
	if (couponCode) {
		couponDiscount = calculateCouponDiscount(
			legsWithDiscount,
			couponCode,
			departureTime,
			linesMap,
		)
	}

	// 4. 최종 금액
	const finalTotal = Math.max(0, subtotalAfterTransfer - couponDiscount)

	return {
		subtotal,
		transferDiscount,
		subtotalAfterTransfer,
		couponDiscount,
		finalTotal,
	}
}

/**
 * 금액 반올림 (소수점 2자리)
 */
export function roundPrice(price: number): number {
	return Math.round(price * 100) / 100
}
