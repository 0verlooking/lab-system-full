package com.example.labsystem.domain.preset;

import com.example.labsystem.domain.lab.Equipment;
import jakarta.persistence.*;
import lombok.*;

/**
 * PresetItem - Елемент пресету з кількістю
 */
@Entity
@Table(name = "preset_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresetItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Пресет до якого належить цей елемент
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id", nullable = false)
    private EquipmentPreset preset;

    /**
     * Обладнання
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    /**
     * Кількість одиниць цього обладнання
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    /**
     * Примітка до елемента (опціонально)
     */
    @Column(length = 500)
    private String note;
}
