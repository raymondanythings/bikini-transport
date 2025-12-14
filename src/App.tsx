import { PageLayout } from './pages/PageLayout';
import { Routes } from './pages/Routes';
import { GlobalProvider } from './providers/GlobalProvider';

function App() {
  return (
    <GlobalProvider>
      <PageLayout>
        <Routes />
      </PageLayout>
    </GlobalProvider>
  );
}

export default App;
