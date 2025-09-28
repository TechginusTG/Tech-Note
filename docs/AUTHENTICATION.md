# 인증 시스템: OAuth2 소셜 로그인

이 문서는 Tech-Note 프로젝트의 인증 시스템에 대한 개요를 제공합니다. 현재 시스템은 GitHub와 Google을 통한 OAuth2 소셜 로그인을 지원합니다.

## 1. 아키텍처

인증은 프론트엔드와 백엔드의 협력을 통해 처리됩니다:

*   **백엔드 (Spring Boot):** Spring Security의 OAuth2 클라이언트 기능을 사용하여 외부 OAuth 공급자(Google, GitHub)와의 통신을 관리합니다. 사용자가 성공적으로 인증되면 백엔드는 사용자 정보를 데이터베이스에 저장하거나 업데이트합니다.
*   **프론트엔드 (Next.js):** `next-auth` 라이브러리를 사용하여 로그인 UI를 처리하고 세션 상태를 관리합니다. 사용자가 로그인 버튼을 클릭하면 백엔드의 OAuth2 엔드포인트로 리디렉션됩니다.

## 2. 구현 세부 정보

### 백엔드

1.  **의존성 추가 (`build.gradle`):**
    `spring-boot-starter-security`와 `spring-boot-starter-oauth2-client` 의존성이 추가되어 OAuth2 및 보안 기능을 활성화했습니다.

2.  **보안 설정 (`SecurityConfig.java`):
    `@EnableWebSecurity`를 사용하여 보안을 활성화하고, `.oauth2Login()`을 통해 OAuth2 로그인을 구성합니다. 주요 설정은 다음과 같습니다:
    *   `/api/**` 경로는 인증 없이 접근을 허용하여 비로그인 사용자도 API를 사용할 수 있도록 합니다.
    *   `CustomOAuth2UserService`를 사용하여 로그인 성공 후 사용자 정보를 처리합니다.
    *   `OAuth2LoginSuccessHandler`를 사용하여 로그인 성공 시 프론트엔드 홈페이지(`/`)로 리디렉션합니다.

3.  **사용자 정보 처리 (`CustomOAuth2UserService.java`):
    이 서비스는 OAuth2 공급자로부터 받은 사용자 정보를 처리합니다. 사용자가 데이터베이스에 이미 존재하는지 `provider`와 `providerId`로 확인하고, 존재하지 않으면 새로운 `User` 레코드를 생성합니다.

4.  **엔티티 수정 (`User.java`):
    `User` 엔티티에 `provider` (예: "github", "google")와 `providerId` (공급자 시스템 내의 사용자 고유 ID) 필드가 추가되었습니다. 기존의 `username`과 `email`은 OAuth 공급자가 항상 제공하지 않을 수 있으므로 `nullable`로 변경되었습니다.

5.  **설정 (`application.properties`):
    각 OAuth 공급자의 `client-id`와 `client-secret`을 여기에 설정해야 합니다. 이 값들은 민감 정보이므로 소스 코드에 직접 하드코딩해서는 안 됩니다.

### 프론트엔드

1.  **라이브러리 추가 (`package.json`):**
    `next-auth` 라이브러리가 추가되어 클라이언트 측 인증 흐름과 세션 관리를 처리합니다.

2.  **NextAuth 설정 (`app/api/auth/[...nextauth].ts`):
    Next.js API 라우트로, `next-auth`의 설정을 담당합니다. GitHub와 Google 제공자가 여기에 구성되며, 필요한 `clientId`와 `clientSecret`은 환경 변수에서 가져옵니다.

3.  **세션 프로바이더 (`app/auth-provider.tsx` 및 `app/layout.tsx`):
    애플리케이션의 최상위 레이아웃이 `SessionProvider`로 래핑되어 모든 컴포넌트에서 `useSession` 훅을 통해 인증 상태에 접근할 수 있습니다.

4.  **로그인 페이지 (`app/login/page.tsx`):
    기존의 ID/비밀번호 폼 대신 "Sign In with GitHub"와 "Sign In with Google" 버튼을 표시하도록 업데이트되었습니다. 각 버튼은 `next-auth`의 `signIn()` 함수를 호출하여 해당 제공자로 로그인 절차를 시작합니다.

5.  **헤더 컴포넌트 (`components/Header.tsx`):
    `useSession` 훅을 사용하여 사용자의 로그인 상태를 확인합니다. 로그인된 경우, 사용자 이름과 로그아웃 버튼을 표시하고, 그렇지 않으면 로그인 링크를 표시합니다.

## 3. 설정 및 관리

### 환경 변수 설정

OAuth2 로그인이 올바르게 작동하려면, 백엔드와 프론트엔드 모두에 대한 환경 변수를 설정해야 합니다.

**1. 백엔드 설정:**

`backend/src/main/resources/application.properties` 파일을 열고 다음 자리 표시자를 실제 OAuth2 클라이언트 ID 및 시크릿으로 바꾸십시오.

```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

# GitHub OAuth2
spring.security.oauth2.client.registration.github.client-id=YOUR_GITHUB_CLIENT_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_GITHUB_CLIENT_SECRET
```

**2. 프론트엔드 설정:**

프로젝트의 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 변수를 추가하십시오. 이 파일은 `.gitignore`에 의해 추적되지 않으므로 안전합니다.

```
# .env.local

GITHUB_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_SECRET=YOUR_GITHUB_CLIENT_SECRET
GOOGLE_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

> **중요:** 위의 `YOUR_...` 값들은 Google Cloud Platform과 GitHub 개발자 설정에서 OAuth2 애플리케이션을 생성하여 얻어야 합니다.

### 새로운 OAuth 제공자 추가

새로운 OAuth 제공자(예: Facebook)를 추가하려면 다음 단계를 따르십시오.

1.  **백엔드:**
    *   `application.properties`에 새로운 제공자의 `client-id`와 `client-secret`을 추가합니다.
    *   필요한 경우, `CustomOAuth2UserService`를 수정하여 새로운 제공자가 반환하는 사용자 정보 속성(예: 이름, 이메일)을 올바르게 매핑합니다.

2.  **프론트엔드:**
    *   `app/api/auth/[...nextauth].ts` 파일의 `providers` 배열에 새로운 제공자 설정을 추가합니다. `next-auth`는 다양한 내장 제공자를 지원합니다.
    *   `app/login/page.tsx`에 새로운 제공자를 위한 로그인 버튼을 추가합니다.
