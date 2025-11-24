package com.example.labsystem.domain.news;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * News - Новини в системі
 * Можуть бути: нове обладнання, нові проекти, оголошення тощо
 */
@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Тип новини
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsType type;

    /**
     * Заголовок
     */
    @Column(nullable = false)
    private String title;

    /**
     * Зміст новини
     */
    @Column(nullable = false, length = 2000)
    private String content;

    /**
     * Автор новини
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    /**
     * Пов'язана лабораторна робота (для NEW_PROJECT)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_labwork_id")
    private LabWork relatedLabWork;

    /**
     * Пов'язане обладнання (для NEW_EQUIPMENT)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_equipment_id")
    private Equipment relatedEquipment;

    /**
     * URL зображення для новини
     */
    @Column(name = "image_url")
    private String imageUrl;

    /**
     * Пріоритет (для сортування)
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer priority = 0;

    /**
     * Чи активна новина (для архівації)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Чи опублікована новина
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean published = false;

    /**
     * Дата публікації
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * Дата закінчення показу (опційно)
     */
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Перевірка чи новина ще актуальна
     */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Архівувати новину
     */
    public void archive() {
        this.active = false;
    }
}
