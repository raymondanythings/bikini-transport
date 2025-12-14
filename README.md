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
