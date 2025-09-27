# 백엔드 개발자 가이드: 새로운 기능 추가

이 가이드는 기존 `User` API를 참조하여 백엔드에 새로운 기능을 확장하는 단계별 프로세스를 제공합니다.

## 핵심 원칙

우리 백엔드는 표준 Spring Boot 규칙을 따르며, 계층화된 아키텍처를 통해 관심사를 명확하게 분리하는 것을 강조합니다:

*   **엔티티(Entity):** 데이터 모델을 나타내며 데이터베이스 테이블에 매핑됩니다.
*   **리포지토리(Repository):** 데이터 영속성을 관리하고 데이터베이스 작업을 위한 상위 수준의 API를 제공합니다.
*   **컨트롤러(Controller):** 클라이언트에 RESTful API 엔드포인트를 노출합니다.

## 'Post' 기능 추가 단계별 가이드

블로그 `Post` 엔티티를 관리하기 위한 새로운 기능을 추가하는 방법은 다음과 같습니다.

### 1단계: 엔티티 정의

`Post` 데이터 모델을 나타내는 새 Java 클래스를 만듭니다. 이 클래스는 데이터베이스의 `posts` 테이블에 매핑됩니다.

**파일:** `backend/src/main/java/com/example/technote/post/Post.java`

```java
package com.example.technote.post;

import com.example.technote.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // User 엔티티와 다대일 관계를 설정합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 영속화 또는 업데이트 전에 타임스탬프를 자동으로 설정합니다.
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 2단계: 리포지토리 생성

`JpaRepository`를 확장하는 리포지토리 인터페이스를 만듭니다. 이를 통해 필요한 모든 CRUD(생성, 읽기, 업데이트, 삭제) 메소드가 기본적으로 제공됩니다.

**파일:** `backend/src/main/java/com/example/technote/post/PostRepository.java`

```java
package com.example.technote.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // 필요한 경우 여기에 사용자 정의 쿼리 메소드를 추가할 수 있습니다.
}
```

### 3단계: 컨트롤러 구현

들어오는 HTTP 요청을 처리하고 `Post` 리소스에 대한 RESTful API 엔드포인트를 노출하는 컨트롤러를 만듭니다.

**파일:** `backend/src/main/java/com/example/technote/post/PostController.java`

```java
package com.example.technote.post;

import com.example.technote.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository; // 작성자 관계를 위해 필요

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        // 실제 앱에서는 인증된 사용자의 보안 컨텍스트에서 작성자를 가져와야 합니다.
        // 이 예제에서는 요청에 작성자의 ID가 제공된다고 가정합니다.
        if (post.getAuthor() == null || post.getAuthor().getId() == null) {
            return ResponseEntity.badRequest().body(null); // 작성자 정보는 필수입니다.
        }
        return userRepository.findById(post.getAuthor().getId())
                .map(author -> {
                    post.setAuthor(author);
                    Post savedPost = postRepository.save(post);
                    return ResponseEntity.ok(savedPost);
                })
                .orElse(ResponseEntity.badRequest().build()); // 작성자를 찾을 수 없음.
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setTitle(postDetails.getTitle());
                    post.setContent(postDetails.getContent());
                    // 게시물의 작성자는 일반적으로 변경해서는 안 됩니다.
                    Post updatedPost = postRepository.save(post);
                    return ResponseEntity.ok(updatedPost);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(post -> {
                    postRepository.delete(post);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
```

### 4단계: 데이터베이스 마이그레이션 추가

마지막으로, 데이터베이스에 `posts` 테이블을 생성하기 위한 Flyway 마이그레이션 스크립트를 만듭니다.

**파일:** `backend/src/main/resources/db/migration/V2__Create_posts_table.sql`

```sql
-- V2__Create_posts_table.sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT fk_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- 선택 사항: 작성자가 삭제되면 게시물도 삭제합니다.
);
```

### 5단계: API 테스트

백엔드 애플리케이션을 다시 시작한 후, `curl`이나 Postman과 같은 도구를 사용하여 새 엔드포인트를 테스트합니다.

1.  **먼저 사용자 생성:**
    *   `POST /api/users` 요청, body: `{"username": "testuser", "email": "test@example.com"}`

2.  **게시물 생성:**
    *   `POST /api/posts` 요청, body: `{"title": "My First Post", "content": "Hello World!", "author": {"id": 1}}`

3.  **모든 게시물 조회:**
    *   `GET /api/posts`
