package com.example.springboard.api;

import com.example.springboard.api.dto.LoginRequest;
import com.example.springboard.api.dto.SignupRequest;
import com.example.springboard.api.dto.UserResponse;
import com.example.springboard.domain.User;
import com.example.springboard.domain.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ 회원가입
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@RequestBody SignupRequest req) {
        if (req.getLoginId() == null || req.getLoginId().isBlank()
                || req.getNickname() == null || req.getNickname().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모두 입력해주세요");
        }

        if (userRepository.existsByLoginId(req.getLoginId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 존재하는 아이디");
        }
        if (userRepository.existsByNickname(req.getNickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 존재하는 닉네임");
        }

        // ✅ BCrypt로 저장 (중요)
        String encodedPw = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getLoginId(), req.getNickname(), encodedPw);
        userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(user));
    }

    // ✅ 로그인(세션 생성)
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest req,
                                              HttpServletRequest request) {
        if (req.getLoginId() == null || req.getLoginId().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "loginId/password required");
        }

        User user = userRepository.findByLoginId(req.getLoginId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디/비밀번호 오류"));

        // ✅ 여기 핵심: User 엔티티는 getPassword()
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디/비밀번호 오류");
        }

        request.getSession(true).setAttribute("USER_ID", user.getId());
        return ResponseEntity.ok(new UserResponse(user));
    }

    // ✅ 내 정보
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("USER_ID") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        Long userId = (Long) session.getAttribute("USER_ID");
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요"));

        return ResponseEntity.ok(new UserResponse(user));
    }

    // ✅ 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.noContent().build(); // 204
    }
}
