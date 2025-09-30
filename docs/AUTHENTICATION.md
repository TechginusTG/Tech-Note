# 인증 시스템: 백엔드 주도 OAuth2 소셜 로그인

이 문서는 Tech-Note 프로젝트의 새로운 인증 시스템에 대한 개요를 제공합니다. 현재 시스템은 GitHub와 Google을 통한 OAuth2 소셜 로그인을 지원하며, 모든 인증 로직은 백엔드에서 전담합니다.

## 1. 아키텍처

인증은 전적으로 백엔드에 의해 처리되며, 프론트엔드는 인증 상태를 표시하는 역할만 담당합니다. 이 구조는 역할 분리를 명확히 하고, 보안을 강화하며, 시스템의 복잡성을 낮춥니다.

*   **백엔드 (Spring Boot):** 인증의 유일한 주체(Single Source of Truth)입니다. Spring Security의 OAuth2 클라이언트 기능을 사용하여 외부 OAuth 공급자(Google, GitHub)와의 모든 통신을 관리합니다. 로그인 성공 시, JWT(JSON Web Token)를 생성하여 안전한 `HttpOnly` 쿠키에 담아 클라이언트에 전달합니다. 또한, API 요청 시 JWT를 검증하여 사용자를 인증합니다.

*   **프론트엔드 (Next.js):** 인증과 관련된 비밀 정보를 전혀 가지고 있지 않습니다. 사용자가 로그인 버튼을 클릭하면 백엔드의 OAuth2 엔드포인트로 리디렉션하는 역할만 합니다. 로그인 후에는 백엔드가 설정해준 쿠키를 기반으로 인증 상태를 확인하고, 관련 UI를 렌더링합니다.

## 2. 인증 흐름

1.  **로그인 시작:** 사용자가 프론트엔드의 "Sign in with Google" 버튼(단순 링크)을 클릭합니다.
2.  **백엔드로 리디렉션:** 브라우저는 백엔드의 `/oauth2/authorization/google` 엔드포인트로 이동합니다.
3.  **OAuth 처리:** 백엔드는 Spring Security를 통해 Google의 로그인 페이지로 사용자를 리디렉션하고, 전체 OAuth2 인증 과정을 처리합니다.
4.  **로그인 성공 및 JWT 생성:** Google로부터 인증이 완료되면, 백엔드는 해당 사용자의 정보를 DB에 저장/업데이트하고, 사용자의 이메일을 기반으로 JWT를 생성합니다.
5.  **쿠키 설정 및 프론트엔드로 리디렉션:** 생성된 JWT는 `auth_token`이라는 이름의 `HttpOnly` 쿠키에 담겨 응답에 추가됩니다. 그 후, 백엔드는 사용자를 프론트엔드의 홈페이지(`/`)로 다시 리디렉션합니다.
6.  **인증 상태 확인:** 프론트엔드 애플리케이션이 로드되면, 백엔드의 `/api/user/me` 엔드포인트로 요청을 보냅니다. 브라우저는 자동으로 `auth_token` 쿠키를 이 요청에 포함시킵니다.
7.  **사용자 정보 반환:** 백엔드는 쿠키의 JWT를 검증하고, 유효한 경우 해당 사용자의 정보를 응답으로 반환합니다.
8.  **UI 업데이트:** 프론트엔드는 `/api/user/me`로부터 받은 사용자 정보를 기반으로 UI를 업데이트하여 "Welcome, [사용자 이름]"과 같은 화면을 표시합니다.

## 3. 설정 및 관리

새로운 아키텍처에서는 **백엔드에만** 환경 변수 설정이 필요합니다.

### 환경 변수 설정

`backend/` 디렉토리 아래에 `.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 다음 변수들의 값을 채워야 합니다.

```
# backend/.env

# OAuth2 Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GITHUB_CLIENT_ID="YOUR_GITHUB_CLIENT_ID"
GITHUB_SECRET="YOUR_GITHUB_CLIENT_SECRET"

# PostgreSQL Database
POSTGRES_DB=technote
POSTGRES_USER=admin
POSTGRES_PASSWORD=password

# JWT Secret Key
# Use a long, random string for security
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY_THAT_IS_LONG_AND_COMPLEX"
```

> **중요:**
> *   `YOUR_...` 값들은 Google Cloud Platform과 GitHub 개발자 설정에서 OAuth2 애플리케이션을 생성하여 얻어야 합니다.
> *   프론트엔드에는 더 이상 `.env.local` 파일을 생성하거나 비밀 키를 설정할 필요가 없습니다.

### 새로운 OAuth 제공자 추가

새로운 OAuth 제공자(예: Facebook)를 추가하려면 **백엔드**만 수정하면 됩니다.

1.  `backend/.env` 파일에 새로운 제공자의 `client-id`와 `client-secret`을 추가합니다.
2.  `application.properties`에 해당 제공자의 설정(예: `spring.security.oauth2.client.registration.facebook...`)을 추가합니다.
3.  필요한 경우, `CustomOAuth2UserService`를 수정하여 새로운 제공자가 반환하는 사용자 정보 속성을 올바르게 매핑합니다.
4.  프론트엔드에서는 `app/login/page.tsx`에 새로운 제공자를 위한 로그인 링크(예: `/oauth2/authorization/facebook`)만 추가하면 됩니다.