package com.example.springboard.api.dto;

import com.example.springboard.domain.User;

public class UserResponse {
    private Long id;
    private String loginId;
    private String nickname;

    public UserResponse(User user) {
        this.id = user.getId();
        this.loginId = user.getLoginId();
        this.nickname = user.getNickname();
    }

    public Long getId() { return id; }
    public String getLoginId() { return loginId; }
    public String getNickname() { return nickname; }
}
