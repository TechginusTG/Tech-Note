# 백엔드 아키텍처

백엔드는 Spring Boot를 기반으로 한 REST API 서버로 구성되어 있습니다.

## 기술 스택

- **프레임워크**: [Spring Boot](https://spring.io/projects/spring-boot)
- **언어**: [Java](https://www.java.com/)
- **빌드 도구**: [Gradle](https://gradle.org/)
- **데이터베이스 연동**: Spring Data JPA (향후 H2, PostgreSQL 등과 연동)

## 폴더 구조

백엔드 소스 코드는 `/backend` 디렉토리 내에 위치하며, 표준 Gradle 프로젝트 구조를 따릅니다.

- **`/backend/src/main/java`**: 애플리케이션의 핵심 Java 소스 코드가 위치합니다.
  - `com/example/technote/TechnoteApplication.java`: Spring Boot 애플리케이션의 시작점(entry point)입니다.
  - 향후 여기에 컨트롤러(Controller), 서비스(Service), 레포지토리(Repository), 도메인(Domain) 등의 패키지가 추가될 것입니다.

- **`/backend/src/main/resources`**: 설정 파일이 위치합니다.
  - `application.properties`: 데이터베이스 연결 정보, 서버 포트 등 애플리케이션의 주요 설정을 담당합니다.

- **`/backend/src/test/java`**: 단위 테스트 및 통합 테스트 코드가 위치합니다.

## 실행 방법

다음 명령어를 사용하여 개발 서버를 시작할 수 있습니다.

**macOS/Linux:**
```bash
cd backend
./gradlew bootRun
```

**Windows:**
```bash
cd backend
.\gradlew.bat bootRun
```
