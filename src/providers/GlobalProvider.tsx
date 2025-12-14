import { OverlayProvider } from 'overlay-kit';
import { ToastProvider } from '@/ui-lib/components/Toast';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OverlayProvider>
      <ToastProvider>{children}</ToastProvider>
    </OverlayProvider>
  );
};

export { GlobalProvider };
