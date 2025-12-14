import '@testing-library/jest-dom/vitest';

// ResizeObserver mock
global.ResizeObserver = class ResizeObserver {
  observe() {
    // noop
  }
  unobserve() {
    // noop
  }
  disconnect() {
    // noop
  }
};
