import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  withPageLayout?: boolean;
}

function PageWrapper({ children, route = '/' }: { children: ReactNode; route?: string }) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: children,
      },
      {
        path: '/seat-selection',
        element: children,
      },
      {
        path: '/payment',
        element: children,
      },
      {
        path: '/payment-success',
        element: children,
      },
    ],
    {
      initialEntries: [route],
      initialIndex: 0,
    }
  );

  return <RouterProvider router={router} />;
}

export function renderWith(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { route = '/', ...renderOptions } = options;

  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => <PageWrapper route={route}>{children}</PageWrapper>,
    ...renderOptions,
  });
}
