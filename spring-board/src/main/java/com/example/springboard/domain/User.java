package com.example.springboard.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String loginId;   // 아이디(변경 X, 중복 X)

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;  // 닉네임(중복 X)

    @Column(nullable = false, length = 255)
    private String password;  // 지금은 평문, 다음 단계에서 BCrypt로 바꿈

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String loginId, String nickname, String password) {
        this.loginId = loginId;
        this.nickname = nickname;
        this.password = password;
    }
}
