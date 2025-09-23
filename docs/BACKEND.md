
## 백엔드 확장: 새로운 기능 추가 가이드 (인수인계)

이 섹션은 프로젝트에 새로운 기능을 추가하는 개발자를 위한 인수인계 가이드입니다. 기존 `User` API 구현 방식을 참고하여 새로운 엔티티와 API를 효율적으로 추가할 수 있습니다.

### 새로운 기능 추가 프로세스

새로운 기능을 추가할 때는 일반적으로 다음 단계를 따릅니다.

1.  **엔티티(Entity) 정의:**
    *   데이터베이스 테이블과 매핑될 Java 클래스를 생성합니다. (`@Entity`, `@Table`, `@Id`, `@GeneratedValue` 등의 JPA 어노테이션 사용)
    *   `lombok` 어노테이션 (`@Getter`, `@Setter`)을 활용하여 boilerplate 코드를 줄입니다.
    *   **예시:** `Post` 엔티티 (`backend/src/main/java/com/example/technote/post/Post.java`)

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

        @ManyToOne
        @JoinColumn(name = "author_id", nullable = false)
        private User author;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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

2.  **레포지토리(Repository) 정의:**
    *   새로 정의한 엔티티에 대한 데이터베이스 접근을 처리할 인터페이스를 생성합니다.
    *   `JpaRepository<엔티티클래스, ID타입>`을 상속받아 기본적인 CRUD (Create, Read, Update, Delete) 기능을 제공받습니다.
    *   `@Repository` 어노테이션을 추가합니다.
    *   **예시:** `PostRepository` (`backend/src/main/java/com/example/technote/post/PostRepository.java`)

    ```java
    package com.example.technote.post;

    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.stereotype.Repository;

    @Repository
    public interface PostRepository extends JpaRepository<Post, Long> {
    }
    ```

3.  **컨트롤러(Controller) 정의:**
    *   새로운 엔티티에 대한 RESTful API 엔드포인트를 처리할 클래스를 생성합니다.
    *   `@RestController`, `@RequestMapping` 어노테이션을 사용하여 API 경로를 정의합니다.
    *   `@Autowired`를 사용하여 레포지토리를 주입받아 데이터베이스 작업을 수행합니다.
    *   `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` 등의 어노테이션을 사용하여 각 HTTP 메서드에 대한 핸들러를 구현합니다.
    *   **예시:** `PostController` (`backend/src/main/java/com/example/technote/post/PostController.java`)

    ```java
    package com.example.technote.post;

    import com.example.technote.user.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Optional;

    @RestController
    @RequestMapping("/api/posts")
    public class PostController {

        @Autowired
        private PostRepository postRepository;

        @Autowired
        private UserRepository userRepository; // User 엔티티와의 관계를 위해 필요

        @GetMapping
        public List<Post> getAllPosts() {
            return postRepository.findAll();
        }

        @GetMapping("/{id}")
        public ResponseEntity<Post> getPostById(@PathVariable Long id) {
            Optional<Post> post = postRepository.findById(id);
            return post.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        }

        @PostMapping
        public ResponseEntity<Post> createPost(@RequestBody Post post) {
            // 실제 애플리케이션에서는 인증된 사용자 정보를 사용하여 author를 설정해야 합니다.
            // 여기서는 예시를 위해 첫 번째 사용자를 가져오거나, 새로운 사용자를 생성합니다.
            if (post.getAuthor() == null || post.getAuthor().getId() == null) {
                return ResponseEntity.badRequest().build(); // author 정보가 없으면 에러
            }
            return userRepository.findById(post.getAuthor().getId())
                    .map(author -> {
                        post.setAuthor(author);
                        return ResponseEntity.ok(postRepository.save(post));
                    })
                    .orElseGet(() -> ResponseEntity.badRequest().build()); // author를 찾을 수 없으면 에러
        }

        @PutMapping("/{id}")
        public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.setTitle(postDetails.getTitle());
                post.setContent(postDetails.getContent());
                // author는 변경하지 않거나, 인증 로직을 통해 변경해야 합니다.
                return ResponseEntity.ok(postRepository.save(post));
            } else {
                return ResponseEntity.notFound().build();
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deletePost(@PathVariable Long id) {
            if (postRepository.existsById(id)) {
                postRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
    }
    ```

4.  **데이터베이스 마이그레이션 스크립트 추가:**
    *   새로운 테이블이나 컬럼 변경이 필요한 경우, Flyway 마이그레이션 스크립트를 추가합니다.
    *   `backend/src/main/resources/db/migration` 디렉토리에 `V<다음버전>__<설명>.sql` 형식으로 파일을 생성합니다.
    *   **예시:** `posts` 테이블 생성을 위한 `V2__Create_posts_table.sql`

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
    );
    ```

### API 테스트

새로운 API를 구현한 후에는 Postman, Insomnia 또는 `curl`과 같은 도구를 사용하여 테스트합니다.

*   **애플리케이션 재시작:**

    ```bash
    npm run stop
    npm run dev
    ```

*   **예시 테스트 시나리오 (Post API):**

    *   **새로운 사용자 생성 (먼저):**
        `POST http://localhost:8080/api/users`
        Body: `{"username": "testuser", "email": "test@example.com"}`

    *   **새로운 게시물 생성:**
        `POST http://localhost:8080/api/posts`
        Body: `{"title": "첫 번째 게시물", "content": "이것은 첫 번째 게시물의 내용입니다.", "author": {"id": 1}}` (여기서 `author.id`는 위에서 생성된 사용자의 ID입니다.)

    *   **모든 게시물 조회:**
        `GET http://localhost:8080/api/posts`

    *   **특정 게시물 조회:**
        `GET http://localhost:8080/api/posts/1`

    *   **게시물 업데이트:**
        `PUT http://localhost:8080/api/posts/1`
        Body: `{"title": "업데이트된 게시물", "content": "내용이 업데이트되었습니다.", "author": {"id": 1}}`

    *   **게시물 삭제:**
        `DELETE http://localhost:8080/api/posts/1`

이 가이드를 통해 Spring Boot 백엔드에 새로운 기능을 추가하는 과정을 이해하고, 프로젝트를 확장해 나갈 수 있습니다.
