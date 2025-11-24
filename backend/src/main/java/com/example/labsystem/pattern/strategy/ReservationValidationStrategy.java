package com.example.labsystem.pattern.strategy;

import com.example.labsystem.domain.reservation.Reservation;

/**
 * Базовий інтерфейс для стратегій валідації резервацій.
 * Демонструє патерн Strategy.
 */
public interface ReservationValidationStrategy {
    boolean validate(Reservation reservation);
    String getValidationMessage();
}
