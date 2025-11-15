import type { components } from '@/generated/api-types'
import {
	checkLineTypeCondition,
	checkTimeCondition,
	getCouponDefinition,
} from '../data/coupons'

type Line = components['schemas']['Line']
type Leg = components['schemas']['Leg']

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

		// 환승 번호 (0: 첫 구간, 1: 1회 환승, 2: 2회 환승, ...)
		const transferNumber = index

		// 할인율 결정
		let discountRate = 0
		if (transferNumber === 1) {
			// 1회 환승 (두 번째 구간)
			discountRate = line.transferDiscount1st
		} else if (transferNumber >= 2) {
			// 2회 이상 환승 (세 번째 구간부터)
			discountRate = line.transferDiscount2nd
		}

		// 환승 할인 금액 (baseFare에 대해서만 적용)
		const transferDiscount = leg.baseFare * discountRate

		// 최종 요금 (환승 할인 적용, 쿠폰 할인은 나중에)
		const finalFare = leg.baseFare - transferDiscount

		return {
			...leg,
			transferNumber,
			transferDiscount,
			couponDiscount: 0, // 쿠폰 할인은 별도 계산
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
	const subtotal = legs.reduce((sum, leg) => sum + leg.baseFare, 0)
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
		case 'FIXED_AMOUNT': {
			// 진주패스: 고정 금액 할인 (전체 구간에서 한 번만 적용)
			discount = couponDef.discountValue
			break
		}

		case 'PERCENTAGE': {
			// 달팽이패스 또는 투어패스: 퍼센트 할인
			if (couponDef.applicableLineTypes) {
				// 투어패스: 특정 노선만 할인
				const applicableLegs = legs.filter((leg) => {
					const line = linesMap.get(leg.lineId)
					if (!line) return false
					return checkLineTypeCondition(couponDef, line.type)
				})

				discount = applicableLegs.reduce(
					(sum, leg) => sum + leg.finalFare * couponDef.discountValue,
					0,
				)
			} else {
				// 달팽이패스: 전체 요금에 대해 퍼센트 할인
				const totalBeforeCoupon = legs.reduce(
					(sum, leg) => sum + leg.finalFare,
					0,
				)
				discount = totalBeforeCoupon * couponDef.discountValue
			}
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
	couponDiscount: number
	totalDiscount: number
	finalTotal: number
} {
	// 1. 환승 할인 적용
	const legsWithDiscount = calculateLegsWithTransferDiscount(legs, linesMap)

	// 2. 가격 계산
	const subtotal = legsWithDiscount.reduce((sum, leg) => sum + leg.baseFare, 0)
	const transferDiscount = legsWithDiscount.reduce(
		(sum, leg) => sum + leg.transferDiscount,
		0,
	)

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

	// 4. 총 할인 금액
	const totalDiscount = transferDiscount + couponDiscount

	// 5. 최종 금액
	const finalTotal = Math.max(0, subtotal - totalDiscount)

	return {
		subtotal,
		transferDiscount,
		couponDiscount,
		totalDiscount,
		finalTotal,
	}
}

/**
 * 금액 반올림 (소수점 2자리)
 */
export function roundPrice(price: number): number {
	return Math.round(price * 100) / 100
}
