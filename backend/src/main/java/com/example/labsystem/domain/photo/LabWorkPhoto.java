package com.example.labsystem.domain.photo;

import com.example.labsystem.domain.labwork.LabWork;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * LabWorkPhoto - Фотографія лабораторної роботи (проекту)
 * Може бути схема, фото результату, діаграма алгоритму тощо
 */
@Entity
@Table(name = "labwork_photos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabWorkPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Лабораторна робота (проект) до якої належить фото
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labwork_id", nullable = false)
    private LabWork labWork;

    /**
     * URL/шлях до фото
     */
    @Column(nullable = false, length = 500)
    private String photoUrl;

    /**
     * Тип фото
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PhotoType type = PhotoType.RESULT;

    /**
     * Опис/підпис до фото
     */
    @Column(length = 500)
    private String caption;

    /**
     * Порядок відображення
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    /**
     * Чи є головним фото (прев'ю проекту)
     */
    @Column(name = "is_primary")
    @Builder.Default
    private Boolean isPrimary = false;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
