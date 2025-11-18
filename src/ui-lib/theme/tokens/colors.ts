import { defineTokens } from '@pandacss/dev';

export const colors = defineTokens.colors({
  current: { value: 'currentColor' },

  primary: {
    normal: {
      value: '#3182f6',
    },
    strong: {
      value: '#1b64da',
    },
    heavy: {
      value: '#1957c2',
    },
    light: {
      value: '#e8f3ff',
    },
  },
  secondary: {
    normal: {
      value: '#6AB6F0',
    },
    strong: {
      value: '#469FE3',
    },
    heavy: {
      value: '#2087D6',
    },
    light: {
      value: '#E7F3FE',
    },
  },
  label: {
    normal: {
      value: '#171717',
    },
    neutral: {
      value: '#505050',
    },
    alternative: {
      value: '#767676',
    },
    disable: {
      value: '#999999',
    },
    inverse: {
      value: '#FFFFFF',
    },
  },

  background: {
    normal: {
      value: '#FFFFFF',
    },
    neutral: {
      value: '#F7F7F8',
    },
    alternative: {
      value: '#E1E3E3',
    },
  },
  line: {
    normal: {
      value: '#E0E0E2',
    },
    neutral: {
      value: '#E8E8EA',
    },
    alternative: {
      value: '#F4F4F5',
    },
  },
  status: {
    positive: {
      value: '#00CD49',
    },
    safety: {
      value: '#414EFF',
    },
    destructive: {
      value: '#FF1C35',
    },
  },
  static: {
    white: {
      value: '#FFFFFF',
    },
    lightGray: {
      value: '#CDD2D8',
    },
    darkGray: {
      value: '#4B4B4B',
    },
    black: {
      value: '#000000',
    },
  },

  bus: {
    tour: { value: '#FF534F' },
    city: { value: '#FAAB9E' },
    suburb: { value: '#B7DCCA' },
  },
});
