package com.example.labsystem.mapper;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.dto.request.EquipmentCreateRequest;
import com.example.labsystem.dto.request.EquipmentUpdateRequest;
import com.example.labsystem.dto.response.EquipmentResponse;
import org.springframework.stereotype.Component;

@Component
public class EquipmentMapper {

    public Equipment toEntity(EquipmentCreateRequest request, Lab lab) {
        Equipment equipment = new Equipment();
        equipment.setName(request.getName());
        equipment.setInventoryNumber(request.getInventoryNumber());
        equipment.setStatus(request.getStatus());
        equipment.setLab(lab);
        return equipment;
    }

    public void updateEntity(Equipment equipment, EquipmentUpdateRequest request, Lab lab) {
        equipment.setName(request.getName());
        equipment.setInventoryNumber(request.getInventoryNumber());
        equipment.setStatus(request.getStatus());
        equipment.setLab(lab);
    }

    public static EquipmentResponse toResponse(Equipment equipment) {
        return EquipmentResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .inventoryNumber(equipment.getInventoryNumber())
                .status(equipment.getStatus())
                .documentationLink(equipment.getDocumentationLink())
                .description(equipment.getDescription())
                .labId(
                        equipment.getLab() != null ? equipment.getLab().getId() : null
                )
                .labName(
                        equipment.getLab() != null ? equipment.getLab().getName() : null
                )
                .build();
    }
}
