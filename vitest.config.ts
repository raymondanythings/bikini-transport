import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['__tests__/HomePage.test.tsx', '__tests__/PaymentPage.test.tsx', '__tests__/SeatSelectionPage.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-*.tsx',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'styled-system/',
        'src/generated/',
      ],
    },
  },
});
