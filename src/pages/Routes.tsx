import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { GlobalProvider } from '@/providers/GlobalProvider';
import { HomePage } from './HomePage';
import { PageLayout } from './PageLayout';
import { PaymentPage } from './PaymentPage';
import { PaymentSuccessPage } from './PaymentSuccessPage';
import { SeatSelectionPage } from './SeatSelectionPage';

export const Routes = () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '/',
          element: (
            <GlobalProvider>
              <PageLayout>
                <Outlet />
              </PageLayout>
            </GlobalProvider>
          ),
          children: [
            {
              path: '/',
              element: <HomePage />,
            },
            {
              path: '/seat-selection',
              element: <SeatSelectionPage />,
            },
            {
              path: '/payment',
              element: <PaymentPage />,
            },
            {
              path: '/payment-success',
              element: <PaymentSuccessPage />,
            },
          ],
        },
      ])}
    />
  );
};
