package com.example.labsystem.domain.lab;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Equipment entity (аналог Components з microlab_v2).
 * Обладнання має назву, статус доступності та посилання на документацію.
 */
@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String inventoryNumber;

    /**
     * Статус доступності (аналог availability з microlab_v2).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status;

    /**
     * Посилання на документацію, фото або додаткову інформацію (аналог link з microlab_v2).
     */
    @Column(length = 500)
    private String documentationLink;

    @ManyToOne
    @JoinColumn(name = "lab_id", nullable = true)
    private Lab lab;

    @Column(length = 1000)
    private String description;

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
    }
}
