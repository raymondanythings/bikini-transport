import React, { useState } from 'react';
import { STATION_UUIDS } from './mocks/data/stations';

/**
 * 경로 계산 검증 페이지
 * 다양한 시나리오로 요금 및 시간 계산이 올바른지 검증
 */

interface TestCase {
  name: string;
  fromStationId: string;
  toStationId: string;
  expectedResults: {
    minTime?: number;
    minFare?: number;
    description: string;
  };
}

const TEST_CASES: TestCase[] = [
  {
    name: '테스트 1: 시티선 직행 (양방향)',
    fromStationId: STATION_UUIDS.BIKINI_CITY,
    toStationId: STATION_UUIDS.BUBBLE_TOWN,
    expectedResults: {
      minTime: 45,
      minFare: 14,
      description: '비키니시티(0) → 버블타운(2): 시간 45분, 요금 14₴',
    },
  },
  {
    name: '테스트 2: 다중 노선 최단시간 선택',
    fromStationId: STATION_UUIDS.GLOVE_WORLD,
    toStationId: STATION_UUIDS.BIKINI_CITY,
    expectedResults: {
      minTime: 40,
      minFare: 20,
      description: '글러브월드 → 비키니시티: 투어선(40분, 20₴) vs 시티선(55분, 12₴) → 투어선 선택',
    },
  },
  {
    name: '테스트 3: 환승 vs 직행 (환승이 더 빠름)',
    fromStationId: STATION_UUIDS.BIKINI_CITY,
    toStationId: STATION_UUIDS.TENTACLE_ACRES,
    expectedResults: {
      minTime: 250,
      minFare: 48.85,
      description: '비키니시티 → 징징빌라: 환승(250분) vs 직행(370분) → 환승 선택',
    },
  },
  {
    name: '테스트 4: 투어선 양방향 (최단 경로)',
    fromStationId: STATION_UUIDS.JELLYFISH_FIELDS,
    toStationId: STATION_UUIDS.GLOVE_WORLD,
    expectedResults: {
      minTime: 70,
      minFare: 25,
      description: '해파리초원(4) → 글러브월드(1): 순방향 2구간, 시간 70분, 요금 25₴',
    },
  },
  {
    name: '테스트 5: 환승 경로 vs 직행',
    fromStationId: STATION_UUIDS.BIKINI_CITY,
    toStationId: STATION_UUIDS.TENTACLE_ACRES,
    expectedResults: {
      description: '환승(250분) vs 직행(370분) - 환승이 120분 빠름',
    },
  },
  {
    name: '테스트 6: 시티선 순환 (반대방향)',
    fromStationId: STATION_UUIDS.FLOATERS_CEMETERY,
    toStationId: STATION_UUIDS.GLOVE_WORLD,
    expectedResults: {
      description: '플로터스묘지(1) → 글러브월드(4): 순방향 3구간 vs 역방향 2구간',
    },
  },
  {
    name: '테스트 7: 투어선 순환',
    fromStationId: STATION_UUIDS.GOO_LAGOON,
    toStationId: STATION_UUIDS.BIKINI_CITY,
    expectedResults: {
      description: '구라군(3) → 비키니시티(0): 순방향 2구간 vs 역방향 3구간',
    },
  },
  {
    name: '테스트 8: 외곽선 단방향 직행 (메롱시티→비키니환초)',
    fromStationId: STATION_UUIDS.ROCK_BOTTOM,
    toStationId: STATION_UUIDS.BIKINI_ATOLL,
    expectedResults: {
      minTime: 185,
      minFare: 41,
      description: '메롱시티(1) → 비키니환초(3): 단방향 2구간, 시간 185분 (75+110), 요금 41₴',
    },
  },
  {
    name: '테스트 9: 시티선 순환 최단 (버블타운→플로터스묘지)',
    fromStationId: STATION_UUIDS.BUBBLE_TOWN,
    toStationId: STATION_UUIDS.FLOATERS_CEMETERY,
    expectedResults: {
      minTime: 20,
      minFare: 12,
      description: '버블타운(2) → 플로터스묘지(1): 역방향 1구간, 시간 20분, 요금 12₴',
    },
  },
];

