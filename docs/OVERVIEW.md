# Tech-Note: 풀스택 블로깅 플랫폼

## 1. 프로젝트 비전

Tech-Note는 개발자와 기술 애호가를 위해 설계된 모던 풀스택 블로깅 플랫폼입니다. 기술 아티클과 튜토리얼을 작성, 공유, 발견할 수 있는 깔끔하고 직관적인 인터페이스를 제공합니다. 이 프로젝트는 강력한 기술 스택을 활용하여 고성능의 확장 가능하며 풍부한 기능의 경험을 제공합니다.

## 2. 핵심 기능

- **리치 텍스트 에디터:** 코드 스니펫, 이미지 등을 포함하여 기사를 작성하고 서식을 지정할 수 있는 강력하고 사용자 친화적인 에디터.
- **카테고리 및 태깅 시스템:** 유연한 분류 및 태깅 시스템을 통해 콘텐츠를 쉽게 구성하고 발견할 수 있습니다.
- **사용자 인증:** 안전한 사용자 등록 및 로그인 기능.
- **RESTful API:** 사용자, 게시물 및 기타 리소스를 관리하기 위한 잘 정의된 API.
- **반응형 디자인:** 데스크톱, 태블릿, 모바일 장치에서 원활하게 작동하는 완전 반응형 UI.

## 3. 기술 스택

이 프로젝트는 현대적이고 견고한 기술들의 조합으로 구축되었습니다:

*   **프론트엔드:**
    *   **프레임워크:** [Next.js](https://nextjs.org/) (React)
    *   **언어:** [TypeScript](https://www.typescriptlang.org/)
    *   **상태 관리:** [Redux Toolkit](https://redux-toolkit.js.org/)
    *   **스타일링:** [Tailwind CSS](https://tailwindcss.com/) & CSS 모듈
    *   **국제화(i18n):** [next-i18next](https://www.i18next.com/)

*   **백엔드:**
    *   **프레임워크:** [Spring Boot](https://spring.io/projects/spring-boot)
    *   **언어:** [Java](https://www.java.com/)
    *   **데이터 접근:** Spring Data JPA
    *   **데이터베이스:** [PostgreSQL](https://www.postgresql.org/)
    *   **데이터베이스 마이그레이션:** [Flyway](https://flywaydb.org/)

*   **개발 및 운영:**
    *   **컨테이너화:** [Podman](https://podman.io/) & Podman Compose
    *   **빌드 도구:** [Gradle](https://gradle.org/) (백엔드), [npm](https://www.npmjs.com/) (프론트엔드)

## 4. 디렉토리 구조

```
/
├── app/              # Next.js 프론트엔드 소스 코드
├── backend/          # Spring Boot 백엔드 소스 코드
├── components/       # 공유 React 컴포넌트
├── devDB/            # (레거시) 로컬 PostgreSQL 데이터 파일
├── docs/             # 프로젝트 문서
├── lib/              # 프론트엔드 유틸리티 및 타입 정의
├── public/           # 정적 에셋 (이미지, 폰트 등)
├── ...
```

이 문서는 Tech-Note 개발을 시작하는 데 필요한 모든 정보를 제공합니다. 특정 영역에 대한 자세한 내용은 이 `docs` 폴더의 다른 문서를 참조하십시오.