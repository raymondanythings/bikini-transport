import { delay, HttpResponse, http } from 'msw';
import { lines } from '../data/lines';
import { applyCoupon, createBooking, getItineraryById, getMyCoupons, getRealCouponCode, reserveSeats } from '../storage';
import { calculateFinalBookingPrice } from '../utils/pricing';

/**
 * POST /api/bookings
 * 예약 생성
 */
const createBookingHandler = http.post('/api/bookings', async ({ request }) => {
  await delay(500); // 예약 생성은 시간이 걸림

  const body = (await request.json()) as {
    itineraryId: string;
    seatSelections: Array<{ legId: string; seatNumber: string }>;
    couponCode?: string; // UUID
    departureTime: string;
  };

  const { itineraryId, seatSelections, couponCode: couponUuid, departureTime } = body;

  const itinerary = getItineraryById(itineraryId);
  if (!itinerary) {
    return HttpResponse.json(
      {
        error: 'ITINERARY_NOT_FOUND',
        message: '저장된 경로를 찾을 수 없습니다',
      },
      { status: 404 }
    );
  }

  // UUID로 실제 쿠폰 코드 조회 (소유한 쿠폰)
  let realCouponCode: string | undefined;
  if (couponUuid) {
    realCouponCode = getRealCouponCode(couponUuid);
    if (!realCouponCode) {
      return HttpResponse.json(
        {
          error: 'COUPON_NOT_OWNED',
          message: '소유하지 않은 쿠폰입니다',
        },
        { status: 400 }
      );
    }
  }

  // 좌석 예약 가능 여부 확인
  const reservationResult = reserveSeats(seatSelections);
  if (!reservationResult.success) {
    return HttpResponse.json(
      {
        error: 'SEAT_ALREADY_RESERVED',
        message: '이미 예약된 좌석입니다',
        details: { error: reservationResult.error },
      },
      { status: 400 }
    );
  }

  const linesMap = new Map(lines.map(line => [line.lineId, line]));

  // 선택된 좌석이 경로의 구간과 일치하는지 확인
  const seatSelectionsWithIndex = [];
  for (const sel of seatSelections) {
    const legIndex = itinerary.legs.findIndex(leg => leg.legId === sel.legId);
    if (legIndex === -1) {
      return HttpResponse.json(
        {
          error: 'LEG_NOT_FOUND',
          message: `선택한 구간(${sel.legId})을 경로에서 찾을 수 없습니다`,
        },
        { status: 400 }
      );
    }
    seatSelectionsWithIndex.push({
      ...sel,
      legIndex,
    });
  }

  // 가격 계산
  const pricing = calculateFinalBookingPrice(
    itinerary.legs,
    realCouponCode || undefined,
    new Date(departureTime),
    linesMap
  );

  // 쿠폰 정보 미리 조회 (사용 전)
  let appliedCouponInfo: ReturnType<typeof getMyCoupons>[0] | undefined;
  if (couponUuid) {
    appliedCouponInfo = getMyCoupons().find(c => c.couponCode === couponUuid);
  }

  // 쿠폰 사용 처리 (UUID 기반)
  if (couponUuid) {
    const used = applyCoupon(couponUuid);
    if (!used) {
      return HttpResponse.json(
        {
          error: 'COUPON_USE_FAILED',
          message: '쿠폰 사용에 실패했습니다',
        },
        { status: 400 }
      );
    }
  }

  // 예약 생성
  const booking = createBooking({
    itinerary,
    seatSelections: seatSelectionsWithIndex,
    appliedCoupon: appliedCouponInfo,
    departureTime,
    pricing: {
      subtotal: pricing.subtotal,
      transferDiscount: pricing.transferDiscount,
      couponDiscount: pricing.couponDiscount,
      totalDiscount: pricing.totalDiscount,
      finalTotal: pricing.finalTotal,
      currency: 'SHELL',
    },
  });

  return HttpResponse.json(booking, { status: 201 });
});

export const bookingHandlers = [createBookingHandler];
