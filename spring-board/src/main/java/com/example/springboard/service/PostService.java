package com.example.springboard.service;

import com.example.springboard.domain.Post;
import com.example.springboard.domain.PostRepository;
import com.example.springboard.domain.User;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<Post> findAll() {
        return postRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public List<Post> findMine(Long userId) {
        return postRepository.findByAuthor_IdOrderByIdDesc(userId);
    }
    public List<Post> search(String keyword) {
        if (keyword == null || keyword.isBlank()) return findAll();
        return postRepository.findByTitleContainingIgnoreCaseOrContentContainingOrderByIdDesc(keyword, keyword);
    }


    @Transactional(readOnly = true)
    public Post findOne(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));
    }

    public Post create(String title, String content, User author) {
        Post post = new Post(title, content, author);
        return postRepository.save(post);
    }

    public Post update(Long id, String title, String content) {
        Post post = findOne(id);
        post.update(title, content);
        return post;
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }
}
