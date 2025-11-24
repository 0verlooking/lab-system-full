package com.example.labsystem.service.impl;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.dto.request.EquipmentCreateRequest;
import com.example.labsystem.dto.request.EquipmentUpdateRequest;
import com.example.labsystem.dto.response.EquipmentResponse;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.mapper.EquipmentMapper;
import com.example.labsystem.repository.EquipmentRepository;
import com.example.labsystem.repository.LabRepository;
import com.example.labsystem.repository.LabWorkRepository;
import com.example.labsystem.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final LabRepository labRepository;
    private final LabWorkRepository labWorkRepository;
    private final EquipmentMapper equipmentMapper;

    @Override
    public List<EquipmentResponse> getAll() {
        return equipmentRepository.findAll()
                .stream()
                .map(EquipmentMapper::toResponse)
                .toList();
    }

    @Override
    public List<EquipmentResponse> getByLab(Long labId) {
        return equipmentRepository.findByLabId(labId)
                .stream()
                .map(EquipmentMapper::toResponse)
                .toList();
    }

    @Override
    public EquipmentResponse getById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment not found with id = " + id));
        return EquipmentMapper.toResponse(equipment);
    }

    @Override
    public EquipmentResponse create(EquipmentCreateRequest request) {
        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new NotFoundException("Lab not found with id = " + request.getLabId()));

        Equipment equipment = equipmentMapper.toEntity(request, lab);
        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentMapper.toResponse(saved);
    }

    @Override
    public EquipmentResponse update(Long id, EquipmentUpdateRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment not found with id = " + id));

        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new NotFoundException("Lab not found with id = " + request.getLabId()));

        equipmentMapper.updateEntity(equipment, request, lab);
        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipment not found with id = " + id));

        // Видаляємо зв'язки цього обладнання з усіх лабораторних робіт
        List<LabWork> labWorks = labWorkRepository.findAll();
        for (LabWork labWork : labWorks) {
            labWork.getRequiredEquipment().remove(equipment);
            labWorkRepository.save(labWork);
        }

        // Тепер можемо безпечно видалити обладнання
        equipmentRepository.deleteById(id);
    }
}
