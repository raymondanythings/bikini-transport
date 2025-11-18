import { http, HttpResponse, delay } from 'msw';
import { lines } from '../data/lines';
import { calculateFinalBookingPrice } from '../utils/pricing';
import {
  getMyCoupons,
  createBooking,
  getBookingById,
  getAllBookings,
  sortBookings,
  filterBookingsByStatus,
  reserveSeats,
  getItineraryById,
} from '../storage';

/**
 * POST /api/bookings
 * 예약 생성
 */
const createBookingHandler = http.post('/api/bookings', async ({ request }) => {
  await delay(500); // 예약 생성은 시간이 걸림

  const body = (await request.json()) as {
    itineraryId: string;
    seatSelections: Array<{ legId: string; seatNumber: string }>;
    couponCode?: string;
    departureTime: string;
  };

  const { itineraryId, seatSelections, couponCode, departureTime } = body;

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

  const linesMap = new Map(lines.map((line) => [line.lineId, line]));

  // 선택된 좌석이 경로의 구간과 일치하는지 확인
  const seatSelectionsWithIndex = [];
  for (const sel of seatSelections) {
    const legIndex = itinerary.legs.findIndex((leg) => leg.legId === sel.legId);
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
  const pricing = calculateFinalBookingPrice(itinerary.legs, couponCode || undefined, new Date(departureTime), linesMap);

  // 예약 생성
  const booking = createBooking({
    itinerary,
    seatSelections: seatSelectionsWithIndex,
    appliedCoupon: couponCode ? getMyCoupons().find((c) => c.couponCode === couponCode) || undefined : undefined,
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

/**
 * GET /api/bookings
 * 내 예약 목록 조회
 */
const getBookingsHandler = http.get('/api/bookings', async ({ request }) => {
  await delay(200);

  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') as 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc' | null;
  const statusParam = url.searchParams.get('status') as 'CONFIRMED' | 'CANCELLED' | null;

  let bookingsList = getAllBookings();

  // 상태 필터
  if (statusParam) {
    bookingsList = filterBookingsByStatus(bookingsList, statusParam);
  }

  // 정렬
  if (sortParam) {
    bookingsList = sortBookings(bookingsList, sortParam);
  } else {
    bookingsList = sortBookings(bookingsList, 'date_desc');
  }

  return HttpResponse.json({
    bookings: bookingsList,
  });
});

/**
 * GET /api/bookings/:bookingId
 * 예약 상세 조회
 */
const getBookingByIdHandler = http.get('/api/bookings/:bookingId', async ({ params }) => {
  await delay(100);

  const { bookingId } = params;
  const booking = getBookingById(bookingId as string);

  if (!booking) {
    return HttpResponse.json(
      {
        error: 'BOOKING_NOT_FOUND',
        message: '예약을 찾을 수 없습니다',
      },
      { status: 404 }
    );
  }

  return HttpResponse.json(booking);
});

export const bookingHandlers = [createBookingHandler, getBookingsHandler, getBookingByIdHandler];
