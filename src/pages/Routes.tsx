import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from './HomePage'
import { PaymentPage } from './PaymentPage'
import { SeatSelectionPage } from './SeatSelectionPage'

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
      ])}
    />
  )
}
