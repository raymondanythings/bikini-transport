/**
 * MSW 2.x 핸들러
 *
 * OpenAPI spec에 정의된 모든 엔드포인트를 처리합니다.
 * 기능별로 분리된 핸들러들을 통합합니다.
 */
import { stationHandlers } from './stations';
import { lineHandlers } from './lines';
import { itineraryHandlers } from './itineraries';
import { seatHandlers } from './seats';
import { couponHandlers } from './coupons';
import { bookingHandlers } from './bookings';

export const handlers = [...stationHandlers, ...lineHandlers, ...itineraryHandlers, ...seatHandlers, ...couponHandlers, ...bookingHandlers];
