import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/**
 * MSW 브라우저 워커
 *
 * 개발 환경에서 API 요청을 가로채서 목 데이터를 반환합니다.
 */
export const worker = setupWorker(...handlers)

/**
 * 워커 시작
 *
 * 개발 환경에서만 실행됩니다.
 */
export async function startMockServiceWorker(): Promise<void> {
	if (import.meta.env.DEV) {
		await worker.start({
			onUnhandledRequest: 'warn',
			serviceWorker: {
				url: '/mockServiceWorker.js',
			},
		})
		console.log('[MSW] Mock Service Worker가 시작되었습니다 🧽')
	}
}
