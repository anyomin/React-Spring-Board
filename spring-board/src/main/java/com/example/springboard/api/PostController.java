package com.example.springboard.api;

import com.example.springboard.api.dto.PostCreateRequest;
import com.example.springboard.api.dto.PostResponse;
import com.example.springboard.api.dto.PostUpdateRequest;
import com.example.springboard.domain.Post;
import com.example.springboard.domain.User;
import com.example.springboard.service.PostService;
import com.example.springboard.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.FORBIDDEN;

import org.springframework.http.HttpStatus;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")

public class PostController {

    private static final String LOGIN_USER_ID = "USER_ID";

    private final PostService postService;
    private final UserService userService;

    @GetMapping
    public List<PostResponse> list(@RequestParam(required = false) String keyword) {
        return postService.search(keyword).stream().map(PostResponse::new).toList();
    }

    // ✅  내 글 목록
    @GetMapping("/mine")
    public List<PostResponse> mine(HttpSession session) {
        Long userId = requireLogin(session);
        return postService.findMine(userId).stream().map(PostResponse::new).toList();
    }

    // ✅ 숫자만 받게 해서 /mine이 여기로 안 들어오게!
    @GetMapping("/{id:\\d+}")
    public PostResponse detail(@PathVariable Long id) {
        return new PostResponse(postService.findOne(id));
    }

    @PostMapping
    public PostResponse create(@RequestBody PostCreateRequest req, HttpSession session) {
        Long userId = requireLogin(session);

        // ✅ 검증 먼저
        if (req.getTitle() == null || req.getTitle().isBlank()
                || req.getContent() == null || req.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목/내용 필수");
        }

        User author = userService.findById(userId);
        return new PostResponse(postService.create(req.getTitle(), req.getContent(), author));
    }

    @PutMapping("/{id:\\d+}")
    public PostResponse update(@PathVariable Long id, @RequestBody PostUpdateRequest req, HttpSession session) {
        Long userId = requireLogin(session);
        Post post = postService.findOne(id);
        assertAuthor(post, userId);

        // ✅ 검증 먼저
        if (req.getTitle() == null || req.getTitle().isBlank()
                || req.getContent() == null || req.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목/내용 필수");
        }

        Post updated = postService.update(id, req.getTitle(), req.getContent());
        return new PostResponse(updated);
    }
    @DeleteMapping("/{id:\\d+}")
    public void delete(@PathVariable Long id, HttpSession session) {
        Long userId = requireLogin(session);
        Post post = postService.findOne(id);
        assertAuthor(post, userId);


        postService.delete(id);              // (추천) 서비스 delete(Long)

    }

    private Long requireLogin(HttpSession session) {
        Long userId = (Long) session.getAttribute(LOGIN_USER_ID);
        if (userId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        return userId;
    }

    private void assertAuthor(Post post, Long userId) {
        if (!post.getAuthor().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "작성자만 가능");
        }
    }
}
