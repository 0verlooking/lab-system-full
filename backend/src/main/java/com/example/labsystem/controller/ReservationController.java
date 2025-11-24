package com.example.labsystem.controller;

import com.example.labsystem.dto.request.ReservationCreateRequest;
import com.example.labsystem.dto.request.ReservationStatusUpdateRequest;
import com.example.labsystem.dto.response.ReservationResponse;
import com.example.labsystem.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контролер для роботи з резервац іями (аналог OrdersController з microlab_v2).
 */
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@Valid @RequestBody ReservationCreateRequest request) {
        ReservationResponse response = reservationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Схвалити резервацію (аналог approveOrder з microlab_v2).
     * Тільки ADMIN може схвалювати.
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> approve(@PathVariable Long id) {
        ReservationResponse response = reservationService.approve(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Відхилити резервацію.
     * Тільки ADMIN може відхиляти.
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> reject(@PathVariable Long id) {
        ReservationResponse response = reservationService.reject(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(reservationService.updateStatus(id, request));
    }

    /**
     * Резервації поточного користувача (витягується з JWT).
     */
    @GetMapping("/me")
    public ResponseEntity<List<ReservationResponse>> myReservations() {
        return ResponseEntity.ok(reservationService.myReservations());
    }

    /**
     * Усі резервації (для ролі ADMIN).
     */
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.allReservations());
    }

    /**
     * Резервації що очікують на схвалення (аналог fetchOrders з microlab_v2 з фільтром PENDING).
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getPending() {
        return ResponseEntity.ok(reservationService.getPendingReservations());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
