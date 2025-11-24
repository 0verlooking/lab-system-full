package com.example.labsystem.dto.response;

import com.example.labsystem.domain.labwork.LabWorkStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabWorkResponse {

    private Long id;
    private String title;
    private String description;
    private String authorUsername;
    private List<EquipmentResponse> requiredEquipment;
    private LabWorkStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
