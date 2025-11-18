import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeatSelectionPage } from '@/pages/SeatSelectionPage';
import { renderWith } from './render-with';

describe('seat-selection', () => {
  it('[테스트] 좌석 선택 화면을 띄운다', () => {
    renderWith(<SeatSelectionPage />, { route: '/seat-selection' });

    expect(screen.getByText('좌석 선택')).toBeInTheDocument();

    expect(screen.getByText(/전체 \d+석/)).toBeInTheDocument();
    expect(screen.getByText(/잔여 \d+석/)).toBeInTheDocument();
  });
});
