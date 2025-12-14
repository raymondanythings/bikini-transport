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
 * 쿠폰 UUID 인스턴스 (random-popup에서 생성)
 */
interface CouponInstance {
  realCouponCode: string; // "PEARL_PASS", "GARY_NIGHT", "TOUR_FUN"
  uuid: string;
  expiresAt: Date;
}

/**
 * 사용자가 소유한 쿠폰 데이터
 */
interface UserCouponData {
  realCouponCode: string;
  claimedAt: Date;
}

/**
 * UUID별 쿠폰 인스턴스 (random-popup에서 생성, 1분 TTL)
 */
const couponInstances = new Map<string, CouponInstance>();

/**
 * 사용자가 소유한 쿠폰 (uuid → UserCouponData)
 */
const userCoupons = new Map<string, UserCouponData>();

/**
 * 쿠폰 초기화
 */
export function initializeCoupons(): void {
  userCoupons.clear();
  couponInstances.clear();
}

/**
 * 만료된 쿠폰 인스턴스 정리
 */
function cleanExpiredCoupons(): void {
  const now = new Date();
  for (const [uuid, instance] of couponInstances.entries()) {
    if (instance.expiresAt < now) {
      couponInstances.delete(uuid);
    }
  }
}

/**
 * 쿠폰 인스턴스 저장 (random-popup에서 생성)
 */
export function storeCouponInstance(uuid: string, realCouponCode: string, expiresAt: Date): void {
  couponInstances.set(uuid, {
    realCouponCode,
    uuid,
    expiresAt,
  });
}

/**
 * 보유 쿠폰 목록 조회
 */
export function getMyCoupons(): UserCoupon[] {
  const result: UserCoupon[] = [];

  // 사용자가 소유한 모든 쿠폰 조회
  for (const [uuid, data] of userCoupons.entries()) {
    const def = couponDefinitions.find(c => c.couponCode === data.realCouponCode);
    if (!def) continue;

    result.push({
      couponCode: uuid, // UUID를 couponCode로 사용
      name: def.name,
      description: def.description,
      discountType: def.discountType,
      discountLabel: def.discountLabel,
      applicableLineTypes: def.applicableLineTypes,
      timeCondition: def.timeCondition,
      ownedCount: 1, // 각 UUID는 1개씩
    } as UserCoupon);
  }

  return result;
}

/**
 * UUID로 실제 쿠폰 코드 조회 (할인 계산용)
 */
export function getRealCouponCode(uuid: string): string | undefined {
  const userData = userCoupons.get(uuid);
  return userData?.realCouponCode;
}

/**
 * 쿠폰 받기 (UUID 검증 후 저장)
 */
export function claimCoupon(uuid: string): {
  success: boolean;
  error?: string;
  coupon?: UserCoupon;
} {
  cleanExpiredCoupons();

  // UUID 인스턴스 검증
  const instance = couponInstances.get(uuid);
  if (!instance) {
    return {
      success: false,
      error: 'COUPON_NOT_FOUND',
    };
  }

  // 만료 시간 확인
  const now = new Date();
  if (instance.expiresAt < now) {
    couponInstances.delete(uuid);
    return {
      success: false,
      error: 'COUPON_EXPIRED',
    };
  }

  const couponDef = couponDefinitions.find(c => c.couponCode === instance.realCouponCode);
  if (!couponDef) {
    return {
      success: false,
      error: 'COUPON_NOT_FOUND',
    };
  }

  // 현재 소유한 해당 타입 쿠폰 개수 체크
  const currentCount = Array.from(userCoupons.values()).filter(
    c => c.realCouponCode === instance.realCouponCode
  ).length;

  if (currentCount >= couponDef.maxOwnedCount) {
    return {
      success: false,
      error: 'MAX_COUPON_EXCEEDED',
    };
  }

  // 사용자에게 쿠폰 저장
  userCoupons.set(uuid, {
    realCouponCode: instance.realCouponCode,
    claimedAt: new Date(),
  });

  // 인스턴스는 유지 (다른 사용자가 받을 수도 있음)

  return {
    success: true,
    coupon: {
      couponCode: uuid,
      name: couponDef.name,
      description: couponDef.description,
      discountType: couponDef.discountType,
      discountLabel: couponDef.discountLabel,
      applicableLineTypes: couponDef.applicableLineTypes,
      timeCondition: couponDef.timeCondition,
      ownedCount: 1,
    } as UserCoupon,
  };
}

