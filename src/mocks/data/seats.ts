import type { components } from '@/generated/api-types';

type Seat = components['schemas']['Seat'];
type SeatLayout = components['schemas']['SeatLayout'];

/**
 * 좌석 배치 템플릿
 *
 * 모든 버스는 동일한 좌석 배치를 사용합니다:
 * - 6행 x 4열 = 총 24석
 * - 좌석 번호: 1A~6D
 * - 좌석 배치: A(창), B(통로) | 통로 | C(통로), D(창)
 */
const SEAT_ROWS = 6;
const SEAT_COLUMNS = 4;

/**
 * 좌석 번호 생성 (1A, 1B, 2A, 2B, ...)
 */
function generateSeatNumber(row: number, column: number): string {
  const columnLetter = String.fromCharCode(65 + column); // A, B, C, D
  return `${row + 1}${columnLetter}`;
}

/**
 * 좌석 위치 결정 (창가 vs 통로)
 */
function getSeatPosition(column: number): 'WINDOW' | 'AISLE' {
  // A(0)와 D(3)는 창가, B(1)와 C(2)는 통로
  return column === 0 || column === 3 ? 'WINDOW' : 'AISLE';
}

/**
 * 기본 좌석 배치 생성
 */
function generateSeats(): Seat[] {
  const seats: Seat[] = [];

  for (let row = 0; row < SEAT_ROWS; row++) {
    for (let column = 0; column < SEAT_COLUMNS; column++) {
      seats.push({
        seatNumber: generateSeatNumber(row, column),
        row,
        column,
        position: getSeatPosition(column),
        isAvailable: true,
        isReserved: false,
      });
    }
  }

  return seats;
}

/**
 * 특정 구간의 좌석 레이아웃 생성
 *
 * @param legId - 구간 ID
 * @param reservedSeats - 이미 예약된 좌석 번호 목록
 */
export function createSeatLayout(legId: string, reservedSeats: string[] = []): SeatLayout {
  const seats = generateSeats().map(seat => ({
    ...seat,
    isReserved: reservedSeats.includes(seat.seatNumber),
    isAvailable: !reservedSeats.includes(seat.seatNumber),
  }));

  return {
    legId,
    rows: SEAT_ROWS,
    columns: SEAT_COLUMNS,
    seats,
  };
}

/**
 * 랜덤 좌석 예약 시뮬레이션
 *
 * 일부 좌석을 랜덤하게 예약 상태로 만들어 현실적인 상황 연출
 */
export function simulateRandomReservations(count: number = 5): string[] {
  const allSeats = generateSeats();
  const shuffled = [...allSeats].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(seat => seat.seatNumber);
}
