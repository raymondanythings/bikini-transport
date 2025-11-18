import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HomePage } from '@/pages/HomePage';
import { renderWith } from './render-with';

describe('home', () => {
  it('[테스트] 출발지를 누르면 정류장 리스트가 들어 있는 바텀싯이 올라온다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    await waitFor(() => {
      expect(screen.getByText('Departure')).toBeInTheDocument();
    });

    // 초기 상태에서 바텀싯이 닫혀있는지 확인
    const allBottomSheets = screen.queryAllByTestId('bottom-sheet');
    const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
    if (stationSearchBottomSheet) {
      expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'closed');
    }

    const departureButton = screen.getByText('Departure').closest('button');
    expect(departureButton).toBeInTheDocument();

    await user.click(departureButton!);

    // 버튼 클릭 후 바텀싯이 열리는지 확인
    await waitFor(() => {
      const allBottomSheets = screen.getAllByTestId('bottom-sheet');
      const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
      expect(stationSearchBottomSheet).toBeInTheDocument();
      expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'open');
    });

    expect(screen.getByText('정류장 검색')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('버스 정류장을 검색해주세요')).toBeInTheDocument();
  });

  it('[테스트] 도착지를 누르면 정류장 리스트가 들어 있는 바텀싯이 올라온다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    await waitFor(() => {
      expect(screen.getByText('Arrival')).toBeInTheDocument();
    });

    // 초기 상태에서 바텀싯이 닫혀있는지 확인
    const allBottomSheets = screen.queryAllByTestId('bottom-sheet');
    const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
    if (stationSearchBottomSheet) {
      expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'closed');
    }

    const arrivalButton = screen.getByText('Arrival').closest('button');
    expect(arrivalButton).toBeInTheDocument();

    await user.click(arrivalButton!);

    // 버튼 클릭 후 바텀싯이 열리는지 확인
    await waitFor(() => {
      const allBottomSheets = screen.getAllByTestId('bottom-sheet');
      const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
      expect(stationSearchBottomSheet).toBeInTheDocument();
      expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'open');
    });

    expect(screen.getByText('정류장 검색')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('버스 정류장을 검색해주세요')).toBeInTheDocument();
  });

  it('[테스트] 텍스트필드에 입력한 정류장 리스트만 필터링되어야 한다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    const departureButton = screen.getByText('Departure').closest('button');
    await user.click(departureButton!);

    // 초기 상태에서 모든 정류장이 표시되는지 확인
    // -------------------- TODO: 서버에서 정류장 받아오기 --------------------
    expect(screen.getByText('버스 정류장 이름1')).toBeInTheDocument();
    expect(screen.getByText('버스 정류장 이름2')).toBeInTheDocument();
    expect(screen.getByText('버스 정류장 이름3')).toBeInTheDocument();
    expect(screen.getByText('버스 정류장 이름4')).toBeInTheDocument();
    expect(screen.getByText('버스 정류장 이름5')).toBeInTheDocument();

    // 검색어 입력
    const searchInput = screen.getByPlaceholderText('버스 정류장을 검색해주세요');
    await user.type(searchInput, '이름1');

    // 필터링된 결과만 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('버스 정류장 이름1')).toBeInTheDocument();
    });
    expect(screen.queryByText('버스 정류장 이름2')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름3')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름4')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름5')).not.toBeInTheDocument();

    // 검색어 변경
    await user.clear(searchInput);
    await user.type(searchInput, '이름2');

    // 모든 정류장이 다시 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('버스 정류장 이름2')).toBeInTheDocument();
    });
    expect(screen.queryByText('버스 정류장 이름1')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름3')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름4')).not.toBeInTheDocument();
    expect(screen.queryByText('버스 정류장 이름5')).not.toBeInTheDocument();
    // -------------------- TODO: 서버에서 정류장 받아오기 --------------------
  });

  it('[테스트] 출발지와 도착지를 올바르게 표시한다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    const departureButton = screen.getByText('Departure').closest('button');
    await user.click(departureButton!);

    // 정류장 선택
    const allStations = screen.getAllByText('버스 정류장 이름1');
    const stationInBottomSheet = allStations.find(station => {
      const bottomSheet = station.closest('[data-testid="bottom-sheet"]');
      return bottomSheet?.getAttribute('data-state') === 'open';
    });
    expect(stationInBottomSheet).toBeInTheDocument();
    await user.click(stationInBottomSheet!);

    // 바텀싯이 닫히고 출발지 영역에 선택한 정류장이 표시되는지 확인
    await waitFor(() => {
      const allBottomSheets = screen.queryAllByTestId('bottom-sheet');
      const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
      if (stationSearchBottomSheet) {
        expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'closed');
      }
    });

    const departureButtonAfterSelect = screen.getByText('Departure').closest('button');
    expect(departureButtonAfterSelect?.textContent).toContain('버스 정류장 이름1');
    expect(screen.getByText('BIKINI BOTTOM')).toBeInTheDocument(); // 도착지는 변경되지 않음

    // 도착지 버튼 클릭
    const arrivalButton = screen.getByText('Arrival').closest('button');
    await user.click(arrivalButton!);

    // 바텀싯이 열리는지 확인
    await waitFor(() => {
      expect(screen.getByPlaceholderText('버스 정류장을 검색해주세요')).toBeInTheDocument();
    });

    // 정류장 선택
    const allStations2 = screen.getAllByText('버스 정류장 이름2');
    const stationInBottomSheet2 = allStations2.find(station => {
      const bottomSheet = station.closest('[data-testid="bottom-sheet"]');
      return bottomSheet?.getAttribute('data-state') === 'open';
    });
    expect(stationInBottomSheet2).toBeInTheDocument();
    await user.click(stationInBottomSheet2!);

    // 바텀싯이 닫히고 도착지 영역에 선택한 정류장이 표시되는지 확인
    await waitFor(() => {
      const allBottomSheets = screen.queryAllByTestId('bottom-sheet');
      const stationSearchBottomSheet = allBottomSheets.find(sheet => sheet.textContent?.includes('정류장 검색'));
      if (stationSearchBottomSheet) {
        expect(stationSearchBottomSheet).toHaveAttribute('data-state', 'closed');
      }
    });

    const arrivalButtonAfterSelect = screen.getByText('Arrival').closest('button');
    expect(arrivalButtonAfterSelect?.textContent).toContain('버스 정류장 이름2');

    // 출발지는 변경되지 않았는지 확인 (출발지 버튼 내부의 텍스트 확인)
    expect(departureButtonAfterSelect?.textContent).toContain('버스 정류장 이름1');
  });

  it('[테스트] 출발지와 도착지 스왑 버튼을 누르면 출발지와 도착지가 바뀐다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    // 초기 상태 확인
    expect(screen.getByText('JINGJING BILA')).toBeInTheDocument();
    expect(screen.getByText('BIKINI BOTTOM')).toBeInTheDocument();

    // 스왑 전 상태 확인
    const departureButtonBeforeSwap = screen.getByText('Departure').closest('button');
    const arrivalButtonBeforeSwap = screen.getByText('Arrival').closest('button');
    expect(departureButtonBeforeSwap?.textContent).toContain('JINGJING BILA');
    expect(arrivalButtonBeforeSwap?.textContent).toContain('BIKINI BOTTOM');

    // 스왑 버튼 클릭
    const swapButton = screen.getByLabelText('출발지와 도착지 바꾸기');
    await user.click(swapButton);

    // 스왑 후 상태 확인
    await waitFor(() => {
      const departureButtonAfterSwap = screen.getByText('Departure').closest('button');
      const arrivalButtonAfterSwap = screen.getByText('Arrival').closest('button');
      expect(departureButtonAfterSwap?.textContent).toContain('BIKINI BOTTOM');
      expect(arrivalButtonAfterSwap?.textContent).toContain('JINGJING BILA');
    });
  });

  it('[테스트] 달력 아이콘을 클릭하면 DateTimePicker가 열린다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    await waitFor(() => {
      expect(screen.getByText('DATE')).toBeInTheDocument();
    });

    // 달력 아이콘 찾기
    const calendarIcon = screen.getByTestId('calendar-outlined');
    expect(calendarIcon).toBeInTheDocument();

    // 달력 아이콘을 포함한 버튼 찾기
    const dateButton = calendarIcon.closest('button');
    expect(dateButton).toBeInTheDocument();

    await user.click(dateButton!);

    // DateTimePicker가 렌더링되는지 확인
    await waitFor(() => {
      expect(screen.getByText('오늘')).toBeInTheDocument();
      expect(screen.getByText('오전')).toBeInTheDocument();
      expect(screen.getByText('오후')).toBeInTheDocument();
    });
  });

  it('[테스트] DateTimePicker에서 날짜를 선택하면 선택한 날짜가 화면에 표시된다', async () => {
    const user = userEvent.setup();
    renderWith(<HomePage />, { route: '/' });

    await waitFor(() => {
      expect(screen.getByText('DATE')).toBeInTheDocument();
    });

    // 달력 아이콘 클릭
    await user.click(dateButton!);

    // DateTimePicker가 열려있는 동안 날짜가 표시되는지 확인
    const dateDisplayText = dateButton?.textContent;
    expect(dateDisplayText).toMatch(/\w+ \d+ \d{2}:\d{2} (AM|PM)/);
  });
});
