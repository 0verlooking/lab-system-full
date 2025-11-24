package com.example.labsystem.service;

import com.example.labsystem.dto.request.EquipmentCreateRequest;
import com.example.labsystem.dto.request.EquipmentUpdateRequest;
import com.example.labsystem.dto.response.EquipmentResponse;

import java.util.List;

public interface EquipmentService {

    List<EquipmentResponse> getAll();

    List<EquipmentResponse> getByLab(Long labId);

    EquipmentResponse getById(Long id);

    EquipmentResponse create(EquipmentCreateRequest request);

    EquipmentResponse update(Long id, EquipmentUpdateRequest request);

    void delete(Long id);
}
