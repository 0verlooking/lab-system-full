package com.example.labsystem.dto.response;

import com.example.labsystem.domain.lab.EquipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для обладнання (аналог Component з microlab_v2).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {

    private Long id;
    private String name;
    private String inventoryNumber;

    /**
     * Статус доступності (аналог availability з microlab_v2).
     */
    private EquipmentStatus status;

    /**
     * Посилання на документацію (аналог link з microlab_v2).
     */
    private String documentationLink;

    private String description;

    private Long labId;
    private String labName;
}
