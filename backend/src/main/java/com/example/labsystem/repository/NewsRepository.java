package com.example.labsystem.repository;

import com.example.labsystem.domain.news.News;
import com.example.labsystem.domain.news.NewsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByType(NewsType type);
    List<News> findByPublishedTrue();

    @Query("SELECT n FROM News n WHERE n.published = true AND (n.expiresAt IS NULL OR n.expiresAt > :now) ORDER BY n.priority DESC, n.createdAt DESC")
    List<News> findActiveNews(LocalDateTime now);

    List<News> findByPublishedTrueOrderByPriorityDescCreatedAtDesc();
}
