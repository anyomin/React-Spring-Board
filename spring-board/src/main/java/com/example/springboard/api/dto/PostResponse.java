package com.example.springboard.api.dto;

import com.example.springboard.domain.Post;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostResponse {
    private Long id;
    private String title;
    private String content;

    private Long authorId;
    private String authorNickname;
    private String authorLoginId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostResponse(Post p) {
        this.id = p.getId();
        this.title = p.getTitle();
        this.content = p.getContent();

        this.authorId = p.getAuthor().getId();
        this.authorNickname = p.getAuthor().getNickname();
        this.authorLoginId = p.getAuthor().getLoginId();

        this.createdAt = p.getCreatedAt();
        this.updatedAt = p.getUpdatedAt();
    }
}
