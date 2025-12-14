import { delay, HttpResponse, http } from 'msw';
import { createSeatLayout } from '../data/seats';
import { getReservedSeats } from '../storage';

/**
 * GET /api/legs/:legId/seats
 * 구간별 좌석 조회
 */
export const seatHandlers = [
  http.get('/api/legs/:legId/seats', async ({ params }) => {
    await delay(200);

    const { legId } = params;

    // getReservedSeats는 실제 예약 + 런타임 랜덤 예약 모두 반환
    const reserved = getReservedSeats(legId as string);

    const seatLayout = createSeatLayout(legId as string, reserved);

    return HttpResponse.json(seatLayout);
  }),
];
