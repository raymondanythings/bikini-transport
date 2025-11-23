/**
 * MSW 2.x 핸들러
 *
 * OpenAPI spec에 정의된 모든 엔드포인트를 처리합니다.
 * 기능별로 분리된 핸들러들을 통합합니다.
 */

import { bookingHandlers } from './bookings';
import { couponHandlers } from './coupons';
import { itineraryHandlers } from './itineraries';
import { lineHandlers } from './lines';
import { seatHandlers } from './seats';
import { stationHandlers } from './stations';

export const handlers = [
  ...stationHandlers,
  ...lineHandlers,
  ...itineraryHandlers,
  ...seatHandlers,
  ...couponHandlers,
  ...bookingHandlers,
];
