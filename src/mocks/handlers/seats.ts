import { http, HttpResponse, delay } from 'msw';
import { createSeatLayout, simulateRandomReservations } from '../data/seats';
import { getReservedSeats } from '../storage';

/**
 * GET /api/legs/:legId/seats
 * 구간별 좌석 조회
 */
export const seatHandlers = [
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
];
