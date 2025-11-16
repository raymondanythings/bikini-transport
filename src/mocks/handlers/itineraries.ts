import { http, HttpResponse, delay } from 'msw';
import { lines } from '../data/lines';
import { searchItineraries } from '../utils/pathfinding';
import { calculateFinalBookingPrice } from '../utils/pricing';
import { getMyCoupons, saveItineraries, getItineraryById } from '../storage';
import { getCouponDefinition } from '../data/coupons';

/**
 * POST /api/itineraries/search
 * 경로 검색
 */
const searchItineraryHandler = http.post('/api/itineraries/search', async ({ request }: { request: Request }) => {
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

  // 조회된 경로를 인메모리에 저장 (쿠폰/예약 단계에서 참조)
  saveItineraries(itineraries);

  // 경로가 없어도 빈 배열 반환 (에러 대신)
  return HttpResponse.json({
    itineraries,
  });
});

/**
 * POST /api/itineraries/:itineraryId/calculate-fare
 * 요금 계산 (결제 전 미리보기)
 */
const calculateFareHandler = http.post(
  '/api/itineraries/:itineraryId/calculate-fare',
  async ({ request, params }: { request: Request; params: Record<string, string | undefined> }) => {
    await delay(200);

    const itineraryId = params.itineraryId as string | undefined;
    if (!itineraryId) {
      return HttpResponse.json(
        {
          error: 'INVALID_REQUEST',
          message: 'itineraryId가 필요합니다',
        },
        { status: 400 }
      );
    }

    const storedItinerary = getItineraryById(itineraryId);
    if (!storedItinerary) {
      return HttpResponse.json(
        {
          error: 'ITINERARY_NOT_FOUND',
          message: '저장된 경로를 찾을 수 없습니다',
        },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      couponCode?: string | null;
    };

    const { couponCode } = body;

    // 쿠폰 적용 요금 계산
    const linesMap = new Map(lines.map((line) => [line.lineId, line]));
    const pricing = calculateFinalBookingPrice(storedItinerary.legs, couponCode || undefined, new Date(), linesMap);

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
      itinerary: storedItinerary,
      pricing,
      appliedCoupon,
    });
  }
);

export const itineraryHandlers = [searchItineraryHandler, calculateFareHandler];
