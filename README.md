# Tech-Note 프로젝트

이 프로젝트는 기술 블로그와 커뮤니티 포럼을 위한 최신 웹 애플리케이션입니다.

- **프론트엔드**: Next.js와 React로 빌드되었습니다. (루트 디렉토리)
- **백엔드**: Spring Boot와 Java로 빌드되었습니다. (`/backend` 디렉토리)

---

## 프로젝트 구조

이 저장소는 두 개의 주요 부분으로 구성된 모노레포(monorepo)로 관리됩니다:

- **`/` (루트)**: Next.js 프론트엔드 애플리케이션이 위치합니다.
- **`/backend`**: Spring Boot 백엔드 애플리케이션이 위치합니다.

---

## 시작 가이드

### 프론트엔드 (Next.js)

먼저, 프론트엔드 개발 서버를 실행하세요:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 열어 결과를 확인하세요.

### 백엔드 (Spring Boot)

백엔드 디렉토리로 이동하여 Gradle Wrapper를 사용해 애플리케이션을 실행하세요.

macOS/Linux 환경:
```bash
cd backend
./gradlew bootRun
```

Windows 환경:
```bash
cd backend
.\gradlew.bat bootRun
```

백엔드 서버는 [http://localhost:8080](http://localhost:8080) 에서 시작됩니다.

---

## 프로젝트 로드맵

> **참고:** 이 로드맵은 Gemini에 의해 작성되었으며, 2025년 9월 23일 기준으로 업데이트되었습니다.

이 프로젝트는 Next.js, Spring Boot, 그리고 컨테이너 기술을 사용하여 게시판 서비스를 개발하는 것을 목표로 합니다.

### 1단계: 프론트엔드 UI 개발 (진행 중)

- **목표**: 실제 데이터 없이 UI/UX 프로토타입을 완성합니다.
- **기술 스택**: Next.js, TypeScript, Tailwind CSS
- **주요 작업**:
    - [x] 기본 프로젝트 구조 재구성
    - [ ] 게시물 목록 페이지 UI 구현
    - [ ] 게시물 상세 페이지 UI 구현
    - [ ] 게시물 작성/수정 페이지 UI 구현

### 2단계: 백엔드 API 개발

- **목표**: 게시판 기능에 필요한 REST API를 개발하고 데이터를 관리합니다.
- **기술 스택**: Spring Boot, Java, JPA, PostgreSQL
- **주요 작업**:
    - [x] Spring Boot 프로젝트 초기 설정 완료
    - [ ] 게시물(Post) 데이터 모델(Entity) 정의
    - [ ] 게시물 CRUD (생성, 조회, 수정, 삭제) API 구현
    - [x] 데이터베이스 연결 설정 (PostgreSQL)

### 3단계: 프론트엔드-백엔드 연동

- **목표**: 프론트엔드에서 백엔드 API를 호출하여 실제 데이터를 표시하고 상호작용하도록 합니다.
- **주요 작업**:
    - [ ] 프론트엔드에 `fetch` 또는 `axios` 설정
    - [ ] 각 페이지별 API 연동 (목록, 상세, 작성, 수정, 삭제)
    - [ ] CORS (Cross-Origin Resource Sharing) 문제 해결

### 4단계: 컨테이너화 및 배포

- **목표**: 개발된 애플리케이션을 컨테이너로 실행하여 배포 준비를 마칩니다.
- **기술 스택**: Docker/Podman, `docker-compose`
- **주요 작업**:
    - [ ] 프론트엔드(Next.js)용 `Dockerfile` 작성
    - [ ] 백엔드(Spring Boot)용 `Dockerfile` 작성
    - [x] `docker-compose.yml` 파일을 작성하여 프론트엔드, 백엔드, 데이터베이스 컨테이너를 함께 실행
    - [ ] 최종 배포 테스트

---

## 개발 환경 설정 (PostgreSQL)

개발 환경에서는 `podman`과 `compose.yml`을 사용하여 PostgreSQL 데이터베이스를 설정합니다. 데이터베이스 파일은 `devDB/` 디렉토리에 저장됩니다.

---

---

## 더 알아보기

사용한 기술에 대해 더 알아보려면 다음 자료들을 참고하세요:

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
