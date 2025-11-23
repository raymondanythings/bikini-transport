import { useEffect, useMemo, useState } from 'react';
import type { components } from './generated/api-types';
import { STATION_UUIDS } from './mocks/data/stations';

type Station = components['schemas']['Station'];
type Line = components['schemas']['Line'];
type Itinerary = components['schemas']['Itinerary'];
type SeatLayout = components['schemas']['SeatLayout'];
type UserCoupon = components['schemas']['UserCoupon'];
type Booking = components['schemas']['Booking'];
type CouponDefinition = components['schemas']['CouponDefinition'];

type FarePreview = {
  itinerary: Itinerary;
  pricing: {
    subtotal: number;
    transferDiscount: number;
    couponDiscount: number;
    totalDiscount: number;
    finalTotal: number;
  };
  appliedCoupon?: UserCoupon | null;
};

type RouteSearchParams = {
  fromStationId: string;
  toStationId: string;
  fromName: string;
  toName: string;
  departureTime?: string;
};

/**
 * API 테스트 페이지
 *
 * MSW가 제대로 작동하는지 확인하기 위한 간단한 테스트 컴포넌트
 */
export function TestApiPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<string | null>(null);
  const [stationSearchQuery, setStationSearchQuery] = useState('');
  const [customFromSearch, setCustomFromSearch] = useState('');
  const [customToSearch, setCustomToSearch] = useState('');
  const [customFromStationId, setCustomFromStationId] = useState('');
  const [customToStationId, setCustomToStationId] = useState('');
  const [customDepartureTime, setCustomDepartureTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [seatLegId, setSeatLegId] = useState('');
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [randomCoupon, setRandomCoupon] = useState<CouponDefinition | null | undefined>(undefined);
  const [randomCouponFetched, setRandomCouponFetched] = useState(false);
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [claimCouponCode, setClaimCouponCode] = useState('');
  const [fareCouponCode, setFareCouponCode] = useState('');
  const [farePreview, setFarePreview] = useState<FarePreview | null>(null);
  const [bookingSeatNumber, setBookingSeatNumber] = useState('1A');
  const [bookingCouponCode, setBookingCouponCode] = useState('');
  const [bookingDepartureTime, setBookingDepartureTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingSort, setBookingSort] = useState<'date_desc' | 'date_asc' | 'price_desc' | 'price_asc'>('date_desc');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'CONFIRMED' | 'CANCELLED' | ''>('');
  const [bookingDetailId, setBookingDetailId] = useState('');
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const loading = loadingCount > 0;
  const [error, setError] = useState<string | null>(null);

  const startLoading = (action: string) => {
    setLoadingAction(action);
    setLoadingCount(prev => prev + 1);
  };

  const endLoading = () => {
    setLoadingCount(prev => {
      const next = Math.max(0, prev - 1);
      if (next === 0) {
        setLoadingAction(null);
      }
      return next;
    });
  };

  const selectedItinerary = useMemo(() => {
    if (itineraries.length === 0) {
      return null;
    }
    if (!selectedItineraryId) {
      return itineraries[0];
    }
    return itineraries.find(itinerary => itinerary.itineraryId === selectedItineraryId) || itineraries[0];
  }, [itineraries, selectedItineraryId]);

  const formatItineraryLabel = (itinerary: Itinerary) => {
    const firstLeg = itinerary.legs[0];
    const lastLeg = itinerary.legs[itinerary.legs.length - 1];
    const fromName = firstLeg?.fromStation.name ?? '출발지';
    const toName = lastLeg?.toStation.name ?? '도착지';
    return `${fromName} → ${toName}`;
  };

  const stationMap = useMemo(() => new Map(stations.map(station => [station.stationId, station])), [stations]);

  const filteredFromStations = useMemo(() => {
    const keyword = customFromSearch.trim().toLowerCase();
    const list = keyword ? stations.filter(station => station.name.toLowerCase().includes(keyword)) : stations;
    return list.slice(0, 30);
  }, [stations, customFromSearch]);

  const filteredToStations = useMemo(() => {
    const keyword = customToSearch.trim().toLowerCase();
    const list = keyword ? stations.filter(station => station.name.toLowerCase().includes(keyword)) : stations;
    return list.slice(0, 30);
  }, [stations, customToSearch]);

  const getStationName = (stationId: string) => stationMap.get(stationId)?.name ?? '미확인 역';

  // 1. 역 목록 조회
  const fetchStations = async (query: string = '') => {
    try {
      setError(null);
      startLoading('역 목록 조회');
      const response = await fetch(`/api/stations?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setStations(data.stations);
    } catch (err) {
      setError('역 목록 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  // 2. 노선 목록 조회
  const fetchLines = async () => {
    try {
      setError(null);
      startLoading('노선 목록 조회');
      const response = await fetch('/api/lines');
      const data = await response.json();
      setLines(data.lines);
    } catch (err) {
      setError('노선 목록 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  // 3. 경로 검색
  const searchRoute = async ({ fromStationId, toStationId, fromName, toName, departureTime }: RouteSearchParams) => {
    try {
      setError(null);
      startLoading('경로 검색');
      const response = await fetch('/api/itineraries/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStationId,
          toStationId,
          departureTime: departureTime ?? new Date().toISOString(),
        }),
      });
      const data = await response.json();
      setItineraries(data.itineraries);
      setSelectedItineraryId(data.itineraries[0]?.itineraryId ?? null);
      setSeatLayout(null);
      setFarePreview(null);
      setCreatedBooking(null);

      if (data.itineraries.length === 0) {
        setError(`${fromName} → ${toName}: 경로를 찾을 수 없습니다`);
      }
    } catch (err) {
      setError('경로 검색 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  // 4. 랜덤 쿠폰 조회
  const fetchRandomCoupon = async () => {
    try {
      setError(null);
      startLoading('랜덤 쿠폰 조회');
      const response = await fetch('/api/coupons/random-popup');
      const data = await response.json();
      setRandomCoupon(data.coupon);
      setRandomCouponFetched(true);

      if (!data.coupon) {
        setError('이번엔 쿠폰이 나오지 않았습니다. 다시 시도해보세요!');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('쿠폰 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const fetchSeatLayout = async () => {
    if (!seatLegId) {
      setError('좌석을 조회할 구간을 선택하세요');
      return;
    }

    try {
      setError(null);
      startLoading('좌석 조회');
      const response = await fetch(`/api/legs/${seatLegId}/seats`);
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || '좌석 조회 실패');
      }
      const data: SeatLayout = await response.json();
      setSeatLayout(data);
    } catch (err) {
      setSeatLayout(null);
      setError(err instanceof Error ? err.message : '좌석 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const calculateFarePreview = async () => {
    if (!selectedItinerary) {
      setError('먼저 경로를 검색해주세요');
      return;
    }

    try {
      setError(null);
      startLoading('요금 계산');
      const payload: { couponCode?: string | null } = {};
      if (fareCouponCode.trim()) {
        payload.couponCode = fareCouponCode.trim();
      }

      const response = await fetch(`/api/itineraries/${selectedItinerary.itineraryId}/calculate-fare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || '요금 계산 실패');
      }

      const data: FarePreview = await response.json();
      setFarePreview(data);
    } catch (err) {
      setFarePreview(null);
      setError(err instanceof Error ? err.message : '요금 계산 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const fetchMyCouponsList = async () => {
    try {
      setError(null);
      startLoading('내 쿠폰 조회');
      const response = await fetch('/api/coupons/my');
      const data = await response.json();
      setMyCoupons(data.coupons);
    } catch (err) {
      setError('내 쿠폰 목록 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const handleClaimCoupon = async () => {
    if (!claimCouponCode.trim()) {
      setError('쿠폰 코드를 입력하세요');
      return;
    }

    try {
      setError(null);
      startLoading('쿠폰 받기');
      const response = await fetch('/api/coupons/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: claimCouponCode.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '쿠폰 받기에 실패했습니다');
      }

      setClaimCouponCode('');
      await fetchMyCouponsList();
    } catch (err) {
      setError(err instanceof Error ? err.message : '쿠폰 받기에 실패했습니다');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const createBookingRequest = async () => {
    if (!selectedItinerary) {
      setError('먼저 경로를 검색해주세요');
      return;
    }
    if (!bookingSeatNumber.trim()) {
      setError('좌석 번호를 입력해주세요');
      return;
    }

    try {
      setError(null);
      startLoading('예약 생성');

      const departureInput = bookingDepartureTime ? new Date(bookingDepartureTime) : new Date();
      const departureTime = Number.isNaN(departureInput.getTime())
        ? new Date().toISOString()
        : departureInput.toISOString();
      const payload: {
        itineraryId: string;
        seatSelections: Array<{ legId: string; seatNumber: string }>;
        couponCode?: string;
        departureTime: string;
      } = {
        itineraryId: selectedItinerary.itineraryId,
        seatSelections: selectedItinerary.legs.map(leg => ({
          legId: leg.legId,
          seatNumber: bookingSeatNumber.trim().toUpperCase(),
        })),
        departureTime,
      };

      if (bookingCouponCode.trim()) {
        payload.couponCode = bookingCouponCode.trim();
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '예약 생성에 실패했습니다');
      }

      setCreatedBooking(data);
      setError(null);
    } catch (err) {
      setCreatedBooking(null);
      setError(err instanceof Error ? err.message : '예약 생성에 실패했습니다');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const fetchBookingsList = async () => {
    try {
      setError(null);
      startLoading('예약 목록 조회');
      const params = new URLSearchParams();
      if (bookingSort) {
        params.set('sort', bookingSort);
      }
      if (bookingStatusFilter) {
        params.set('status', bookingStatusFilter);
      }
      const queryString = params.toString();
      const response = await fetch(`/api/bookings${queryString ? `?${queryString}` : ''}`);
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError('예약 목록 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const fetchBookingDetailById = async () => {
    if (!bookingDetailId.trim()) {
      setError('예약 ID를 입력해주세요');
      return;
    }

    try {
      setError(null);
      startLoading('예약 상세 조회');
      const response = await fetch(`/api/bookings/${bookingDetailId.trim()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '예약 상세 조회 실패');
      }
      setBookingDetail(data);
    } catch (err) {
      setBookingDetail(null);
      setError(err instanceof Error ? err.message : '예약 상세 조회 실패');
      console.error(err);
    } finally {
      endLoading();
    }
  };

  const handleCustomRouteSearch = async () => {
    if (!customFromStationId || !customToStationId) {
      setError('출발역과 도착역을 모두 선택해주세요');
      return;
    }

    if (customFromStationId === customToStationId) {
      setError('출발역과 도착역은 달라야 합니다');
      return;
    }

    const departureInput = customDepartureTime ? new Date(customDepartureTime) : new Date();
    const departureIso = Number.isNaN(departureInput.getTime())
      ? new Date().toISOString()
      : departureInput.toISOString();

    await searchRoute({
      fromStationId: customFromStationId,
      toStationId: customToStationId,
      fromName: getStationName(customFromStationId),
      toName: getStationName(customToStationId),
      departureTime: departureIso,
    });
  };

  useEffect(() => {
    fetchStations();
    fetchLines();
  }, []);

  useEffect(() => {
    if (itineraries.length === 0) {
      setSelectedItineraryId(null);
      return;
    }

    setSelectedItineraryId(prev => {
      if (prev && itineraries.some(itinerary => itinerary.itineraryId === prev)) {
        return prev;
      }
      return itineraries[0].itineraryId;
    });
  }, [itineraries]);

  useEffect(() => {
    if (!selectedItinerary) {
      setSeatLegId('');
      setSeatLayout(null);
      setFarePreview(null);
      return;
    }

    if (!seatLegId || !selectedItinerary.legs.some(leg => leg.legId === seatLegId)) {
      setSeatLegId(selectedItinerary.legs[0]?.legId ?? '');
      setSeatLayout(null);
    }
  }, [selectedItinerary, seatLegId]);

  useEffect(() => {
    if (filteredFromStations.length === 0) {
      if (customFromStationId !== '') {
        setCustomFromStationId('');
      }
      return;
    }

    if (!filteredFromStations.some(station => station.stationId === customFromStationId)) {
      const fallback = filteredFromStations[0]?.stationId ?? '';
      if (fallback !== customFromStationId) {
        setCustomFromStationId(fallback);
      }
    }
  }, [filteredFromStations, customFromStationId]);

  useEffect(() => {
    if (filteredToStations.length === 0) {
      if (customToStationId !== '') {
        setCustomToStationId('');
      }
      return;
    }

    if (!filteredToStations.some(station => station.stationId === customToStationId)) {
      const fallback = filteredToStations[0]?.stationId ?? '';
      if (fallback !== customToStationId) {
        setCustomToStationId(fallback);
      }
    }
  }, [filteredToStations, customToStationId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🧽 Bikini Transport API 테스트</h1>

      {error && <div style={{ color: 'red', padding: '10px', background: '#fee' }}>❌ {error}</div>}

      {loading && <div>⏳ {loadingAction ?? '로딩 중...'}</div>}

      {/* 역 목록 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🚉 역 목록 ({stations.length}개)</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
          <input
            value={stationSearchQuery}
            onChange={event => setStationSearchQuery(event.target.value)}
            placeholder="검색어 (예: 비키)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={() => fetchStations(stationSearchQuery)}
            style={{
              padding: '8px 16px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            API 검색
          </button>
          <button
            onClick={() => {
              setStationSearchQuery('');
              fetchStations();
            }}
            style={{
              padding: '8px 16px',
              background: '#90a4ae',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            전체 다시 불러오기
          </button>
        </div>
        <ul>
          {stations.map(station => (
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
          {lines.map(line => (
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
            onClick={() =>
              searchRoute({
                fromStationId: STATION_UUIDS.BIKINI_CITY,
                toStationId: STATION_UUIDS.BUBBLE_TOWN,
                fromName: '비키니 시티',
                toName: '버블타운',
              })
            }
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
            onClick={() =>
              searchRoute({
                fromStationId: STATION_UUIDS.NEW_KELP_CITY,
                toStationId: STATION_UUIDS.BIKINI_ATOLL,
                fromName: '뉴 켈프 시티',
                toName: '비키니 환초',
              })
            }
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
            onClick={() =>
              searchRoute({
                fromStationId: STATION_UUIDS.GLOVE_WORLD,
                toStationId: STATION_UUIDS.JELLYFISH_FIELDS,
                fromName: '글러브월드',
                toName: '해파리 초원',
              })
            }
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
            onClick={() =>
              searchRoute({
                fromStationId: STATION_UUIDS.BIKINI_CITY,
                toStationId: STATION_UUIDS.TENTACLE_ACRES,
                fromName: '비키니 시티',
                toName: '징징빌라',
              })
            }
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

        <div
          style={{
            marginTop: '25px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#fcfcfc',
          }}
        >
          <h3>🧭 맞춤 경로 검색</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ minWidth: '220px', flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>출발역 검색</label>
              <input
                value={customFromSearch}
                onChange={event => setCustomFromSearch(event.target.value)}
                placeholder="출발역 이름 검색"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '8px',
                }}
              />
              <select
                value={customFromStationId}
                onChange={event => setCustomFromStationId(event.target.value)}
                disabled={filteredFromStations.length === 0}
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              >
                {filteredFromStations.length === 0 && <option value="">검색 결과가 없습니다</option>}
                {filteredFromStations.map(station => (
                  <option key={station.stationId} value={station.stationId}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: '220px', flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>도착역 검색</label>
              <input
                value={customToSearch}
                onChange={event => setCustomToSearch(event.target.value)}
                placeholder="도착역 이름 검색"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '8px',
                }}
              />
              <select
                value={customToStationId}
                onChange={event => setCustomToStationId(event.target.value)}
                disabled={filteredToStations.length === 0}
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              >
                {filteredToStations.length === 0 && <option value="">검색 결과가 없습니다</option>}
                {filteredToStations.map(station => (
                  <option key={station.stationId} value={station.stationId}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: '220px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>출발 시간</label>
              <input
                type="datetime-local"
                value={customDepartureTime}
                onChange={event => setCustomDepartureTime(event.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '15px' }}>
            <div style={{ flex: 1, minWidth: '220px', color: '#555' }}>
              출발: <strong>{customFromStationId ? getStationName(customFromStationId) : '미선택'}</strong> / 도착:{' '}
              <strong>{customToStationId ? getStationName(customToStationId) : '미선택'}</strong>
            </div>
            <button
              onClick={handleCustomRouteSearch}
              disabled={!customFromStationId || !customToStationId}
              style={{
                padding: '10px 20px',
                background: '#0288D1',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: customFromStationId && customToStationId ? 'pointer' : 'not-allowed',
              }}
            >
              선택한 조건으로 경로 검색
            </button>
          </div>
        </div>

        {itineraries.length > 0 && (
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong>현재 선택된 경로:</strong>
            <select
              value={selectedItinerary?.itineraryId ?? ''}
              onChange={event => setSelectedItineraryId(event.target.value)}
              style={{ padding: '6px 8px', borderRadius: '4px' }}
            >
              {itineraries.map(itinerary => (
                <option key={itinerary.itineraryId} value={itinerary.itineraryId}>
                  {formatItineraryLabel(itinerary)} ({itinerary.recommendationTypes.join(', ')})
                </option>
              ))}
            </select>
          </div>
        )}

        {itineraries.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>추천 경로 ({itineraries.length}개)</h3>
            {itineraries.map(itinerary => (
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
                    {itinerary.recommendationTypes.map(type => {
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
                    <div
                      key={leg.legId}
                      style={{ position: 'relative', marginBottom: idx < itinerary.legs.length - 1 ? '20px' : '0' }}
                    >
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

      {/* 좌석 조회 */}
      <section style={{ marginTop: '20px' }}>
        <h2>💺 구간 좌석 조회</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            구간 선택:{' '}
            <select
              value={seatLegId}
              onChange={event => setSeatLegId(event.target.value)}
              disabled={!selectedItinerary || selectedItinerary.legs.length === 0}
              style={{ padding: '6px 8px', borderRadius: '4px' }}
            >
              {selectedItinerary?.legs.map(leg => (
                <option key={leg.legId} value={leg.legId}>
                  {leg.fromStation.name} → {leg.toStation.name}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={fetchSeatLayout}
            disabled={!seatLegId}
            style={{
              padding: '8px 16px',
              background: '#607D8B',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: seatLegId ? 'pointer' : 'not-allowed',
            }}
          >
            좌석 배치 조회
          </button>
        </div>

        {seatLayout && (
          <div style={{ marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>구간 ID:</strong> {seatLayout.legId} | 예약 좌석{' '}
              {seatLayout.seats.filter(seat => seat.isReserved).length}/{seatLayout.seats.length}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '420px' }}>
              {seatLayout.seats.map(seat => (
                <span
                  key={seat.seatNumber}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: seat.isReserved ? '#ffcdd2' : '#c8e6c9',
                    color: seat.isReserved ? '#b71c1c' : '#1b5e20',
                    fontSize: '12px',
                    border: '1px solid #ddd',
                    minWidth: '36px',
                    textAlign: 'center',
                  }}
                >
                  {seat.seatNumber}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 요금 계산 */}
      <section style={{ marginTop: '20px' }}>
        <h2>💰 요금 계산 (쿠폰 적용 미리보기)</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            선택된 경로: <strong>{selectedItinerary ? formatItineraryLabel(selectedItinerary) : '없음'}</strong>
          </div>
          <input
            value={fareCouponCode}
            onChange={event => setFareCouponCode(event.target.value)}
            placeholder="쿠폰 코드 (선택)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={calculateFarePreview}
            disabled={!selectedItinerary}
            style={{
              padding: '8px 16px',
              background: '#00ACC1',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: selectedItinerary ? 'pointer' : 'not-allowed',
            }}
          >
            요금 계산
          </button>
        </div>

        {farePreview && (
          <div style={{ marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>결과</h4>
            <p>기본 요금 합계: {farePreview.pricing.subtotal.toFixed(2)}₴</p>
            <p>환승 할인: -{farePreview.pricing.transferDiscount.toFixed(2)}₴</p>
            <p>쿠폰 할인: -{farePreview.pricing.couponDiscount.toFixed(2)}₴</p>
            <p>
              <strong>최종 결제 금액: {farePreview.pricing.finalTotal.toFixed(2)}₴</strong>
            </p>
            {farePreview.appliedCoupon ? (
              <div style={{ marginTop: '10px', padding: '10px', background: '#f1f8e9', borderRadius: '6px' }}>
                적용 쿠폰: {farePreview.appliedCoupon.name} ({farePreview.appliedCoupon.couponCode})
              </div>
            ) : (
              <div style={{ marginTop: '10px', color: '#666' }}>적용된 쿠폰이 없습니다.</div>
            )}
          </div>
        )}
      </section>

      {/* 랜덤 쿠폰 */}
      <section style={{ marginTop: '20px' }}>
        <h2>🎁 쿠폰 API</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
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
          <input
            value={claimCouponCode}
            onChange={event => setClaimCouponCode(event.target.value)}
            placeholder="쿠폰 코드 입력"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleClaimCoupon}
            style={{
              padding: '8px 16px',
              background: '#7B1FA2',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            쿠폰 받기
          </button>
          <button
            onClick={fetchMyCouponsList}
            style={{
              padding: '8px 16px',
              background: '#311B92',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            내 쿠폰 조회
          </button>
        </div>

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
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{randomCoupon.name}</div>
            <div style={{ fontSize: '14px', color: '#7B1FA2', marginBottom: '8px' }}>{randomCoupon.discountLabel}</div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
              {randomCoupon.description.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {randomCouponFetched && randomCoupon === null && !loading && (
          <div style={{ marginTop: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
            😢 이번엔 쿠폰이 나오지 않았습니다. 다시 시도해보세요!
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3>내 쿠폰 목록 ({myCoupons.length}개)</h3>
          {myCoupons.length === 0 ? (
            <p style={{ color: '#666' }}>보유 중인 쿠폰이 없습니다.</p>
          ) : (
            <ul>
              {myCoupons.map(coupon => (
                <li key={coupon.couponCode}>
                  {coupon.name} ({coupon.couponCode}) - {coupon.discountLabel} · {coupon.ownedCount}개 보유
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 예약 API */}
      <section style={{ marginTop: '20px' }}>
        <h2>🧾 예약 API</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <input
            value={bookingSeatNumber}
            onChange={event => setBookingSeatNumber(event.target.value)}
            placeholder="좌석 번호 (예: 1A)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            value={bookingCouponCode}
            onChange={event => setBookingCouponCode(event.target.value)}
            placeholder="쿠폰 코드 (선택)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="datetime-local"
            value={bookingDepartureTime}
            onChange={event => setBookingDepartureTime(event.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={createBookingRequest}
            disabled={!selectedItinerary}
            style={{
              padding: '10px 20px',
              background: '#FF7043',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: selectedItinerary ? 'pointer' : 'not-allowed',
            }}
          >
            예약 생성
          </button>
        </div>

        {createdBooking && (
          <div style={{ marginTop: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div>
              ✅ 예약 완료: <strong>{createdBooking.bookingNumber}</strong>
            </div>
            <div>예약 ID: {createdBooking.bookingId}</div>
            <div>
              출발 시간: {new Date(createdBooking.departureTime).toLocaleString('ko-KR')} | 총액:{' '}
              {createdBooking.pricing.finalTotal}₴
            </div>
            <div>좌석 선택: {createdBooking.seatSelections.map(seat => seat.seatNumber).join(', ')}</div>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            정렬:
            <select
              value={bookingSort}
              onChange={event => setBookingSort(event.target.value as typeof bookingSort)}
              style={{ marginLeft: '6px', padding: '6px 8px', borderRadius: '4px' }}
            >
              <option value="date_desc">출발 최신순</option>
              <option value="date_asc">출발 오래된순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="price_asc">가격 낮은순</option>
            </select>
          </label>

          <label>
            상태:
            <select
              value={bookingStatusFilter}
              onChange={event => setBookingStatusFilter(event.target.value as typeof bookingStatusFilter)}
              style={{ marginLeft: '6px', padding: '6px 8px', borderRadius: '4px' }}
            >
              <option value="">전체</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>

          <button
            onClick={fetchBookingsList}
            style={{
              padding: '8px 16px',
              background: '#EF6C00',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            예약 목록 조회
          </button>
        </div>

        <div style={{ marginTop: '15px' }}>
          <h3>예약 목록 ({bookings.length}건)</h3>
          {bookings.length === 0 ? (
            <p style={{ color: '#666' }}>조회된 예약이 없습니다.</p>
          ) : (
            <ul>
              {bookings.map(booking => (
                <li key={booking.bookingId}>
                  [{booking.status}] {booking.bookingNumber} - {new Date(booking.departureTime).toLocaleString('ko-KR')}{' '}
                  / {booking.pricing.finalTotal}₴
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={bookingDetailId}
            onChange={event => setBookingDetailId(event.target.value)}
            placeholder="예약 ID (예: booking-1)"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button
            onClick={fetchBookingDetailById}
            style={{
              padding: '8px 16px',
              background: '#F4511E',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            예약 상세 조회
          </button>
        </div>

        {bookingDetail && (
          <pre
            style={{
              marginTop: '15px',
              padding: '15px',
              background: '#f5f5f5',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(bookingDetail, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
