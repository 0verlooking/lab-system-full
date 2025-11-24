package com.example.labsystem.controller;

import com.example.labsystem.domain.news.News;
import com.example.labsystem.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<News>> getActiveNews() {
        return ResponseEntity.ok(newsService.getActiveNews());
    }

    @GetMapping("/all")
    public ResponseEntity<List<News>> getAllPublished() {
        return ResponseEntity.ok(newsService.getAllPublished());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CURATOR')")
    public ResponseEntity<News> create(@RequestBody News news) {
        return ResponseEntity.ok(newsService.create(news));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'CURATOR')")
    public ResponseEntity<News> publish(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.publish(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsService.delete(id);
        return ResponseEntity.ok().build();
    }
}
