import type { components } from '@/generated/api-types'

type Station = components['schemas']['Station']

/**
 * 비키니시티 전체 역(정류장) 데이터
 *
 * 3개 노선의 모든 정류장을 포함합니다:
 * - 시티선 (City Line)
 * - 외곽선 (Suburban Line)
 * - 투어선 (Tour Line)
 */
export const stations: Station[] = [
	// 시티선 정류장
	{
		stationId: 'new-kelp-city',
		name: '뉴캘프시티',
		location: [37.5665, 126.978],
	},
	{
		stationId: 'glove-world',
		name: '글러브월드',
		location: [37.5701, 126.9822],
	},
	{
		stationId: 'jellyfish-fields',
		name: '해파리초원',
		location: [37.5742, 126.9865],
	},
	{
		stationId: 'bikini-city',
		name: '비키니시티',
		location: [37.5794, 126.9923], // 중심 환승역
	},
	{
		stationId: 'floaters-cemetery',
		name: '플로터스묘지',
		location: [37.5848, 126.9981],
	},
	{
		stationId: 'bubble-city',
		name: '버블시티',
		location: [37.5902, 127.0042],
	},

	// 외곽선 정류장 (중복 제외)
	{
		stationId: 'merong-city',
		name: '메롱시티',
		location: [37.5825, 127.0109],
	},
	{
		stationId: 'squidward-villa',
		name: '징징빌라',
		location: [37.5768, 127.0145],
	},
	{
		stationId: 'bikini-atoll',
		name: '비키니환초',
		location: [37.5712, 127.0182],
	},

	// 투어선 정류장 (중복 제외)
	{
		stationId: 'old-lagoon',
		name: '구 라군',
		location: [37.5655, 127.0238],
	},
	{
		stationId: 'kelp-forest',
		name: '다시마숲',
		location: [37.5598, 127.0195],
	},
]

/**
 * 역 ID로 역 정보 조회
 */
export function getStationById(stationId: string): Station | undefined {
	return stations.find((station) => station.stationId === stationId)
}

/**
 * 여러 역 ID로 역 정보 목록 조회
 */
export function getStationsByIds(stationIds: string[]): Station[] {
	return stationIds
		.map((id) => getStationById(id))
		.filter((station): station is Station => station !== undefined)
}
