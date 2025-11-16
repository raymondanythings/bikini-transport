import type { components } from '@/generated/api-types';
import { couponDefinitions } from './data/coupons';

type UserCoupon = components['schemas']['UserCoupon'];
type Booking = components['schemas']['Booking'];
type Itinerary = components['schemas']['Itinerary'];

/**
 * 인메모리 저장소
 *
 * 쿠폰과 예약 데이터를 메모리에서 관리합니다.
 * 새로고침 시 초기화됩니다.
 */

// ===== 쿠폰 저장소 =====

/**
 * 사용자별 보유 쿠폰 (couponCode → 개수)
 */
const userCoupons = new Map<string, number>();

/**
 * 쿠폰 초기화
 */
export function initializeCoupons(): void {
  // 기본적으로 쿠폰 소지 없음
  userCoupons.clear();
}

/**
 * 보유 쿠폰 목록 조회
 */
export function getMyCoupons(): UserCoupon[] {
  return couponDefinitions
    .map((def) => ({
      ...def,
      ownedCount: userCoupons.get(def.couponCode) || 0,
    }))
    .filter((coupon) => coupon.ownedCount > 0);
}

/**
 * 특정 쿠폰 개수 조회
 */
export function getCouponCount(couponCode: string): number {
  return userCoupons.get(couponCode) || 0;
}

/**
 * 쿠폰 받기
 *
 * @returns 성공 여부와 에러 메시지
 */
export function claimCoupon(couponCode: string): {
  success: boolean;
  error?: string;
  coupon?: UserCoupon;
} {
  const couponDef = couponDefinitions.find((c) => c.couponCode === couponCode);
  if (!couponDef) {
    return {
      success: false,
      error: 'COUPON_NOT_FOUND',
    };
  }

  const currentCount = getCouponCount(couponCode);

  // 최대 소지 개수 체크
  if (currentCount >= couponDef.maxOwnedCount) {
    return {
      success: false,
      error: 'MAX_COUPON_EXCEEDED',
    };
  }

  // 쿠폰 추가
  userCoupons.set(couponCode, currentCount + 1);

  return {
    success: true,
    coupon: {
      ...couponDef,
      ownedCount: currentCount + 1,
    },
  };
}

/**
 * 쿠폰 사용 (예약 시)
 */
export function useCoupon(couponCode: string): boolean {
  const currentCount = getCouponCount(couponCode);

  if (currentCount <= 0) {
    return false;
  }

  userCoupons.set(couponCode, currentCount - 1);
  return true;
}

// ===== 경로(Itinerary) 저장소 =====

const itineraryStore = new Map<string, Itinerary>();

export function saveItineraries(itineraries: Itinerary[]): void {
  itineraries.forEach((itinerary) => {
    itineraryStore.set(itinerary.itineraryId, itinerary);
  });
}

export function getItineraryById(itineraryId: string): Itinerary | undefined {
  return itineraryStore.get(itineraryId);
}

function clearItineraries(): void {
  itineraryStore.clear();
}

// ===== 예약 저장소 =====

/**
 * 예약 목록 (bookingId → Booking)
 */
const bookings = new Map<string, Booking>();

/**
 * 예약 ID 카운터
 */
let bookingIdCounter = 1;

/**
 * 예약 번호 생성
 */
function generateBookingNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const id = bookingIdCounter.toString().padStart(4, '0');
  return `BKN-${dateStr}-${id}`;
}

/**
 * 예약 생성
 */
export function createBooking(booking: Omit<Booking, 'bookingId' | 'bookingNumber' | 'status' | 'createdAt'>): Booking {
  const bookingId = `booking-${bookingIdCounter++}`;
  const bookingNumber = generateBookingNumber();

  const newBooking: Booking = {
    ...booking,
    bookingId,
    bookingNumber,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };

  bookings.set(bookingId, newBooking);

  return newBooking;
}

/**
 * 예약 조회
 */
export function getBookingById(bookingId: string): Booking | undefined {
  return bookings.get(bookingId);
}

/**
 * 전체 예약 목록 조회
 */
export function getAllBookings(): Booking[] {
  return Array.from(bookings.values());
}

/**
 * 예약 목록 정렬
 */
export function sortBookings(
  bookingsList: Booking[],
  sortBy: 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc' = 'date_desc'
): Booking[] {
  const sorted = [...bookingsList];

  switch (sortBy) {
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
    case 'price_desc':
      return sorted.sort((a, b) => b.pricing.finalTotal - a.pricing.finalTotal);
    case 'price_asc':
      return sorted.sort((a, b) => a.pricing.finalTotal - b.pricing.finalTotal);
    default:
      return sorted;
  }
}

/**
 * 예약 상태 필터링
 */
export function filterBookingsByStatus(bookingsList: Booking[], status?: 'CONFIRMED' | 'CANCELLED'): Booking[] {
  if (!status) {
    return bookingsList;
  }
  return bookingsList.filter((b) => b.status === status);
}

// ===== 좌석 예약 관리 =====

/**
 * 구간별 예약된 좌석 (legId → Set<seatNumber>)
 */
const reservedSeats = new Map<string, Set<string>>();

/**
 * 좌석 예약 상태 조회
 */
export function getReservedSeats(legId: string): string[] {
  return Array.from(reservedSeats.get(legId) || new Set());
}

/**
 * 좌석 예약
 */
export function reserveSeat(legId: string, seatNumber: string): boolean {
  const seats = reservedSeats.get(legId) || new Set();

  if (seats.has(seatNumber)) {
    return false; // 이미 예약됨
  }

  seats.add(seatNumber);
  reservedSeats.set(legId, seats);
  return true;
}

/**
 * 여러 좌석 예약
 */
export function reserveSeats(seatSelections: Array<{ legId: string; seatNumber: string }>): { success: boolean; error?: string } {
  // 먼저 모든 좌석이 예약 가능한지 확인
  for (const { legId, seatNumber } of seatSelections) {
    const seats = reservedSeats.get(legId) || new Set();
    if (seats.has(seatNumber)) {
      return {
        success: false,
        error: `Seat ${seatNumber} in leg ${legId} is already reserved`,
      };
    }
  }

  // 모두 가능하면 예약
  for (const { legId, seatNumber } of seatSelections) {
    reserveSeat(legId, seatNumber);
  }

  return { success: true };
}

/**
 * 저장소 초기화
 */
export function initializeStorage(): void {
  initializeCoupons();
  bookings.clear();
  reservedSeats.clear();
  bookingIdCounter = 1;
  clearItineraries();
}

// 앱 시작 시 초기화
initializeStorage();
