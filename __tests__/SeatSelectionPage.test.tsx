import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SeatSelectionPage } from '@/pages/SeatSelectionPage';
import { renderWith } from './render-with';

describe('seat-selection', () => {
  it('좌석을 클릭하면 선택되고 잔여 좌석 수가 줄어든다.', async () => {
    const user = userEvent.setup();
    renderWith(<SeatSelectionPage />, { route: '/seat-selection' });

    const initialRemainingSeats = getRemainingSeatsCount();

    // 사용 가능한 좌석 찾기 및 클릭
    const availableSeat = findAvailableSeat();
    await user.click(availableSeat);

    // 잔여 좌석이 1개 줄어들었는지 확인
    const newRemainingSeats = getRemainingSeatsCount();
    expect(newRemainingSeats).toBe(initialRemainingSeats - 1);
    expect(screen.getByText(/선택 완료 1\//)).toBeInTheDocument();
  });

  it('여러 좌석을 선택할 수 있다.', async () => {
    const user = userEvent.setup();
    renderWith(<SeatSelectionPage />, { route: '/seat-selection' });

    // 초기 상태에서 잔여 좌석 수와 전체 좌석 수 추출
    let remainingSeats = getRemainingSeatsCount();

    // 첫 번째 좌석 선택
    const firstSeat = findAvailableSeat();
    await user.click(firstSeat);
    let previousRemainingSeats = remainingSeats;
    remainingSeats = getRemainingSeatsCount();
    expect(remainingSeats).toBe(previousRemainingSeats - 1);
    expect(screen.getByText(/선택 완료 1\//)).toBeInTheDocument();

    // 두 번째 좌석 선택
    const secondSeat = findAvailableSeat();
    await user.click(secondSeat);
    previousRemainingSeats = remainingSeats;
    remainingSeats = getRemainingSeatsCount();
    expect(remainingSeats).toBe(previousRemainingSeats - 1);
    expect(screen.getByText(/선택 완료 2\//)).toBeInTheDocument();

    // 세 번째 좌석 선택
    const thirdSeat = findAvailableSeat();
    await user.click(thirdSeat);
    previousRemainingSeats = remainingSeats;
    remainingSeats = getRemainingSeatsCount();
    expect(remainingSeats).toBe(previousRemainingSeats - 1);
    expect(screen.getByText(/선택 완료 3\//)).toBeInTheDocument();
  });

  it('선택된 좌석을 다시 클릭하면 선택을 해제한다.', async () => {
    const user = userEvent.setup();
    renderWith(<SeatSelectionPage />, { route: '/seat-selection' });

    // 초기 상태에서 잔여 좌석 수와 전체 좌석 수 추출
    const initialRemainingSeats = getRemainingSeatsCount();

    // 좌석 선택
    const selectedSeat = findAvailableSeat();
    await user.click(selectedSeat);
    let remainingSeats = getRemainingSeatsCount();
    expect(remainingSeats).toBe(initialRemainingSeats - 1);
    expect(screen.getByText(/선택 완료 1\//)).toBeInTheDocument();

    // 같은 좌석 다시 클릭하여 선택 해제
    await user.click(selectedSeat);
    remainingSeats = getRemainingSeatsCount();
    expect(remainingSeats).toBe(initialRemainingSeats);
    expect(screen.getByText(/선택 완료 0\//)).toBeInTheDocument();
  });
});

function getRemainingSeatsCount(): number {
  const remainingSeatsText = screen.getByText(/잔여 \d+석/);
  const match = remainingSeatsText.textContent?.match(/잔여 (\d+)석/);
  if (!match) {
    throw new Error('잔여 좌석 수를 찾을 수 없습니다.');
  }
  return Number.parseInt(match[1], 10);
}

/**
 * 1A, 1B, 1C, 1D, 2A... 순서로 순회하면서 disabled나 selected가 아닌 최초의 좌석을 찾기
 */
function findAvailableSeat(): HTMLElement {
  const rows = [1, 2, 3, 4, 5];
  const columns = ['A', 'B', 'C', 'D'];

  for (const row of rows) {
    for (const column of columns) {
      const seatNumber = `${row}${column}`;
      try {
        const seatButton = screen.getByRole('button', { name: new RegExp(seatNumber, 'i') });
        const status = seatButton.getAttribute('data-status');

        // data-status가 'available'인 좌석만 반환 (disabled나 selected가 아닌)
        if (status === 'available') {
          return seatButton;
        }
      } catch {
        // 좌석을 찾을 수 없으면 다음 좌석으로
        continue;
      }
    }
  }

  throw new Error('사용 가능한 좌석을 찾을 수 없습니다.');
}
