# Tech-Note: 풀스택 블로깅 플랫폼

Tech-Note는 개발자와 기술 애호가를 위해 설계된 모던 풀스택 블로깅 플랫폼입니다. 기술 아티클과 튜토리얼을 작성, 공유, 발견할 수 있는 깔끔하고 직관적인 인터페이스를 제공합니다.

---

## 기술 스택

이 프로젝트는 최신 기술 스택을 활용한 Next.js 풀스택 애플리케이션입니다.

*   **코어 프레임워크**: [Next.js](https://nextjs.org/) (App Router)
*   **언어**: [TypeScript](https://www.typescriptlang.org/)
*   **백엔드 API**: Next.js API Routes
*   **데이터베이스 ORM**: [Prisma](https.www.prisma.io/)
*   **데이터베이스**: [PostgreSQL](https://www.postgresql.org/)
    *   **개발**: Docker로 로컬 환경에서 실행
    *   **운영**: [Supabase](https://supabase.com/)에 배포 예정
*   **인증**: [NextAuth.js](https://next-auth.js.org/)
*   **상태 관리**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **스타일링**: [Tailwind CSS](https://tailwindcss.com/) & CSS 모듈
*   **컨테이너화**: [Docker](https://www.docker.com/) & Docker Compose

---

## 로컬 개발 환경 설정

이 가이드는 로컬 머신에서 프로젝트를 설정하고 실행하는 방법을 안내합니다.

### 사전 요구 사항

*   **Node.js 18+**
*   **Docker**
*   **Docker Compose**
*   **Git**

### 설정 단계

1.  **리포지토리 복제**
    ```bash
    git clone <repository_url>
    cd Tech-Note
    ```

2.  **환경 변수 구성**
    프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 추가합니다. 이 파일은 데이터베이스 연결 정보를 담고 있습니다.
    ```env
    # .env

    # Docker Compose를 위한 변수
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=admin
    POSTGRES_DB=devDB
    POSTGRES_PORT=5432

    # Prisma를 위한 데이터베이스 연결 문자열
    DATABASE_URL="postgresql://admin:admin@localhost:5432/devDB"
    ```

3.  **애플리케이션 실행**
    프로젝트의 모든 종속성을 설치하고, 데이터베이스를 시작하며, 개발 서버를 실행하려면 다음 명령어를 사용하세요.
    ```bash
    npm run dev
    ```
    이 스크립트는 `npm install`, `prisma migrate dev`, `docker-compose up -d`, `next dev`를 순차적으로 실행합니다.

    이제 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 개발 중지

개발 서버와 데이터베이스 컨테이너를 중지하려면 `npm run dev`를 실행한 터미널에서 `Ctrl + C`를 누르세요. 만약 컨테이너가 자동으로 중지되지 않으면 `docker-compose down` 명령을 수동으로 실행할 수 있습니다.

---

## 프로젝트 로드맵

> **상태 기준일:** 2025년 9월 27일

- **1단계: 기반 및 설정 (완료)**
    - [x] 풀스택 모노레포 구조 설정
    - [x] Next.js, TypeScript, Prisma 기반 프로젝트 초기화
    - [x] Docker Compose를 사용한 로컬 개발 환경 구축

- **2단계: 핵심 기능 - 블로그 게시물 (진행 중)**
    - **백엔드:**
        - [x] `Post` 엔티티 및 리포지토리 정의
        - [ ] 게시물 CRUD API 엔드포인트 구현
    - **프론트엔드:**
        - [ ] 게시물 목록 및 상세 페이지 UI 구현
        - [ ] 리치 텍스트 에디터를 사용한 게시물 작성/수정 기능 구현
        - [ ] 프론트엔드와 백엔드 API 연동

- **3단계: 기능 향상 및 사용자 경험**
    - [ ] 사용자 인증 (로그인/회원가입) 구현
    - [ ] 카테고리 및 태그 기능 추가
    - [ ] 검색 및 필터링 기능 구현

- **4단계: 배포 및 프로덕션 준비**
    - [ ] `Dockerfile` 작성
    - [ ] CI/CD 파이프라인 설정
    - [ ] 최종 테스트 및 배포

---

## 더 알아보기

프로젝트에 사용된 기술에 대해 더 알아보려면 다음 공식 문서를 참고하세요:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)