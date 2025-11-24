package com.example.labsystem.domain.comment;

import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Comment - Коментар до лабораторної роботи (проекту)
 * Можуть залишати куратори та студенти
 */
@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Лабораторна робота (проект) до якої належить коментар
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labwork_id", nullable = false)
    private LabWork labWork;

    /**
     * Автор коментаря
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    /**
     * Текст коментаря
     */
    @Column(nullable = false, length = 2000)
    private String content;

    /**
     * Батьківський коментар (для відповідей на коментарі)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    /**
     * Чи відредагований коментар
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean edited = false;

    /**
     * Чи видалений коментар (soft delete)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        this.edited = true;
    }

    /**
     * Soft delete коментаря
     */
    public void markAsDeleted() {
        this.deleted = true;
        this.content = "[Коментар видалено]";
    }
}
