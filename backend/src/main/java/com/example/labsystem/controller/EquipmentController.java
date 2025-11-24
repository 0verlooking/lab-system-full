package com.example.labsystem.controller;

import com.example.labsystem.dto.request.EquipmentCreateRequest;
import com.example.labsystem.dto.request.EquipmentUpdateRequest;
import com.example.labsystem.dto.response.EquipmentResponse;
import com.example.labsystem.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public List<EquipmentResponse> getAll() {
        return equipmentService.getAll();
    }

    @GetMapping("/lab/{labId}")
    public List<EquipmentResponse> getByLab(@PathVariable Long labId) {
        return equipmentService.getByLab(labId);
    }

    @GetMapping("/{id}")
    public EquipmentResponse getById(@PathVariable Long id) {
        return equipmentService.getById(id);
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> create(@Valid @RequestBody EquipmentCreateRequest request) {
        EquipmentResponse response = equipmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public EquipmentResponse update(@PathVariable Long id,
                                    @Valid @RequestBody EquipmentUpdateRequest request) {
        return equipmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        equipmentService.delete(id);
    }
}
