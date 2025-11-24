package com.example.labsystem.service.impl;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.reservation.Reservation;
import com.example.labsystem.domain.reservation.ReservationStatus;
import com.example.labsystem.domain.user.User;
import com.example.labsystem.dto.request.ReservationCreateRequest;
import com.example.labsystem.dto.request.ReservationStatusUpdateRequest;
import com.example.labsystem.dto.response.ReservationResponse;
import com.example.labsystem.exception.NotFoundException;
import com.example.labsystem.mapper.EquipmentMapper;
import com.example.labsystem.pattern.observer.ReservationEvent;
import com.example.labsystem.pattern.observer.ReservationEventPublisher;
import com.example.labsystem.pattern.strategy.ReservationValidator;
import com.example.labsystem.repository.EquipmentRepository;
import com.example.labsystem.repository.LabRepository;
import com.example.labsystem.repository.LabWorkRepository;
import com.example.labsystem.repository.ReservationRepository;
import com.example.labsystem.repository.UserRepository;
import com.example.labsystem.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Реалізація сервісу резервацій (аналог OrdersService з microlab_v2).
 * Застосовує SOLID принципи та Design Patterns:
 * - Single Responsibility: відповідає лише за бізнес-логіку резервацій
 * - Strategy Pattern: використовує ReservationValidator для валідації
 * - Observer Pattern: публікує події через ReservationEventPublisher
 * - Dependency Inversion: залежить від абстракцій
 */
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final LabRepository labRepository;
    private final LabWorkRepository labWorkRepository;
    private final EquipmentRepository equipmentRepository;
    private final UserRepository userRepository;
    private final ReservationValidator reservationValidator;
    private final ReservationEventPublisher eventPublisher;

    @Override
    @Transactional
    public ReservationResponse create(ReservationCreateRequest request) {
        Lab lab = labRepository.findById(request.getLabId())
                .orElseThrow(() -> new NotFoundException("Lab not found"));

        User user = getCurrentUser();

        // Отримати обладнання
        List<Equipment> equipment = equipmentRepository.findAllById(request.getEquipmentIds());

        // Отримати лабораторну роботу (якщо вказано)
        LabWork labWork = null;
        if (request.getLabWorkId() != null) {
            labWork = labWorkRepository.findById(request.getLabWorkId())
                    .orElseThrow(() -> new NotFoundException("LabWork not found"));
        }

        Reservation reservation = Reservation.builder()
                .lab(lab)
                .user(user)
                .labWork(labWork)
                .equipment(equipment)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(ReservationStatus.PENDING)
                .build();

        // Використання Strategy Pattern для валідації
        reservationValidator.validateAll(reservation);

        reservationRepository.save(reservation);

        // Використання Observer Pattern для сповіщення
        eventPublisher.publishEvent(new ReservationEvent(
                reservation,
                ReservationEvent.ReservationEventType.CREATED,
                user.getUsername()
        ));

        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse approve(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only PENDING reservations can be approved");
        }

        User admin = getCurrentUser();
        reservation.setStatus(ReservationStatus.APPROVED);
        reservation.setApprovedBy(admin);
        reservation.setApprovedAt(LocalDateTime.now());

        reservationRepository.save(reservation);

        // Публікація події
        eventPublisher.publishEvent(new ReservationEvent(
                reservation,
                ReservationEvent.ReservationEventType.APPROVED,
                reservation.getUser().getUsername()
        ));

        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse reject(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only PENDING reservations can be rejected");
        }

        User admin = getCurrentUser();
        reservation.setStatus(ReservationStatus.REJECTED);
        reservation.setApprovedBy(admin);
        reservation.setApprovedAt(LocalDateTime.now());

        reservationRepository.save(reservation);

        return toResponse(reservation);
    }

    @Override
    @Transactional
    public ReservationResponse updateStatus(Long id, ReservationStatusUpdateRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservation not found"));

        ReservationStatus oldStatus = reservation.getStatus();
        reservation.setStatus(request.getStatus());
        reservationRepository.save(reservation);

        // Публікація події в залежності від зміни статусу
        ReservationEvent.ReservationEventType eventType = determineEventType(oldStatus, request.getStatus());
        if (eventType != null) {
            eventPublisher.publishEvent(new ReservationEvent(
                    reservation,
                    eventType,
                    reservation.getUser().getUsername()
            ));
        }

        return toResponse(reservation);
    }

    private ReservationEvent.ReservationEventType determineEventType(ReservationStatus oldStatus, ReservationStatus newStatus) {
        if (newStatus == ReservationStatus.APPROVED && oldStatus != ReservationStatus.APPROVED) {
            return ReservationEvent.ReservationEventType.APPROVED;
        } else if (newStatus == ReservationStatus.CANCELLED) {
            return ReservationEvent.ReservationEventType.CANCELLED;
        }
        return ReservationEvent.ReservationEventType.UPDATED;
    }

    @Override
    public List<ReservationResponse> myReservations() {
        User user = getCurrentUser();
        return reservationRepository.findByUser(user).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> allReservations() {
        return reservationRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReservationResponse> getPendingReservations() {
        return reservationRepository.findByStatus(ReservationStatus.PENDING).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new NotFoundException("Reservation not found");
        }
        reservationRepository.deleteById(id);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }

    private ReservationResponse toResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .labId(reservation.getLab().getId())
                .labName(reservation.getLab().getName())
                .userId(reservation.getUser().getId())
                .username(reservation.getUser().getUsername())
                .labWorkId(reservation.getLabWork() != null ? reservation.getLabWork().getId() : null)
                .labWorkTitle(reservation.getLabWork() != null ? reservation.getLabWork().getTitle() : null)
                .equipment(reservation.getEquipment().stream()
                        .map(EquipmentMapper::toResponse)
                        .collect(Collectors.toList()))
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .status(reservation.getStatus())
                .purpose(reservation.getPurpose())
                .approvedBy(reservation.getApprovedBy() != null ? reservation.getApprovedBy().getUsername() : null)
                .approvedAt(reservation.getApprovedAt())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}
