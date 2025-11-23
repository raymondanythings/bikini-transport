import { delay, HttpResponse, http } from 'msw';
import { lines } from '../data/lines';

/**
 * GET /api/lines
 * 전체 노선 목록 조회
 */
export const lineHandlers = [
  http.get('/api/lines', async () => {
    await delay(100);

    return HttpResponse.json({
      lines,
    });
  }),
];
