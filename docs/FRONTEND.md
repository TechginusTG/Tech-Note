# 프론트엔드 아키텍처

## 프레임워크

프론트엔드는 서버 렌더링 및 정적 생성이 가능한 웹 애플리케이션을 구축하기 위한 React 프레임워크인 [Next.js](https://nextjs.org/)로 빌드되었습니다.

## 상태 관리

전역 상태는 [Redux Toolkit](https://redux-toolkit.js.org/)을 사용하여 관리됩니다. Redux 스토어는 `app/store`에 설정되어 있습니다.

## 스타일링

스타일링은 다음의 조합으로 처리됩니다:

*   **CSS 모듈:** 컴포넌트 수준 스타일링 (예: `page.module.css`).
*   **Tailwind CSS:** 유틸리티 우선 스타일링 (`app/styles/tailwind.css`).
*   **전역 스타일:** 전역 스타일은 `app/styles/globals.css`에 정의되어 있습니다.

## 컴포넌트

재사용 가능한 React 컴포넌트는 `/components` 디렉토리에 있습니다.

## 라우팅

Next.js는 파일 시스템 기반 라우터를 사용합니다. 페이지는 `/app` 디렉토리에 있습니다. 예를 들어, `app/blog/[slug]/page.tsx`는 `/blog/:slug` 라우트에 해당합니다.