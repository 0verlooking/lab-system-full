package com.example.labsystem.service.impl;

import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.dto.request.LabCreateRequest;
import com.example.labsystem.dto.request.LabUpdateRequest;
import com.example.labsystem.dto.response.LabResponse;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.mapper.LabMapper;
import com.example.labsystem.repository.EquipmentRepository;
import com.example.labsystem.repository.LabRepository;
import com.example.labsystem.service.LabService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabServiceImpl implements LabService {

    private final LabRepository labRepository;
    private final EquipmentRepository equipmentRepository;
    private final LabMapper labMapper;

    @Override
    public List<LabResponse> getAll() {
        return labRepository.findAll()
                .stream()
                .map(labMapper::toResponse)
                .toList();
    }

    @Override
    public LabResponse create(LabCreateRequest request) {
        Lab lab = labMapper.toEntity(request);
        Lab saved = labRepository.save(lab);
        return labMapper.toResponse(saved);
    }

    @Override
    public LabResponse update(Long id, LabUpdateRequest request) {
        Lab lab = labRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lab not found"));

        labMapper.updateEntity(lab, request);

        return labMapper.toResponse(labRepository.save(lab));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!labRepository.existsById(id)) {
            throw new NotFoundException("Lab not found");
        }

        // Спочатку видаляємо зв'язок обладнання з лабораторією
        equipmentRepository.findByLabId(id).forEach(equipment -> {
            equipment.setLab(null);
            equipmentRepository.save(equipment);
        });

        // Тепер можемо безпечно видалити лабораторію
        labRepository.deleteById(id);
    }
}
