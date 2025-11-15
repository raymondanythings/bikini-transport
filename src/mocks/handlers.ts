import { http, HttpResponse, delay } from 'msw';
import { stations } from './data/stations';
import { lines } from './data/lines';
import { createSeatLayout, simulateRandomReservations } from './data/seats';
import { getRandomCoupon, getCouponDefinition } from './data/coupons';
import { searchItineraries, createItinerary } from './utils/pathfinding';
import { calculateFinalBookingPrice } from './utils/pricing';
import {
  getMyCoupons,
  claimCoupon,
  createBooking,
  getBookingById,
  getAllBookings,
  sortBookings,
  filterBookingsByStatus,
  getReservedSeats,
  reserveSeats,
} from './storage';

/**
 * MSW 2.x 핸들러
 *
 * OpenAPI spec에 정의된 모든 엔드포인트를 처리합니다.
 */
export const handlers = [
  // ===== Stations =====

  /**
   * GET /api/stations
   * 전체 역 목록 조회 및 검색
   *
   * 쿼리 파라미터:
   * - q: 검색어 (정류장 이름 부분 일치)
   */
  http.get('/api/stations', async ({ request }) => {
    await delay(100); // 네트워크 지연 시뮬레이션

    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    let filteredStations = stations;

    // 검색어가 있으면 필터링
    if (query) {
      filteredStations = stations.filter((station) => station.name.toLowerCase().includes(query.toLowerCase()));
    }

    return HttpResponse.json({
      stations: filteredStations,
    });
  }),

  // ===== Lines =====

  /**
   * GET /api/lines
   * 전체 노선 목록 조회
   */
  http.get('/api/lines', async () => {
    await delay(100);

    return HttpResponse.json({
      lines,
    });
  }),

  // ===== Itineraries =====

  /**
   * POST /api/itineraries/search
   * 경로 검색
   */
  http.post('/api/itineraries/search', async ({ request }) => {
    await delay(300); // 경로 검색은 좀 더 시간이 걸림

    const body = (await request.json()) as {
      fromStationId: string;
      toStationId: string;
      departureTime: string;
    };

    const { fromStationId, toStationId } = body;

    if (!fromStationId || !toStationId) {
      return HttpResponse.json(
        {
          error: 'INVALID_REQUEST',
          message: '출발지와 도착지를 입력해주세요',
        },
        { status: 400 }
      );
    }

    if (fromStationId === toStationId) {
      return HttpResponse.json(
        {
          error: 'SAME_STATION',
          message: '출발지와 도착지가 동일합니다',
        },
        { status: 400 }
      );
    }

    // 경로 검색
    const itineraries = searchItineraries(fromStationId, toStationId);

    if (itineraries.length === 0) {
      return HttpResponse.json(
        {
          error: 'NO_ROUTE_FOUND',
          message: '경로를 찾을 수 없습니다',
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      itineraries,
    });
  }),

  /**
   * POST /api/itineraries/:itineraryId/calculate-fare
   * 요금 계산 (결제 전 미리보기)
   */
  http.post('/api/itineraries/:itineraryId/calculate-fare', async ({ request }) => {
    await delay(200);

    // itineraryId는 현재 사용되지 않음 (향후 itinerary 저장소 구현 시 사용 예정)
    const body = (await request.json()) as {
      couponCode?: string | null;
    };

    const { couponCode } = body;

    // 실제로는 저장된 itinerary를 조회해야 하지만,
    // 간단히 더미 데이터로 시연
    // TODO: itinerary 저장소 구현 필요

    // 예시 경로 생성 (실제로는 저장된 데이터 사용)
    const dummyItinerary = searchItineraries('bikini-city', 'bubble-city')[0];

    if (!dummyItinerary) {
      return HttpResponse.json(
        {
          error: 'ITINERARY_NOT_FOUND',
          message: '경로를 찾을 수 없습니다',
        },
        { status: 404 }
      );
    }

    // 쿠폰 적용 요금 계산
    const linesMap = new Map(lines.map((line) => [line.lineId, line]));
    const pricing = calculateFinalBookingPrice(dummyItinerary.legs, couponCode || undefined, new Date(), linesMap);

    // 적용된 쿠폰 정보
    let appliedCoupon = null;
    if (couponCode) {
      const couponDef = getCouponDefinition(couponCode);
      if (couponDef) {
        const myCoupons = getMyCoupons();
        const ownedCoupon = myCoupons.find((c) => c.couponCode === couponCode);
        appliedCoupon = ownedCoupon || {
          ...couponDef,
          ownedCount: 0,
        };
      }
    }

    return HttpResponse.json({
      itinerary: dummyItinerary,
      pricing,
      appliedCoupon,
    });
  }),

  // ===== Seats =====

  /**
   * GET /api/legs/:legId/seats
   * 구간별 좌석 조회
   */
  http.get('/api/legs/:legId/seats', async ({ params }) => {
    await delay(200);

    const { legId } = params;
    const reserved = getReservedSeats(legId as string);

    // 랜덤 예약 시뮬레이션 추가
    const additionalReserved = simulateRandomReservations(3);
    const allReserved = [...new Set([...reserved, ...additionalReserved])];

    const seatLayout = createSeatLayout(legId as string, allReserved);

    return HttpResponse.json(seatLayout);
  }),

  // ===== Coupons =====

  /**
   * GET /api/coupons/random-popup
   * 랜덤 쿠폰 팝업 조회
   */
  http.get('/api/coupons/random-popup', async () => {
    await delay(50);

    const couponDef = getRandomCoupon();

    if (!couponDef) {
      return HttpResponse.json({
        coupon: null,
      });
    }

    // CouponDefinition만 반환 (ownedCount 없음)
    return HttpResponse.json({
      coupon: couponDef,
    });
  }),

  /**
   * POST /api/coupons/claim
   * 쿠폰 받기
   */
  http.post('/api/coupons/claim', async ({ request }) => {
    await delay(100);

    const body = (await request.json()) as {
      couponCode: string;
    };

    const { couponCode } = body;

    const result = claimCoupon(couponCode);

    if (!result.success) {
      let message = '쿠폰을 받을 수 없습니다';
      if (result.error === 'MAX_COUPON_EXCEEDED') {
        message = '이미 최대 개수를 보유 중입니다';
      } else if (result.error === 'COUPON_NOT_FOUND') {
        message = '존재하지 않는 쿠폰입니다';
      }

      return HttpResponse.json(
        {
          error: result.error,
          message,
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      coupon: result.coupon,
    });
  }),

  /**
   * GET /api/coupons/my
   * 내 보유 쿠폰 목록
   */
  http.get('/api/coupons/my', async () => {
    await delay(100);

    const coupons = getMyCoupons();

    return HttpResponse.json({
      coupons,
    });
  }),

  // ===== Bookings =====

  /**
   * POST /api/bookings
   * 예약 생성
   */
  http.post('/api/bookings', async ({ request }) => {
    await delay(500); // 예약 생성은 시간이 걸림

    const body = (await request.json()) as {
      itineraryId: string;
      seatSelections: Array<{ legId: string; seatNumber: string }>;
      couponCode?: string;
      departureTime: string;
    };

    const { itineraryId, seatSelections, couponCode, departureTime } = body;

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

    // 경로 정보 재구성 (실제로는 itineraryId로 조회해야 하지만 간단히 구현)
    // TODO: itinerary를 저장하고 조회하는 로직 추가 필요
    // 현재는 더미 데이터로 대체
    const linesMap = new Map(lines.map((line) => [line.lineId, line]));

    // 더미 Itinerary 생성 (실제로는 검색 결과를 저장하고 조회해야 함)
    const dummyLegs = seatSelections.map((sel, index) => {
      const lineId = sel.legId.split('-')[1]; // leg-city-line-0 → city-line
      const line = linesMap.get(`${lineId}-line`);

      return {
        legId: sel.legId,
        lineId: `${lineId}-line`,
        lineName: line?.name || '시티선',
        lineColor: line?.color || '#FFC107',
        fromStation: stations[0],
        toStation: stations[1],
        fromStationIndex: 0,
        toStationIndex: 1,
        durationMinutes: 15,
        stopsCount: 2,
        baseFare: line?.baseFare || 5.0,
        transferNumber: index, // 환승 번호 (0, 1, 2, ...)
        transferDiscount: index > 0 ? 1.0 : 0,
        couponDiscount: 0, // 쿠폰 할인은 별도 계산
        finalFare: (line?.baseFare || 5.0) - (index > 0 ? 1.0 : 0),
      };
    });

    const itinerary = createItinerary(itineraryId, dummyLegs, linesMap);

    // 가격 계산
    const pricing = calculateFinalBookingPrice(itinerary.legs, couponCode, new Date(departureTime), linesMap);

    // 예약 생성
    const booking = createBooking({
      itinerary,
      seatSelections: seatSelections.map((sel, index) => ({
        ...sel,
        legIndex: index,
      })),
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
  }),

  /**
   * GET /api/bookings
   * 내 예약 목록 조회
   */
  http.get('/api/bookings', async ({ request }) => {
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
  }),

  /**
   * GET /api/bookings/:bookingId
   * 예약 상세 조회
   */
  http.get('/api/bookings/:bookingId', async ({ params }) => {
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
  }),
];