export default function TestPathfinding() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testCase: TestCase, index: number) => {
    setLoading(prev => ({ ...prev, [index]: true }));

    try {
      const response = await fetch('/api/itineraries/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromStationId: testCase.fromStationId,
          toStationId: testCase.toStationId,
          departureTime: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setResults(prev => ({ ...prev, [index]: data }));
    } catch (error) {
      console.error(`Test ${index} failed:`, error);
      setResults(prev => ({ ...prev, [index]: { error: String(error) } }));
    } finally {
      setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const runAllTests = async () => {
    for (let i = 0; i < TEST_CASES.length; i++) {
      await runTest(TEST_CASES[i], i);
      // 각 테스트 사이에 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const validateResult = (testCase: TestCase, result: any): string => {
    if (!result || result.error) return '❌ 오류';
    if (!result.itineraries || result.itineraries.length === 0) return '❌ 경로 없음';

    const { expectedResults } = testCase;
    const itineraries = result.itineraries;
    const errors: string[] = [];

    // 최단시간 검증
    const shortestTime = itineraries.find((it: any) => it.recommendationTypes.includes('SHORTEST_TIME'));
    if (expectedResults.minTime && shortestTime) {
      const actualTime = shortestTime.totalDurationMinutes;
      if (actualTime !== expectedResults.minTime) {
        errors.push(`시간: 예상 ${expectedResults.minTime}분 → 실제 ${actualTime}분`);
      }
    }

    // 최저요금 검증
    const lowestFare = itineraries.find((it: any) => it.recommendationTypes.includes('LOWEST_FARE'));
    if (expectedResults.minFare && lowestFare) {
      const actualFare = lowestFare.pricing.totalBeforeCoupon;
      // 소수점 오차 허용 (0.01 이내)
      if (Math.abs(actualFare - expectedResults.minFare) > 0.01) {
        errors.push(`요금: 예상 ${expectedResults.minFare}₴ → 실제 ${actualFare}₴`);
      }
    }

    // 최단시간 경로의 요금도 함께 표시
    if (expectedResults.minTime && shortestTime) {
      const timeFare = shortestTime.pricing.totalBeforeCoupon;
      if (errors.length === 0) {
        return `✅ 정확 | 시간: ${shortestTime.totalDurationMinutes}분, 요금: ${timeFare}₴`;
      }
    }

    if (errors.length > 0) {
      return `⚠️ 불일치 | ${errors.join(' | ')}`;
    }

    return '✅ 경로 존재';
  };

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'monospace',
      }}
    >
      <h1>🧪 경로 계산 검증 테스트</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>요금 및 시간 계산 로직이 올바르게 작동하는지 검증합니다.</p>

      <button
        onClick={runAllTests}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '30px',
        }}
      >
        🚀 모든 테스트 실행
      </button>

      <div style={{ display: 'grid', gap: '20px' }}>
        {TEST_CASES.map((testCase, index) => (
          <div
            key={index}
            style={{
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0 }}>{testCase.name}</h3>
              <button
                onClick={() => runTest(testCase, index)}
                disabled={loading[index]}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: loading[index] ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading[index] ? 'not-allowed' : 'pointer',
                }}
              >
                {loading[index] ? '⏳ 실행 중...' : '▶ 실행'}
              </button>
            </div>

            <div style={{ color: '#555', marginBottom: '12px', fontSize: '14px' }}>
              <strong>예상 결과:</strong> {testCase.expectedResults.description}
            </div>

            {results[index] && (
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: validateResult(testCase, results[index]).startsWith('✅') ? '#d4edda' : '#fff3cd',
                    border: '1px solid',
                    borderColor: validateResult(testCase, results[index]).startsWith('✅') ? '#c3e6cb' : '#ffeeba',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {validateResult(testCase, results[index])}
                </div>

                <details>
                  <summary
                    style={{
                      cursor: 'pointer',
                      color: '#007bff',
                      fontSize: '14px',
                    }}
                  >
                    📋 상세 결과 보기
                  </summary>
                  <pre
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '12px',
                      overflow: 'auto',
                      maxHeight: '400px',
                    }}
                  >
                    {JSON.stringify(results[index], null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px',
        }}
      >
        <h3>📊 검증 기준</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>시티선 (양방향):</strong> 기본 10₴ + 정거장당 2₴, 양방향 중 최단 경로 선택
          </li>
          <li>
            <strong>외곽선 (단방향):</strong> 기본 25₴ + 정거장당 8₴, 한 방향으로만 순환
          </li>
          <li>
            <strong>투어선 (양방향):</strong> 기본 15₴ + 정거장당 5₴, 양방향 중 최단 경로 선택
          </li>
          <li>
            <strong>시간 계산:</strong> duration-map의 실제 구간별 시간을 모두 합산
          </li>
          <li>
            <strong>환승 할인:</strong> 1회 환승 10-15%, 2회 이상 환승 20-25%
          </li>
        </ul>
      </div>
    </div>
  );
}
