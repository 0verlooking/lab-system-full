package com.example.labsystem.pattern.strategy;

import com.example.labsystem.domain.reservation.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Context клас для використання стратегій валідації.
 * Демонструє патерн Strategy та композицію стратегій.
 *
 * Переваги:
 * - Легко додавати нові правила валідації без зміни існуючого коду
 * - Кожна стратегія має одну відповідальність (Single Responsibility Principle)
 * - Можна комбінувати різні стратегії
 */
@Component
@RequiredArgsConstructor
public class ReservationValidator {

    private final List<ReservationValidationStrategy> strategies;

    public void validateAll(Reservation reservation) {
        for (ReservationValidationStrategy strategy : strategies) {
            if (!strategy.validate(reservation)) {
                throw new IllegalArgumentException(strategy.getValidationMessage());
            }
        }
    }

    public boolean isValid(Reservation reservation) {
        return strategies.stream()
                .allMatch(strategy -> strategy.validate(reservation));
    }
}
