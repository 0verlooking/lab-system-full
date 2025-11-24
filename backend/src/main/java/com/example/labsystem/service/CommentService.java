package com.example.labsystem.service;

import com.example.labsystem.domain.comment.Comment;
import com.example.labsystem.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public List<Comment> getByLabWorkId(Long labWorkId) {
        return commentRepository.findByLabWorkIdAndDeletedFalse(labWorkId);
    }

    public List<Comment> getRootCommentsByLabWorkId(Long labWorkId) {
        return commentRepository.findByLabWorkIdAndParentCommentIsNullAndDeletedFalse(labWorkId);
    }

    @Transactional
    public Comment create(Comment comment) {
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment update(Long id, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + id));
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public void delete(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + id));
        comment.markAsDeleted();
        commentRepository.save(comment);
    }
}
