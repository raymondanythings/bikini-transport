import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * MSW 초기화 및 앱 렌더링
 */
async function prepare() {
	if (import.meta.env.DEV) {
		const { startMockServiceWorker } = await import('./mocks/browser')
		await startMockServiceWorker()
	}
}

prepare().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
})
