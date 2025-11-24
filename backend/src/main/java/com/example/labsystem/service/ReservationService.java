package com.example.labsystem.service;

import com.example.labsystem.dto.request.ReservationCreateRequest;
import com.example.labsystem.dto.request.ReservationStatusUpdateRequest;
import com.example.labsystem.dto.response.ReservationResponse;

import java.util.List;

/**
 * Сервіс для роботи з резервац іями (аналог OrdersService з microlab_v2).
 */
public interface ReservationService {

    ReservationResponse create(ReservationCreateRequest request);

    /**
     * Схвалити резервацію (аналог approveOrder з microlab_v2).
     * Тільки адміністратор може схвалювати резервації.
     */
    ReservationResponse approve(Long id);

    /**
     * Відхилити резервацію.
     * Тільки адміністратор може відхиляти резервації.
     */
    ReservationResponse reject(Long id);

    ReservationResponse updateStatus(Long id, ReservationStatusUpdateRequest request);

    List<ReservationResponse> myReservations();

    List<ReservationResponse> allReservations();

    /**
     * Отримати всі резервації що очікують схвалення.
     */
    List<ReservationResponse> getPendingReservations();

    void delete(Long id);
}
