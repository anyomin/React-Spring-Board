package com.example.springboard.service;

import com.example.springboard.domain.User;
import com.example.springboard.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public void signup(String loginId, String nickname, String password) {
        if (userRepository.existsByLoginId(loginId))
            throw new IllegalArgumentException("이미 존재하는 아이디");

        if (userRepository.existsByNickname(nickname))
            throw new IllegalArgumentException("이미 존재하는 닉네임");

        // 초보 단계: 일단 평문으로 가도 되지만,
        // 실무/정석은 BCrypt 해시 저장임(다음 단계에서 교체)
        User user = new User(loginId, nickname, password);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User login(String loginId, String password) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("아이디 없음"));

        if (!user.getPassword().equals(password))
            throw new IllegalArgumentException("비번 틀림");

        return user;
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
    }
}
