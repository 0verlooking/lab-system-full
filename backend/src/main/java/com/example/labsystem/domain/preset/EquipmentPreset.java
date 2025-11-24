package com.example.labsystem.domain.preset;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Equipment Preset - Набір обладнання для швидкого вибору
 * Користувачі можуть створювати власні пресети або використовувати глобальні
 */
@Entity
@Table(name = "equipment_presets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentPreset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    /**
     * Автор пресету (може бути null для глобальних пресетів)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    /**
     * Обладнання в пресеті з кількістю
     */
    @OneToMany(mappedBy = "preset", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PresetItem> items = new ArrayList<>();

    /**
     * Чи є пресет глобальним (доступний всім)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isGlobal = false;

    /**
     * Кількість використань (статистика)
     */
    @Column(name = "usage_count")
    @Builder.Default
    private Integer usageCount = 0;

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

    /**
     * Збільшити лічильник використання
     */
    public void incrementUsageCount() {
        this.usageCount++;
    }
}
