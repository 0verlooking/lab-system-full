package com.example.labsystem.service;

import com.example.labsystem.domain.news.News;
import com.example.labsystem.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    public List<News> getActiveNews() {
        return newsRepository.findActiveNews(LocalDateTime.now());
    }

    public List<News> getAllPublished() {
        return newsRepository.findByPublishedTrueOrderByPriorityDescCreatedAtDesc();
    }

    @Transactional
    public News create(News news) {
        return newsRepository.save(news);
    }

    @Transactional
    public News publish(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found: " + id));
        news.setPublished(true);
        return newsRepository.save(news);
    }

    @Transactional
    public void delete(Long id) {
        newsRepository.deleteById(id);
    }
}
