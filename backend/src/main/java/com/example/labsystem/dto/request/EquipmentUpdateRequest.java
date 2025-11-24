package com.example.labsystem.dto.request;

import com.example.labsystem.domain.lab.EquipmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipmentUpdateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String inventoryNumber;

    @NotNull
    private EquipmentStatus status;

    @NotNull
    private Long labId;
}
