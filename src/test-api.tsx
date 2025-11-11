import { useEffect, useState } from 'react'
import type { components } from './generated/api-types'

type Station = components['schemas']['Station']
type Line = components['schemas']['Line']
type Itinerary = components['schemas']['Itinerary']

/**
 * API 테스트 페이지
 *
 * MSW가 제대로 작동하는지 확인하기 위한 간단한 테스트 컴포넌트
 */
export function TestApiPage() {
	const [stations, setStations] = useState<Station[]>([])
	const [lines, setLines] = useState<Line[]>([])
	const [itineraries, setItineraries] = useState<Itinerary[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// 1. 역 목록 조회
	const fetchStations = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/stations')
			const data = await response.json()
			setStations(data.stations)
		} catch (err) {
			setError('역 목록 조회 실패')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	// 2. 노선 목록 조회
	const fetchLines = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/lines')
			const data = await response.json()
			setLines(data.lines)
		} catch (err) {
			setError('노선 목록 조회 실패')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	// 3. 경로 검색
	const searchRoute = async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/itineraries/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fromStationId: 'new-kelp-city',
					toStationId: 'bubble-city',
					departureTime: new Date().toISOString(),
				}),
			})
			const data = await response.json()
			setItineraries(data.itineraries)
		} catch (err) {
			setError('경로 검색 실패')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchStations()
		fetchLines()
	}, [])

	return (
		<div style={{ padding: '20px', fontFamily: 'monospace' }}>
			<h1>🧽 Bikini Transport API 테스트</h1>

			{error && (
				<div style={{ color: 'red', padding: '10px', background: '#fee' }}>
					❌ {error}
				</div>
			)}

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
							<span style={{ color: line.color }}>●</span> {line.name} (
							{line.type}) - 기본요금: {line.baseFare}₴
						</li>
					))}
				</ul>
			</section>

			{/* 경로 검색 */}
			<section style={{ marginTop: '20px' }}>
				<h2>🔍 경로 검색</h2>
				<button
					onClick={searchRoute}
					style={{
						padding: '10px 20px',
						background: '#FFC107',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					뉴캘프시티 → 버블시티 검색
				</button>

				{itineraries.length > 0 && (
					<div style={{ marginTop: '10px' }}>
						<h3>추천 경로 ({itineraries.length}개)</h3>
						{itineraries.map((itinerary) => (
							<div
								key={itinerary.itineraryId}
								style={{
									border: '1px solid #ccc',
									padding: '10px',
									marginTop: '10px',
									borderRadius: '4px',
								}}
							>
								<div>
									<strong>
										{itinerary.recommendationTypes.join(', ')}
									</strong>
								</div>
								<div>소요 시간: {itinerary.totalDurationMinutes}분</div>
								<div>환승 횟수: {itinerary.transferCount}회</div>
								<div>
									총 요금: {itinerary.pricing.totalBeforeCoupon}₴ (할인 전:{' '}
									{itinerary.pricing.subtotal}₴)
								</div>
								<div style={{ marginTop: '5px' }}>
									<strong>구간:</strong>
									<ul>
										{itinerary.legs.map((leg, idx) => (
											<li key={leg.legId}>
												{idx + 1}. {leg.lineName}: {leg.fromStation.name} →{' '}
												{leg.toStation.name} ({leg.finalFare}₴)
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
