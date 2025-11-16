# Bikini Transport 🧽🌊

비키니시티 해저 버스 예약 시스템

스폰지밥 테마의 버스 예약 애플리케이션입니다.

## 🚀 시작하기

### 개발 환경 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 시작 (MSW 자동 활성화)
yarn dev
```

개발 서버: http://localhost:5173

### 프로덕션 빌드

```bash
# 빌드
yarn build

# 빌드 미리보기
yarn preview
```

---

## 📋 주요 기술 스택

- **React 19** + TypeScript
- **Vite** - 빌드 도구
- **React Router v7** - 라우팅
- **Panda CSS** - 스타일링
- **Ark UI** - 기본 컴포넌트
- **MSW 2.x** - API 모킹
- **OpenAPI 3.1** - API 명세

---

## 📚 API 문서 보기

### 방법 1: Swagger Editor 온라인 (추천)

1. [Swagger Editor](https://editor.swagger.io/) 접속
2. `openapi.yaml` 파일 내용을 복사하여 붙여넣기
3. 실시간으로 API 문서를 확인하고 테스트할 수 있습니다

**장점:**

- 📖 전체 API 엔드포인트 탐색
- 🧪 각 API를 브라우저에서 직접 테스트
- 📋 요청/응답 스키마 확인
- 💡 예시 코드 확인
- 🔄 실시간 스펙 업데이트 반영

### 방법 2: 로컬 Swagger UI (CLI 도구)

터미널에서 다음 명령어로 로컬 Swagger UI 실행:

```bash
# swagger-ui-watcher 설치 (전역)
npm install -g swagger-ui-watcher

# OpenAPI 파일 감시 모드로 실행
swagger-ui-watcher openapi.yaml
```

브라우저에서 자동으로 열리며, 파일 변경 시 자동으로 새로고침됩니다.

### 방법 3: VS Code 확장 프로그램

VS Code에서 다음 확장 프로그램을 설치하면 편리하게 확인할 수 있습니다:

- **Swagger Viewer** - OpenAPI/Swagger 파일을 사이드바에서 미리보기
- **OpenAPI (Swagger) Editor** - OpenAPI 파일 편집 및 미리보기

### 방법 4: 직접 파일 접근

- **소스 파일**: [openapi.yaml](./openapi.yaml)
- **런타임 접근**: 개발 서버 실행 후 `http://localhost:5173/openapi.yaml`

### API 테스트 페이지

개발 환경에서 기본으로 표시되는 간단한 테스트 페이지:

```
http://localhost:5173
```

개발 모드에서는 자동으로 API 테스트 페이지가 표시됩니다.

---

## 🔌 API 엔드포인트

개발 환경에서는 MSW(Mock Service Worker)가 자동으로 API 요청을 가로채서 목 데이터를 반환합니다.

### Base URL

```
개발: http://localhost:5173/api
프로덕션: /api
```

### 📍 역(정류장) API

#### 전체 역 목록 조회

```http
GET /api/stations
```

**응답 예시:**

```json
{
  "stations": [
    {
      "stationId": "bikini-city",
      "name": "비키니시티",
      "location": [37.5794, 126.9923]
    }
  ]
}
```

---

### 🚌 노선 API

#### 전체 노선 목록 조회

```http
GET /api/lines
```

**응답 예시:**

```json
{
  "lines": [
    {
      "lineId": "city-line",
      "name": "시티선",
      "type": "CITY",
      "color": "#FFC107",
      "stationIds": ["new-kelp-city", "glove-world", "..."],
      "baseFare": 5.0,
      "extraFarePer3Stops": 1.0,
      "transferDiscount1st": 0.2,
      "transferDiscount2nd": 0.15
    }
  ]
}
```

#### 특정 노선 조회

```http
GET /api/lines/{lineId}
```

**예시:**

```bash
GET /api/lines/city-line
```

---

### 🔍 경로 검색 API

#### 경로 검색

```http
POST /api/itineraries/search
Content-Type: application/json
```

**요청 바디:**

```json
{
  "fromStationId": "new-kelp-city",
  "toStationId": "bubble-city",
  "departureTime": "2025-01-15T09:00:00Z"
}
```

**응답 예시:**

