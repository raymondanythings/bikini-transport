import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  slideUp: {
    from: { transform: 'translateY(100%)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(100%)', opacity: '0' },
  },
});
