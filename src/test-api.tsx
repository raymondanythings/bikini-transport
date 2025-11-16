import { useEffect, useState } from 'react';
import type { components } from './generated/api-types';
import { STATION_UUIDS } from './mocks/data/stations';

type Station = components['schemas']['Station'];
type Line = components['schemas']['Line'];
type Itinerary = components['schemas']['Itinerary'];

/**
 * API 테스트 페이지
 *
 * MSW가 제대로 작동하는지 확인하기 위한 간단한 테스트 컴포넌트
 */
export function TestApiPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [randomCoupon, setRandomCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 역 목록 조회
  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stations?q=비키');
      const data = await response.json();
      setStations(data.stations);
    } catch (err) {
      setError('역 목록 조회 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. 노선 목록 조회
  const fetchLines = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lines');
      const data = await response.json();
      setLines(data.lines);
    } catch (err) {
      setError('노선 목록 조회 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. 경로 검색
  const searchRoute = async (fromId: string, toId: string, fromName: string, toName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/itineraries/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStationId: fromId,
          toStationId: toId,
          departureTime: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      setItineraries(data.itineraries);

      if (data.itineraries.length === 0) {
        setError(`${fromName} → ${toName}: 경로를 찾을 수 없습니다`);
      }
    } catch (err) {
      setError('경로 검색 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. 랜덤 쿠폰 조회
  const fetchRandomCoupon = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coupons/random-popup');
      const data = await response.json();
      setRandomCoupon(data.coupon);

      if (!data.coupon) {
        setError('이번엔 쿠폰이 나오지 않았습니다. 다시 시도해보세요!');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('쿠폰 조회 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    fetchLines();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧽 Bikini Transport API 테스트</h1>

      {error && <div style={{ color: 'red', padding: '10px', background: '#fee' }}>❌ {error}</div>}

      {loading && <div>⏳ 로딩 중...</div>}

      {/* 역 목록 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🚉 역 목록 ({stations.length}개)</h2>
        <ul>
          {stations.map((station) => (
            <li key={station.stationId}>
              {station.name} ({station.stationId})
            </li>
          ))}
        </ul>
      </section>

      {/* 노선 목록 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🚌 노선 목록 ({lines.length}개)</h2>
        <ul>
          {lines.map((line) => (
            <li key={line.lineId}>
              <span style={{ color: line.color }}>●</span> {line.name} ({line.type}) - 기본요금: {line.baseFare}₴
            </li>
          ))}
        </ul>
      </section>

      {/* 경로 검색 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🔍 경로 검색</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => searchRoute(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN, '비키니 시티', '버블타운')}
            style={{
              padding: '10px 20px',
              background: '#FFC107',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            비키니 시티 → 버블타운 (직행)
          </button>

          <button
            onClick={() => searchRoute(STATION_UUIDS.NEW_KELP_CITY, STATION_UUIDS.BIKINI_ATOLL, '뉴 켈프 시티', '비키니 환초')}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            뉴 켈프 시티 → 비키니 환초 (환승)
          </button>

          <button
            onClick={() => searchRoute(STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.JELLYFISH_FIELDS, '글러브월드', '해파리 초원')}
            style={{
              padding: '10px 20px',
              background: '#ff534f',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            글러브월드 → 해파리 초원 (투어선)
          </button>

          <button
            onClick={() => searchRoute(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES, '비키니 시티', '징징빌라')}
            style={{
              padding: '10px 20px',
              background: '#b7dcca',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            비키니 시티 → 징징빌라 (외곽선)
          </button>
        </div>

        {itineraries.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>추천 경로 ({itineraries.length}개)</h3>
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.itineraryId}
                style={{
                  border: '1px solid #ccc',
                  padding: '20px',
                  marginTop: '15px',
                  borderRadius: '8px',
                  background: '#f9f9f9',
                }}
              >
                {/* 경로 요약 */}
                <div style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #ddd' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} 09:00
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {itinerary.legs[0].fromStation.name} → {itinerary.legs[itinerary.legs.length - 1].toStation.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    총 {itinerary.totalDurationMinutes}분 | 환승 {itinerary.transferCount}회{' | '}총 요금:{' '}
                    {itinerary.pricing.totalBeforeCoupon}₴
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    {itinerary.recommendationTypes.map((type) => {
                      const labels: Record<string, string> = {
                        SHORTEST_TIME: '최단시간',
                        MIN_TRANSFER: '최소환승',
                        LOWEST_FARE: '최저요금',
                      };
                      return (
                        <span
                          key={type}
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            marginRight: '4px',
                            background: '#e3f2fd',
                            color: '#1976d2',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {labels[type]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 타임라인 형태의 구간 표시 */}
                <div style={{ position: 'relative', paddingLeft: '30px' }}>
                  {/* 세로선 */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '0',
                      bottom: '0',
                      width: '2px',
                      background: '#ddd',
                    }}
                  />

                  {itinerary.legs.map((leg, idx) => (
                    <div key={leg.legId} style={{ position: 'relative', marginBottom: idx < itinerary.legs.length - 1 ? '20px' : '0' }}>
                      {/* 노선 라벨 (원형) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-25px',
                          top: '0',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: leg.lineColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          zIndex: 1,
                        }}
                      >
                        {leg.lineName.charAt(0)}
                      </div>

                      {/* 구간 정보 */}
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{leg.fromStation.name}</div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          {leg.durationMinutes}분 | {leg.stopsCount}정거장 이동
                        </div>
                        {leg.transferNumber > 0 && (
                          <div style={{ fontSize: '12px', color: '#4CAF50', marginBottom: '4px' }}>
                            환승 할인: {leg.transferDiscount}₴ 적용
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          요금: {leg.finalFare}₴ (기본 {leg.baseFare}₴)
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 최종 도착지 */}
                  <div style={{ position: 'relative', marginTop: '10px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-25px',
                        top: '0',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#999',
                        zIndex: 1,
                      }}
                    />
                    <div style={{ fontWeight: 'bold' }}>{itinerary.legs[itinerary.legs.length - 1].toStation.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 랜덤 쿠폰 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🎁 랜덤 쿠폰</h2>
        <button
          onClick={fetchRandomCoupon}
          style={{
            padding: '10px 20px',
            background: '#9C27B0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          랜덤 쿠폰 뽑기 (10% 확률)
        </button>

        {randomCoupon && (
          <div
            style={{
              marginTop: '15px',
              padding: '20px',
              border: '2px solid #9C27B0',
              borderRadius: '8px',
              background: '#f3e5f5',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{randomCoupon.emoji}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{randomCoupon.name}</div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{randomCoupon.description}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>최대 보유: {randomCoupon.maxOwnedCount}개</div>
          </div>
        )}

        {randomCoupon === null && !loading && (
          <div style={{ marginTop: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
            😢 이번엔 쿠폰이 나오지 않았습니다. 다시 시도해보세요!
          </div>
        )}
      </section>
    </div>
  );
}
