package com.example.springboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .authorizeHttpRequests(auth -> auth
                        // ✅ H2 콘솔 허용
                        .requestMatchers("/h2-console/**").permitAll()
                        // ✅ 나머지도 일단 허용
                        .anyRequest().permitAll()
                )

                // ✅ H2 콘솔은 iframe을 쓰기 때문에 이거 없으면 "연결 거부" 뜸
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

                .logout(logout -> logout
                        .logoutUrl("/api/users/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((req, res, authn) -> res.setStatus(204))
                );

        return http.build();
    }
}
