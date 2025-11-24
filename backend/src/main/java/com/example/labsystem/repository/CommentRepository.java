package com.example.labsystem.repository;

import com.example.labsystem.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByLabWorkIdAndDeletedFalse(Long labWorkId);
    List<Comment> findByLabWorkIdAndParentCommentIsNullAndDeletedFalse(Long labWorkId);
    List<Comment> findByAuthorIdAndDeletedFalse(Long authorId);
}
