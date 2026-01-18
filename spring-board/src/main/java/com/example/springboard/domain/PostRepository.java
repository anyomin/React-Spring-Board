package com.example.springboard.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PostRepository extends JpaRepository<Post,Long>{
    List<Post> findAllByOrderByIdDesc();
    List<Post> findByAuthor_IdOrderByIdDesc(Long authorId);

    // ✅ content는 CLOB일 수 있어서 IgnoreCase 제거
    List<Post> findByTitleContainingIgnoreCaseOrContentContainingOrderByIdDesc(String title, String content);
}



