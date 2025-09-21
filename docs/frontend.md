# 프론트엔드 아키텍처

프론트엔드는 Next.js 기반의 최신 웹 애플리케이션으로 구성되어 있습니다.

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) (React 기반)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **상태 관리**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **스타일링**: [CSS Modules](https://github.com/css-modules/css-modules), [PostCSS](https://postcss.org/)
- **API 통신**: `fetch` API (또는 `axios`와 같은 라이브러리 사용 예정)

## 폴더 구조

주요 폴더와 역할은 다음과 같습니다.

- **`/app`**: Next.js의 App Router를 사용하는 핵심 폴더입니다. 파일 시스템 기반 라우팅을 담당합니다.
  - `layout.tsx`: 전역 레이아웃을 정의합니다.
  - `page.tsx`: 메인 페이지 컴포넌트입니다.
  - `[...]/page.tsx`: 각 라우트 경로에 해당하는 페이지 컴포넌트입니다.

- **`/components`**: 여러 페이지에서 재사용되는 독립적인 UI 컴포넌트(예: `Editor`, `CategoryPanel`)가 위치합니다.

- **`/store`**: Redux Toolkit을 사용한 전역 상태 관리 로직이 위치합니다.
  - `store.ts`: Redux 스토어를 생성하고 설정합니다.
  - `features/...`: 기능별 상태 로직(slice)을 정의합니다.

- **`/lib`**: API 함수, 타입 정의 등 프로젝트 전반에서 사용되는 유틸리티 함수와 모듈이 위치합니다.
  - `api.ts`: 백엔드 API와 통신하는 함수들을 모아놓습니다.
  - `definitions.ts`: 프로젝트에서 공통으로 사용되는 TypeScript 타입을 정의합니다.

## 실행 방법

다음 명령어를 사용하여 개발 서버를 시작할 수 있습니다.

```bash
npm run dev
```
