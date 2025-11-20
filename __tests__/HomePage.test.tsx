import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HomePage } from '@/pages/HomePage';
import { renderWith } from './render-with';

describe('home', () => {
  it('출발지 바텀싯에서 정류장을 선택하면 출발지에 해당 정류장이 반영된다.', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    const 출발Button = screen.getByRole('button', { name: /출발/i });
    await user.click(출발Button);

    // 바텀싯이 열릴 때까지 대기
    await waitFor(() => {
      // 바텀싯의 텍스트가 나타나는지 확인
      const stationSearchText = screen.queryByText('정류장 검색');
      expect(stationSearchText).not.toBeNull();

      // 검색 입력 필드가 나타나는지 확인
      const searchInput = screen.queryByPlaceholderText('버스 정류장을 검색해주세요');
      expect(searchInput).not.toBeNull();
    });

    // 바텀싯 안의 정류장 선택
    // 정류장 리스트가 렌더링될 때까지 기다림
    const 메롱시티Text = await screen.findByText('메롱시티', {}, { timeout: 1000 });

    // 버튼을 찾아서 클릭
    const 메롱시티Button = 메롱시티Text.closest('button');
    expect(메롱시티Button).not.toBeNull();
    await user.click(메롱시티Button!);

    // 출발지 버튼이 업데이트될 때까지 기다림
    await waitFor(() => {
      const departureButtonAfterSelect = screen.getByRole('button', { name: /출발/i });
      expect(departureButtonAfterSelect.textContent).toContain('메롱시티');
    });
  });

  it('출발지와 도착지 스왑 버튼을 누르면 출발지와 도착지가 바뀐다.', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    // 스왑 전 상태 확인
    const departureButtonBeforeSwap = screen.getByRole('button', { name: /출발/i });
    const arrivalButtonBeforeSwap = screen.getByRole('button', { name: /도착/i });
    expect(departureButtonBeforeSwap.textContent).toContain('비키니시티');
    expect(arrivalButtonBeforeSwap.textContent).toContain('구-라군');

    // 스왑 버튼 찾기
    const swapButton = screen.getByTestId('swap-button');
    await user.click(swapButton);

    // 스왑 후 상태 확인
    await waitFor(() => {
      const departureButtonAfterSwap = screen.getByRole('button', { name: /출발/i });
      const arrivalButtonAfterSwap = screen.getByRole('button', { name: /도착/i });
      expect(departureButtonAfterSwap.textContent).toContain('구-라군');
      expect(arrivalButtonAfterSwap.textContent).toContain('비키니시티');
    });
  });

  it('DateTimePicker에서 날짜를 선택하면 선택한 날짜가 화면에 표시된다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    // 날짜 버튼 클릭
    const 가는날Text = screen.getByText('가는날');
    const dateButton = 가는날Text.closest('button');
    expect(dateButton).not.toBeNull();
    await user.click(dateButton!);

    // DateTimePicker 바텀싯이 열릴 때까지 대기
    await waitFor(() => {
      const headerText = screen.queryByText('출발 시간 설정');
      expect(headerText).not.toBeNull();
    });

    // 오늘 9:23 PM 선택하기
    // 오후 선택
    const 오후Elements = screen.getAllByText('오후');
    const 오후Item = 오후Elements[0];
    await user.click(오후Item);

    // 9시 선택
    await waitFor(() => {
      const hour9Elements = screen.getAllByText('9');
      expect(hour9Elements.length).toBeGreaterThan(0);
    });
    const hour9Elements = screen.getAllByText('9');
    const hour9Item = hour9Elements[0];
    await user.click(hour9Item);

    // 23분 선택
    await waitFor(() => {
      const minute23Elements = screen.getAllByText('23');
      expect(minute23Elements.length).toBeGreaterThan(0);
    });
    const minute23Elements = screen.getAllByText('23');
    const minute23Item = minute23Elements[0];
    await user.click(minute23Item);

    // 확인 버튼 클릭
    const confirmButton = screen.getByRole('button', { name: /확인/i });
    await user.click(confirmButton);

    // 날짜 버튼이 업데이트되었는지 확인 (오늘 09:23 PM)
    await waitFor(() => {
      const updatedDateButton = screen.getByRole('button', { name: /가는날/i });
      expect(updatedDateButton.textContent).toContain('09:23 PM');
    });
  });
});
