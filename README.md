This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Next.js 기본 개념

이 섹션은 Next.js 프로젝트의 기본적인 사용법과 핵심 개념을 설명합니다.

### 1. 개발 서버 실행 (Development)

```bash
npm run dev
```
- 이 명령어를 실행하면 개발용 로컬 서버가 `http://localhost:3000` 에서 시작됩니다.
- **특징**:
    - **빠른 새로고침 (Fast Refresh)**: 코드를 수정하면 거의 즉시 브라우저에 변경사항이 반영됩니다.
    - **개발 최적화**: 프로덕션 환경이 아닌, 개발의 편의성에 초점이 맞춰져 있습니다.

### 2. 프로덕션 빌드 (Build)

```bash
npm run build
```
- 이 명령어는 애플리케이션을 프로덕션(실제 서비스) 환경에 배포할 수 있는 형태로 만듭니다.
- **주요 작업**:
    - **코드 최적화**: JavaScript, CSS 코드를 압축하여 파일 크기를 줄입니다.
    - **정적 파일 생성**: 일부 페이지를 미리 HTML 파일로 만들어 빠른 로딩을 가능하게 합니다.
    - **이미지 최적화**: 사용된 이미지를 웹에 최적화된 형식과 크기로 변환합니다.
- 빌드가 완료되면 `.next` 폴더에 결과물이 생성됩니다.

### 3. 프로덕션 서버 시작 (Start)

```bash
npm run start
```
- `npm run build` 명령어로 생성된 프로덕션 빌드를 실행합니다.
- **주의**: 이 명령어는 반드시 `build`를 먼저 실행한 후에 사용해야 합니다.
- 개발 서버(`npm run dev`)보다 훨씬 최적화되고 안정적인 성능을 제공합니다.

### 4. 주요 폴더 및 파일 구조 (App Router 기준)

- **`app/`**: 애플리케이션의 모든 페이지와 라우팅을 관리하는 핵심 디렉토리입니다.
    - **`layout.tsx`**: 여러 페이지에서 공통적으로 사용되는 UI 셸(예: 헤더, 푸터)을 정의합니다.
    - **`page.tsx`**: 특정 경로(URL)에 해당하는 UI를 정의하는 파일입니다.
    - **`globals.css`**: 애플리케이션 전역에 적용되는 CSS 스타일을 정의합니다.

# 프로젝트 로드맵

> _**Note:** 이 로드맵은 Gemini가 작성했습니다._

이 프로젝트는 Next.js, Spring Boot, Podman을 사용하여 게시판 서비스를 개발하는 것을 목표로 합니다. 개발은 다음 단계에 따라 진행됩니다.

## Phase 1: 프론트엔드 UI 개발

- **목표**: 실제 데이터 없이 UI/UX 프로토타입을 완성합니다.
- **기술 스택**: Next.js, TypeScript, CSS
- **주요 작업**:
    - [ ] 게시글 목록 페이지 UI 구현
    - [ ] 게시글 상세 보기 페이지 UI 구현
    - [ ] 게시글 작성/수정 페이지 UI 구현
    - [ ] 가짜 데이터(Mock Data)를 이용한 UI 테스트

## Phase 2: 백엔드 API 개발

- **목표**: 게시판 기능에 필요한 REST API를 개발하고 데이터를 관리합니다.
- **기술 스택**: Spring Boot, Java/Kotlin, JPA, (데이터베이스 예: H2, PostgreSQL)
- **주요 작업**:
    - [ ] Spring Boot 프로젝트 초기 설정
    - [ ] 게시글(Post) 데이터 모델(Entity) 정의
    - [ ] 게시글 CRUD (Create, Read, Update, Delete) API 구현
        - `GET /api/posts` (목록 조회)
        - `GET /api/posts/{id}` (상세 조회)
        - `POST /api/posts` (작성)
        - `PUT /api/posts/{id}` (수정)
        - `DELETE /api/posts/{id}` (삭제)
    - [ ] 데이터베이스 연동 및 설정

## Phase 3: 프론트엔드-백엔드 연동

- **목표**: 프론트엔드에서 백엔드 API를 호출하여 실제 데이터를 표시하고 상호작용하도록 합니다.
- **주요 작업**:
    - [ ] 프론트엔드 `fetch` 또는 `axios` 설정
    - [ ] 페이지별 API 연동 (목록, 상세, 작성, 수정, 삭제)
    - [ ] CORS (Cross-Origin Resource Sharing) 문제 해결

## Phase 4: 컨테이너화 및 배포

- **목표**: 개발된 애플리케이션을 Podman 컨테이너로 실행하여 배포 준비를 마칩니다.
- **기술 스택**: Podman, `podman-compose`
- **주요 작업**:
    - [ ] 프론트엔드(Next.js)용 `Dockerfile` 작성
    - [ ] 백엔드(Spring Boot)용 `Dockerfile` 작성
    - [ ] `podman-compose.yml` 파일을 작성하여 프론트엔드, 백엔드, 데이터베이스 컨테이너를 함께 실행
    - [ ] 최종 배포 테스트

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
