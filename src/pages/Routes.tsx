import { createBrowserRouter, RouterProvider } from 'react-router';
import { HomePage } from './HomePage';
import { PaymentPage } from './PaymentPage';
import { PaymentSuccessPage } from './PaymentSuccessPage';
import { SeatSelectionPage } from './SeatSelectionPage';

export const Routes = () => {
  return (
    <RouterProvider
      router={createBrowserRouter([
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
      ])}
    />
  );
};
