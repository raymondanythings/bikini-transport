import { PageLayout } from './pages/PageLayout';
import { Routes } from './pages/Routes';
import { TestApiPage } from './test-api';
import TestPathfinding from './test-pathfinding';

function App() {
  // URL 쿼리 파라미터로 페이지 선택
  // ?test=pathfinding → 경로 계산 검증 페이지
  // ?test=api → API 테스트 페이지 (기본값)
  const params = new URLSearchParams(window.location.search);
  const testMode = params.get('test');

  if (testMode === 'pathfinding') {
    return <TestPathfinding />;
  }

  // 개발 환경에서는 API 테스트 페이지를 기본으로 표시
  // 실제 페이지로 전환하려면 아래 조건문을 제거하세요
  if (true) {
    return (
      <>
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
          <a
            href="?test=pathfinding"
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            🧪 경로 계산 검증
          </a>
        </div>
        <TestApiPage />
      </>
    );
  }

  return (
    <PageLayout>
      <Routes />
    </PageLayout>
  );
}

export default App;
