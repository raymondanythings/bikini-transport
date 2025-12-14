import { describe, expect, it } from 'vitest';
import {
  findDirectLine,
  getLineById,
  getLineDirection,
  getLinesByStation,
  getStopsCount,
  isBidirectional,
  LINE_UUIDS,
  lines,
} from './lines';
import { STATION_UUIDS } from './stations';

describe('노선 유틸리티 (Lines)', () => {
  describe('getLineById', () => {
    it('시티선 조회', () => {
      const line = getLineById(LINE_UUIDS.CITY_LINE);
      expect(line).toBeDefined();
      expect(line!.name).toBe('시티선');
      expect(line!.type).toBe('CITY');
    });

    it('외곽선 조회', () => {
      const line = getLineById(LINE_UUIDS.SUBURB_LINE);
      expect(line).toBeDefined();
      expect(line!.name).toBe('외곽선');
      expect(line!.type).toBe('SUBURB');
    });

    it('투어선 조회', () => {
      const line = getLineById(LINE_UUIDS.TOUR_LINE);
      expect(line).toBeDefined();
      expect(line!.name).toBe('투어선');
      expect(line!.type).toBe('TOUR');
    });

    it('존재하지 않는 노선 조회 시 undefined 반환', () => {
      const line = getLineById('invalid-line-id');
      expect(line).toBeUndefined();
    });
  });

  describe('노선 운행 방향', () => {
    it('시티선: 양방향', () => {
      expect(isBidirectional(LINE_UUIDS.CITY_LINE)).toBe(true);
      expect(getLineDirection(LINE_UUIDS.CITY_LINE)).toBe('BIDIRECTIONAL');
    });

    it('외곽선: 단방향', () => {
      expect(isBidirectional(LINE_UUIDS.SUBURB_LINE)).toBe(false);
      expect(getLineDirection(LINE_UUIDS.SUBURB_LINE)).toBe('UNIDIRECTIONAL');
    });

    it('투어선: 양방향', () => {
      expect(isBidirectional(LINE_UUIDS.TOUR_LINE)).toBe(true);
      expect(getLineDirection(LINE_UUIDS.TOUR_LINE)).toBe('BIDIRECTIONAL');
    });
  });

  describe('getLinesByStation', () => {
    it('비키니시티: 3개 노선 (시티선, 외곽선, 투어선)', () => {
      const stationLines = getLinesByStation(STATION_UUIDS.BIKINI_CITY);
      expect(stationLines).toHaveLength(3);

      const lineNames = stationLines.map(l => l.name).sort();
      expect(lineNames).toEqual(['시티선', '외곽선', '투어선']);
    });

    it('버블타운: 2개 노선 (시티선, 외곽선)', () => {
      const stationLines = getLinesByStation(STATION_UUIDS.BUBBLE_TOWN);
      expect(stationLines).toHaveLength(2);

      const lineNames = stationLines.map(l => l.name).sort();
      expect(lineNames).toEqual(['시티선', '외곽선']);
    });

    it('글러브월드: 2개 노선 (시티선, 투어선)', () => {
      const stationLines = getLinesByStation(STATION_UUIDS.GLOVE_WORLD);
      expect(stationLines).toHaveLength(2);

      const lineNames = stationLines.map(l => l.name).sort();
      expect(lineNames).toEqual(['시티선', '투어선']);
    });

    it('메롱시티: 1개 노선 (외곽선)', () => {
      const stationLines = getLinesByStation(STATION_UUIDS.ROCK_BOTTOM);
      expect(stationLines).toHaveLength(1);
      expect(stationLines[0].name).toBe('외곽선');
    });

    it('존재하지 않는 역: 빈 배열', () => {
      const stationLines = getLinesByStation('invalid-station-id');
      expect(stationLines).toEqual([]);
    });
  });

  describe('findDirectLine', () => {
    it('비키니시티 → 버블타운: 시티선', () => {
      const line = findDirectLine(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN);
      expect(line).toBeDefined();
      expect(line!.lineId).toBe(LINE_UUIDS.CITY_LINE);
    });

    it('비키니시티 → 징징빌라: 외곽선', () => {
      const line = findDirectLine(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES);
      expect(line).toBeDefined();
      expect(line!.lineId).toBe(LINE_UUIDS.SUBURB_LINE);
    });

    it('같은 역: undefined', () => {
      const line = findDirectLine(STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BIKINI_CITY);
      expect(line).toBeUndefined();
    });

    it('직행 노선 없음: undefined', () => {
      const line = findDirectLine(STATION_UUIDS.ROCK_BOTTOM, STATION_UUIDS.JELLYFISH_FIELDS);
      expect(line).toBeUndefined();
    });
  });

  describe('getStopsCount - 정거장 수 계산', () => {
    const cityLine = lines.find(l => l.lineId === LINE_UUIDS.CITY_LINE)!;
    const SUBURBLine = lines.find(l => l.lineId === LINE_UUIDS.SUBURB_LINE)!;
    const tourLine = lines.find(l => l.lineId === LINE_UUIDS.TOUR_LINE)!;

    describe('양방향 순환 (시티선)', () => {
      it('순방향: 비키니시티(0) → 버블타운(2) = 2구간', () => {
        const stops = getStopsCount(cityLine, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN);
        expect(stops).toBe(2);
      });

      it('역방향이 더 짧음: 버블타운(2) → 플로터스묘지(1) = 1구간 (역방향)', () => {
        const stops = getStopsCount(cityLine, STATION_UUIDS.BUBBLE_TOWN, STATION_UUIDS.FLOATERS_CEMETERY);
        // 순방향: 2→3→4→0→1 = 4구간
        // 역방향: 2→1 = 1구간 ✓
        expect(stops).toBe(1);
      });

      it('순환 경로: 글러브월드(4) → 비키니시티(0) = 1구간 (순환)', () => {
        const stops = getStopsCount(cityLine, STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY);
        // 순방향: 4→0 = 1구간 (순환) ✓
        // 역방향: 4→3→2→1→0 = 4구간
        expect(stops).toBe(1);
      });
    });

    describe('단방향 순환 (외곽선)', () => {
      it('순방향: 비키니시티(0) → 버블타운(2) = 2구간', () => {
        const stops = getStopsCount(SUBURBLine, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BUBBLE_TOWN);
        expect(stops).toBe(2);
      });

      it('순환 경로: 징징빌라(4) → 비키니시티(0) = 1구간 (순환)', () => {
        const stops = getStopsCount(SUBURBLine, STATION_UUIDS.TENTACLE_ACRES, STATION_UUIDS.BIKINI_CITY);
        // 단방향은 항상 순방향만: 4→0 = 1구간 (순환)
        expect(stops).toBe(1);
      });

      it('전체 순환: 비키니시티(0) → 징징빌라(4) = 4구간', () => {
        const stops = getStopsCount(SUBURBLine, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.TENTACLE_ACRES);
        expect(stops).toBe(4);
      });
    });

    describe('양방향 순환 (투어선)', () => {
      it('순방향: 비키니시티(0) → 글러브월드(1) = 1구간', () => {
        const stops = getStopsCount(tourLine, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.GLOVE_WORLD);
        expect(stops).toBe(1);
      });

      it('역방향이 더 짧음: 글러브월드(1) → 비키니시티(0) = 1구간 (역방향)', () => {
        const stops = getStopsCount(tourLine, STATION_UUIDS.GLOVE_WORLD, STATION_UUIDS.BIKINI_CITY);
        // 순방향: 1→2→3→4→0 = 4구간
        // 역방향: 1→0 = 1구간 ✓
        expect(stops).toBe(1);
      });

      it('순방향과 역방향 동일: 해파리초원(4) → 글러브월드(1) = 2구간', () => {
        const stops = getStopsCount(tourLine, STATION_UUIDS.JELLYFISH_FIELDS, STATION_UUIDS.GLOVE_WORLD);
        // 순방향: 4→0→1 = 2구간 ✓
        // 역방향: 4→3→2→1 = 3구간
        expect(stops).toBe(2);
      });
    });

    describe('경계 조건', () => {
      it('같은 역: 0구간', () => {
        const stops = getStopsCount(cityLine, STATION_UUIDS.BIKINI_CITY, STATION_UUIDS.BIKINI_CITY);
        expect(stops).toBe(0);
      });

      it('역이 노선에 없음: 에러', () => {
        expect(() => {
          getStopsCount(cityLine, 'invalid-station-1', 'invalid-station-2');
        }).toThrow('Station not found in line');
      });
    });
  });

  describe('노선 요금 정보', () => {
    it('시티선: 기본 10₴, 정거장당 2₴', () => {
      const line = getLineById(LINE_UUIDS.CITY_LINE)!;
      expect(line.baseFare).toBe(10);
      expect(line.extraFarePerStop).toBe(2);
    });

    it('외곽선: 기본 25₴, 정거장당 8₴', () => {
      const line = getLineById(LINE_UUIDS.SUBURB_LINE)!;
      expect(line.baseFare).toBe(25);
      expect(line.extraFarePerStop).toBe(8);
    });

    it('투어선: 기본 15₴, 정거장당 5₴', () => {
      const line = getLineById(LINE_UUIDS.TOUR_LINE)!;
      expect(line.baseFare).toBe(15);
      expect(line.extraFarePerStop).toBe(5);
    });
  });

  describe('환승 할인율', () => {
    it('시티선: 1회 10%, 2회 이상 20%', () => {
      const line = getLineById(LINE_UUIDS.CITY_LINE)!;
      expect(line.transferDiscount1st).toBe(0.1);
      expect(line.transferDiscount2nd).toBe(0.2);
    });

    it('외곽선: 1회 15%, 2회 이상 25%', () => {
      const line = getLineById(LINE_UUIDS.SUBURB_LINE)!;
      expect(line.transferDiscount1st).toBe(0.15);
      expect(line.transferDiscount2nd).toBe(0.25);
    });

    it('투어선: 1회 15%, 2회 이상 20%', () => {
      const line = getLineById(LINE_UUIDS.TOUR_LINE)!;
      expect(line.transferDiscount1st).toBe(0.15);
      expect(line.transferDiscount2nd).toBe(0.2);
    });
  });

  describe('노선 배차 정보', () => {
    it('시티선: 15분 간격', () => {
      const line = getLineById(LINE_UUIDS.CITY_LINE)!;
      expect(line.schedule?.intervalMinutes).toBe(15);
    });

    it('외곽선: 90분 간격', () => {
      const line = getLineById(LINE_UUIDS.SUBURB_LINE)!;
      expect(line.schedule?.intervalMinutes).toBe(90);
    });

    it('투어선: 60분 간격', () => {
      const line = getLineById(LINE_UUIDS.TOUR_LINE)!;
      expect(line.schedule?.intervalMinutes).toBe(60);
    });
  });
});