```json
{
  "itineraries": [
    {
      "itineraryId": "itinerary-0",
      "recommendationTypes": ["SHORTEST_TIME", "MIN_TRANSFER"],
      "totalDurationMinutes": 30,
      "transferCount": 0,
      "legs": [
        {
          "legId": "leg-city-line-0",
          "lineId": "city-line",
          "lineName": "시티선",
          "lineColor": "#FFC107",
          "fromStation": { "stationId": "new-kelp-city", "name": "뉴캘프시티", "location": [37.5665, 126.978] },
          "toStation": { "stationId": "bubble-city", "name": "버블시티", "location": [37.5902, 127.0042] },
          "durationMinutes": 25,
          "baseFare": 5.0,
          "extraFare": 1.0,
          "fareBeforeDiscount": 6.0,
          "transferDiscount": 0,
          "finalFare": 6.0
        }
      ],
      "pricing": {
        "subtotal": 6.0,
        "transferDiscount": 0,
        "totalBeforeCoupon": 6.0
      }
    }
  ]
}
```

**추천 타입:**

- `SHORTEST_TIME` - 최단 시간 경로
- `MIN_TRANSFER` - 최소 환승 경로
- `LOWEST_FARE` - 최저 요금 경로

하나의 경로가 여러 타입을 동시에 만족할 수 있습니다.

---

### 💺 좌석 API

#### 구간별 좌석 조회

```http
GET /api/legs/{legId}/seats
```

**예시:**

```bash
GET /api/legs/leg-city-line-0/seats
```

**응답 예시:**

```json
{
  "legId": "leg-city-line-0",
  "rows": 10,
  "columns": 4,
  "driverPosition": "LEFT",
  "seats": [
    {
      "seatNumber": "A1",
      "row": 0,
      "column": 0,
      "position": "WINDOW",
      "isAvailable": true,
      "isReserved": false
    }
  ]
}
```

---

### 🎁 쿠폰 API

#### 랜덤 쿠폰 팝업 조회

```http
GET /api/coupons/random-popup
```

**응답 예시:**

```json
{
  "coupon": {
    "couponCode": "PEARL_PASS",
    "name": "진주패스",
    "description": "모든 노선 기본요금 0.5₴ 할인",
    "emoji": "🦪",
    "discountType": "FIXED_BASE_FARE",
    "discountValue": 0.5,
    "maxOwnedCount": 3,
    "currentOwnedCount": 1
  }
}
```

쿠폰이 출현하지 않으면 `coupon: null` 반환 (약 10% 확률)

#### 쿠폰 받기

```http
POST /api/coupons/claim
Content-Type: application/json
```

**요청 바디:**

```json
{
  "couponCode": "PEARL_PASS"
}
```

**성공 응답:**

```json
{
  "success": true,
  "coupon": { ... }
}
```

**실패 응답 (최대 개수 초과):**

```json
{
  "error": "MAX_COUPON_EXCEEDED",
  "message": "이미 최대 개수를 보유 중입니다"
}
```

#### 내 보유 쿠폰 목록

```http
GET /api/coupons/my
```

---

### 📝 예약 API

#### 예약 생성

```http
POST /api/bookings
Content-Type: application/json
```

**요청 바디:**

```json
{
  "itineraryId": "itinerary-0",
  "seatSelections": [
    {
      "legId": "leg-city-line-0",
      "seatNumber": "A1"
    }
  ],
  "couponCode": "PEARL_PASS",
  "departureTime": "2025-01-15T09:00:00Z"
}
```

**응답 예시:**

```json
{
  "bookingId": "booking-1",
  "bookingNumber": "BKN-20250115-0001",
  "itinerary": { ... },
  "seatSelections": [ ... ],
  "appliedCoupon": { ... },
  "departureTime": "2025-01-15T09:00:00Z",
  "pricing": {
    "subtotal": 6.0,
    "transferDiscount": 0,
    "subtotalAfterTransfer": 6.0,
    "couponDiscount": 0.5,
    "finalTotal": 5.5,
    "currency": "SHELL"
  },
  "status": "CONFIRMED",
  "createdAt": "2025-01-15T08:30:00Z"
}
```

#### 내 예약 목록 조회

```http
GET /api/bookings?sort=date_desc&status=CONFIRMED
```

**Query Parameters:**

- `sort` (선택):
  - `date_desc` - 출발 날짜 내림차순 (기본값)
  - `date_asc` - 출발 날짜 오름차순
  - `price_desc` - 금액 높은 순
  - `price_asc` - 금액 낮은 순
