import { delay, HttpResponse, http } from 'msw';
import { stations } from '../data/stations';

/**
 * GET /api/stations
 * 전체 역 목록 조회 및 검색
 *
 * 쿼리 파라미터:
 * - q: 검색어 (정류장 이름 부분 일치)
 */
export const stationHandlers = [
  http.get('/api/stations', async ({ request }) => {
    await delay(100); // 네트워크 지연 시뮬레이션

    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    let filteredStations = stations;

    // 검색어가 있으면 필터링
    if (query) {
      filteredStations = stations.filter(station => station.name.toLowerCase().includes(query.toLowerCase()));
    }

    return HttpResponse.json({
      stations: filteredStations,
    });
  }),
];
