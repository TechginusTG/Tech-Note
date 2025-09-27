# 로컬 개발 환경 설정

이 가이드는 로컬 머신에서 Tech-Note 프로젝트를 설정하고 실행하기 위한 포괄적인 지침을 제공합니다.

## 1. 아키텍처 개요

로컬 개발 환경은 세 가지 주요 구성 요소로 이루어집니다:

1.  **프론트엔드 (Next.js):** 로컬 머신에서 실행되는 Node.js 기반 웹 서버.
2.  **백엔드 (Spring Boot):** 로컬 머신에서 실행되는 Java 기반 API 서버.
3.  **데이터베이스 (PostgreSQL):** **Podman**으로 관리되는 컨테이너 내부에서 실행되는 PostgreSQL 서버.

이 설정은 프론트엔드와 백엔드의 신속한 개발 및 디버깅을 가능하게 하면서 일관되고 격리된 데이터베이스 환경을 보장합니다.

## 2. 사전 요구 사항

시작하기 전에 시스템에 다음 소프트웨어가 설치되어 있는지 확인하십시오:

- **Java 17+:** 백엔드 애플리케이션 실행용.
- **Node.js 18+:** 프론트엔드 애플리케이션 실행용.
- **Podman:** 데이터베이스 컨테이너 실행용.
- **Podman Compose:** `docker-compose.yml` 파일을 통해 데이터베이스 서비스를 오케스트레이션하기 위함.
- **Git:** 프로젝트 리포지토리 복제용.

### Podman 설치 참고 사항

Podman, 특히 `podman machine` 또는 `podman-compose` 실행에 문제가 발생하면 종속성이 누락되었을 수 있습니다. Linux에서는 `qemu-utils` 및 `podman-plugins`(또는 사용 중인 배포판의 동등한 패키지)가 설치되어 있는지 확인하십시오.

- **Debian/Ubuntu:** `sudo apt-get install qemu-utils podman-plugins`
- **Fedora/CentOS:** `sudo dnf install qemu-img podman-plugins`

## 3. 설정 및 구성

### 1단계: 리포지토리 복제

```bash
git clone <repository_url>
cd Tech-Note
```

### 2단계: 환경 변수 구성

프로젝트 루트 디렉토리에 `.env` 파일을 만듭니다. 이 파일은 데이터베이스 자격 증명을 저장합니다. 이 파일은 Git에 의해 무시되며 커밋되어서는 안 됩니다.

```env
# .env
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=technote
POSTGRES_PORT=5432
```

### 3단계: 데이터베이스 시작

`podman-compose`를 사용하여 백그라운드에서 PostgreSQL 데이터베이스 컨테이너를 시작합니다.

```bash
# -d 플래그는 컨테이너를 분리 모드(detached mode)로 실행합니다.
podman-compose up -d
```

**볼륨 마운트 문제 해결:**
위 명령이 볼륨 마운트 오류로 실패하는 경우, Podman 설정에서 호스트 경로 마운트 문제일 수 있습니다. 이 프로젝트는 이러한 문제를 피하기 위해 Podman 자체에서 관리하는 **명명된 볼륨(named volume)**(`pgdata`)을 사용하도록 구성되었습니다. `docker-compose.yml` 파일은 이를 위해 미리 구성되어 있어야 합니다.

컨테이너 상태를 확인하려면:
```bash
podman-compose ps
```

데이터베이스를 중지하려면:
```bash
podman-compose down
```

### 4단계: 백엔드 애플리케이션 실행

새 터미널을 열고 `backend` 디렉토리로 이동합니다. Gradle 래퍼를 사용하여 Spring Boot 애플리케이션을 빌드하고 실행합니다.

```bash
cd backend
./gradlew bootRun
```

API 서버가 `http://localhost:8080`에서 시작됩니다.

### 5단계: 프론트엔드 애플리케이션 실행

세 번째 터미널을 엽니다. 프로젝트 루트에서 Node.js 종속성을 설치하고 Next.js 개발 서버를 시작합니다.

```bash
# 종속성 설치 (처음 한 번만 필요)
npm install

# 개발 서버 시작
npm run dev
```

웹 애플리케이션은 `http://localhost:3000`에서 사용할 수 있습니다.

## 4. 워크플로우 요약

- **모든 서비스 시작하기:**
    1.  터미널에서 `podman-compose up -d` 실행.
    2.  두 번째 터미널(`backend` 디렉토리)에서 `./gradlew bootRun` 실행.
    3.  세 번째 터미널(프로젝트 루트)에서 `npm run dev` 실행.

- **모든 서비스 중지하기:**
    1.  프론트엔드 및 백엔드 터미널에서 `Ctrl + C`를 누릅니다.
    2.  `podman-compose down`을 실행하여 데이터베이스 컨테이너를 중지합니다.

즐거운 코딩 되세요!