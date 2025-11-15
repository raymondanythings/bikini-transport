import { PageLayout } from './pages/PageLayout';
import { Routes } from './pages/Routes';
import { TestApiPage } from './test-api';

function App() {
  // 개발 환경에서는 API 테스트 페이지를 기본으로 표시
  // 실제 페이지로 전환하려면 아래 조건문을 제거하세요
  if (true) {
    return <TestApiPage />;
  }

  return (
    <PageLayout>
      <Routes />
    </PageLayout>
  );
}

export default App;
