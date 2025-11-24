package com.example.labsystem.service.impl;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.labwork.LabWorkStatus;
import com.example.labsystem.domain.user.User;
import com.example.labsystem.domain.user.UserRole;
import com.example.labsystem.dto.request.LabWorkCreateRequest;
import com.example.labsystem.dto.request.LabWorkUpdateRequest;
import com.example.labsystem.dto.response.LabWorkResponse;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.mapper.EquipmentMapper;
import com.example.labsystem.repository.EquipmentRepository;
import com.example.labsystem.repository.LabWorkRepository;
import com.example.labsystem.repository.UserRepository;
import com.example.labsystem.service.LabWorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Реалізація сервісу лабораторних робіт (аналог ProjectsService з microlab_v2).
 * Застосовує SOLID принципи:
 * - Single Responsibility: відповідає лише за бізнес-логіку лабораторних робіт
 * - Dependency Inversion: залежить від абстракцій (repositories)
 */
@Service
@RequiredArgsConstructor
public class LabWorkServiceImpl implements LabWorkService {

    private final LabWorkRepository labWorkRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LabWorkResponse create(LabWorkCreateRequest request) {
        User author = getCurrentUser();

        List<Equipment> equipment = equipmentRepository.findAllById(request.getEquipmentIds());

        LabWork labWork = LabWork.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .author(author)
                .requiredEquipment(equipment)
                .status(LabWorkStatus.DRAFT)
                .build();

        labWorkRepository.save(labWork);

        return toResponse(labWork);
    }

    @Override
    public List<LabWorkResponse> getAllLabWorks() {
        return labWorkRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LabWorkResponse getById(Long id) {
        LabWork labWork = labWorkRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LabWork not found"));
        return toResponse(labWork);
    }

    @Override
    public List<LabWorkResponse> getPublished() {
        return labWorkRepository.findByStatusOrderByCreatedAtDesc(LabWorkStatus.PUBLISHED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LabWorkResponse> getMyLabWorks() {
        User author = getCurrentUser();
        return labWorkRepository.findByAuthor(author).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LabWorkResponse update(Long id, LabWorkUpdateRequest request) {
        LabWork labWork = labWorkRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LabWork not found"));

        // Перевірка прав доступу: тільки автор або адміністратор/менеджер можуть оновлювати
        User currentUser = getCurrentUser();
        if (!canModifyLabWork(labWork, currentUser)) {
            throw new RuntimeException("You don't have permission to update this lab work");
        }

        if (request.getTitle() != null) {
            labWork.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            labWork.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            labWork.setStatus(request.getStatus());
        }
        if (request.getEquipmentIds() != null) {
            List<Equipment> equipment = equipmentRepository.findAllById(request.getEquipmentIds());
            labWork.setRequiredEquipment(equipment);
        }

        labWorkRepository.save(labWork);

        return toResponse(labWork);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        LabWork labWork = labWorkRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LabWork not found"));

        // Перевірка прав доступу: тільки автор або адміністратор/менеджер можуть видаляти
        User currentUser = getCurrentUser();
        if (!canModifyLabWork(labWork, currentUser)) {
            throw new RuntimeException("You don't have permission to delete this lab work");
        }

        labWorkRepository.delete(labWork);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }

    /**
     * Перевіряє чи може користувач модифікувати лабораторну роботу.
     * ADMIN та LAB_MANAGER можуть модифікувати будь-які роботи.
     * STUDENT може модифікувати тільки свої роботи.
     */
    private boolean canModifyLabWork(LabWork labWork, User user) {
        // Адміністратори та менеджери можуть модифікувати будь-які роботи
        if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.LAB_MANAGER) {
            return true;
        }

        // Студенти можуть модифікувати тільки свої роботи
        return labWork.getAuthor().getId().equals(user.getId());
    }

    private LabWorkResponse toResponse(LabWork labWork) {
        return LabWorkResponse.builder()
                .id(labWork.getId())
                .title(labWork.getTitle())
                .description(labWork.getDescription())
                .authorUsername(labWork.getAuthor().getUsername())
                .requiredEquipment(labWork.getRequiredEquipment().stream()
                        .map(EquipmentMapper::toResponse)
                        .collect(Collectors.toList()))
                .status(labWork.getStatus())
                .createdAt(labWork.getCreatedAt())
                .updatedAt(labWork.getUpdatedAt())
                .build();
    }
}