/**
 * 쿠폰 사용 (예약 시, UUID 기반)
 */
export function applyCoupon(uuid: string): boolean {
  const userData = userCoupons.get(uuid);
  if (!userData) {
    return false; // 소유하지 않은 쿠폰
  }

  // 쿠폰 삭제
  userCoupons.delete(uuid);
  return true;
}

// ===== 경로(Itinerary) 저장소 =====

const itineraryStore = new Map<string, Itinerary>();

export function saveItineraries(itineraries: Itinerary[]): void {
  itineraries.forEach(itinerary => {
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
  return bookingsList.filter(b => b.status === status);
}

// ===== 좌석 예약 관리 =====

/**
 * 구간별 예약된 좌석 (legId → Set<seatNumber>)
 */
const reservedSeats = new Map<string, Set<string>>();

/**
 * 구간별 런타임 랜덤 예약 좌석 (legId → Set<seatNumber>)
 * 새로고침 전까지 유지되는 시뮬레이션 예약
 */
const runtimeReservedSeats = new Map<string, Set<string>>();

/**
 * 런타임 랜덤 예약 좌석 생성 또는 조회
 */
function getOrCreateRuntimeReservations(legId: string): Set<string> {
  if (!runtimeReservedSeats.has(legId)) {
    // 랜덤하게 3-5개의 좌석을 예약 상태로 설정
    const count = Math.floor(Math.random() * 3) + 3; // 3-5
    const allSeats = [];

    // 모든 좌석 번호 생성 (1A-6D)
    for (let row = 1; row <= 6; row++) {
      for (const col of ['A', 'B', 'C', 'D']) {
        allSeats.push(`${row}${col}`);
      }
    }

    // 랜덤 섞기
    const shuffled = allSeats.sort(() => Math.random() - 0.5);
    const randomSeats = new Set(shuffled.slice(0, count));

    runtimeReservedSeats.set(legId, randomSeats);
  }

  return runtimeReservedSeats.get(legId)!;
}

/**
 * 좌석 예약 상태 조회 (실제 예약 + 런타임 예약)
 */
export function getReservedSeats(legId: string): string[] {
  const actual = reservedSeats.get(legId) || new Set();
  const runtime = getOrCreateRuntimeReservations(legId);

  // 실제 예약과 런타임 예약 병합
  return Array.from(new Set([...actual, ...runtime]));
}

/**
 * 좌석 예약
 */
export function reserveSeat(legId: string, seatNumber: string): boolean {
  const actual = reservedSeats.get(legId) || new Set();
  const runtime = getOrCreateRuntimeReservations(legId);

  // 실제 예약 또는 런타임 예약에 이미 있는지 확인
  if (actual.has(seatNumber) || runtime.has(seatNumber)) {
    return false; // 이미 예약됨
  }

  actual.add(seatNumber);
  reservedSeats.set(legId, actual);
  return true;
}

/**
 * 여러 좌석 예약
 */
export function reserveSeats(seatSelections: Array<{ legId: string; seatNumber: string }>): {
  success: boolean;
  error?: string;
} {
  // 먼저 모든 좌석이 예약 가능한지 확인
  for (const { legId, seatNumber } of seatSelections) {
    const actual = reservedSeats.get(legId) || new Set();
    const runtime = getOrCreateRuntimeReservations(legId);

    if (actual.has(seatNumber) || runtime.has(seatNumber)) {
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
  runtimeReservedSeats.clear();
  bookingIdCounter = 1;
  clearItineraries();
}

// 앱 시작 시 초기화
initializeStorage();
