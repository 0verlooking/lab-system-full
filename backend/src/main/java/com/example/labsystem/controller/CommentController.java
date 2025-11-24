package com.example.labsystem.controller;

import com.example.labsystem.domain.comment.Comment;
import com.example.labsystem.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @GetMapping("/labwork/{labWorkId}")
    public ResponseEntity<List<Comment>> getByLabWorkId(@PathVariable Long labWorkId) {
        return ResponseEntity.ok(commentService.getRootCommentsByLabWorkId(labWorkId));
    }

    @PostMapping
    public ResponseEntity<Comment> create(@RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.create(comment));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> update(@PathVariable Long id, @RequestBody String content) {
        return ResponseEntity.ok(commentService.update(id, content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return ResponseEntity.ok().build();
    }
}
