package com.example.springboard.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PostCreateRequest {
    private String title;
    private String content;

}