- `status` (선택):
  - `CONFIRMED` - 확정된 예약만
  - `CANCELLED` - 취소된 예약만

#### 예약 상세 조회

```http
GET /api/bookings/{bookingId}
```

---

## 💰 요금 체계

### 기본 구조

1. **기본 요금** + **추가 요금** (3정거장 초과 시 3정거장당)
2. **환승 할인** (갈아타는 노선에만 적용)
   - 1회 환승: 노선별 설정 (15-25%)
   - 2회 이상 환승: 노선별 설정 (10-20%)
3. **쿠폰 할인** (환승 할인 후 적용)

### 노선별 요금

| 노선   | 기본요금 | 추가요금 | 1회 환승 할인 | 2회 이상 환승 할인 |
| ------ | -------- | -------- | ------------- | ------------------ |
| 시티선 | 5.0₴     | 1.0₴     | 20%           | 15%                |
| 외곽선 | 4.5₴     | 0.8₴     | 25%           | 20%                |
| 투어선 | 6.0₴     | 1.2₴     | 15%           | 10%                |

### 쿠폰 종류

| 쿠폰코드     | 이름          | 할인 내용               | 최대 소지 |
| ------------ | ------------- | ----------------------- | --------- |
| `PEARL_PASS` | 진주패스 🦪   | 모든 노선 기본요금 0.5₴ | 3개       |
| `GARY_NIGHT` | 달팽이패스 🐌 | 21시 이후 전체 40% 할인 | 2개       |
| `TOUR_FUN`   | 투어패스 🎢   | 투어선 전용 30% 할인    | 5개       |

---

## 🧪 API 테스트

개발 서버를 실행하면 자동으로 테스트 페이지가 표시됩니다.

```bash
yarn dev
```

브라우저에서 http://localhost:5173 접속 시:

- ✅ MSW가 자동 시작됨
- ✅ 역 목록, 노선 목록 자동 조회
- ✅ 경로 검색 테스트 가능
- ✅ 콘솔에서 "[MSW] Mock Service Worker가 시작되었습니다 🧽" 확인

### 실제 페이지로 전환

`src/App.tsx`에서 다음 부분을 수정:

```tsx
// 테스트 페이지 비활성화
if (import.meta.env.DEV) {
  return <TestApiPage />; // 이 부분 주석 처리 또는 삭제
}
```

---

## 📂 프로젝트 구조

```
src/
├── mocks/                    # MSW 관련 파일
│   ├── data/                 # 목 데이터
│   │   ├── stations.ts       # 역 데이터 (11개)
│   │   ├── lines.ts          # 노선 데이터 (3개)
│   │   ├── seats.ts          # 좌석 템플릿
│   │   └── coupons.ts        # 쿠폰 정의
│   ├── utils/                # 핵심 로직
│   │   ├── pathfinding.ts    # 경로 탐색 알고리즘
│   │   └── pricing.ts        # 요금 계산
│   ├── storage.ts            # 인메모리 저장소
│   ├── handlers.ts           # MSW 핸들러
│   └── browser.ts            # 브라우저 워커
├── generated/                # 자동 생성 파일
│   └── api-types.ts          # OpenAPI → TypeScript 타입
├── pages/                    # 페이지 컴포넌트
├── components/               # 비즈니스 컴포넌트
├── ui-lib/                   # 디자인 시스템
└── test-api.tsx              # API 테스트 페이지
```

---

## 🔧 주요 스크립트

```bash
# 개발 서버 (MSW 자동 활성화)
yarn dev

# OpenAPI 타입 생성
yarn openapi:generate

# 프로덕션 빌드
yarn build

# 린트
yarn lint
```

---

## 📖 추가 문서

- [CLAUDE.md](./CLAUDE.md) - 프로젝트 상세 정보 및 아키텍처
- [openapi.yaml](./openapi.yaml) - 전체 API 명세
- [MSW 공식 문서](https://mswjs.io/docs/)
- [OpenAPI 3.1 Spec](https://spec.openapis.org/oas/v3.1.0)

---

## 🐛 문제 해결

### MSW가 시작되지 않는 경우

1. 브라우저 콘솔 확인
2. `public/mockServiceWorker.js` 파일 존재 확인
3. 서비스 워커 재생성:

```bash
npx msw init public/ --save
```

### 타입 에러 발생 시

```bash
yarn openapi:generate
```

---

_"준비됐나, 아이들? I'm ready! 🧽"_
