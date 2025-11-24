package com.example.labsystem.pattern.strategy;

import com.example.labsystem.domain.reservation.Reservation;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Стратегія валідації тривалості резервації.
 * Перевіряє, що резервація не перевищує максимальну тривалість (наприклад, 4 години).
 */
@Component
public class DurationValidationStrategy implements ReservationValidationStrategy {

    private static final long MAX_DURATION_HOURS = 4;

    @Override
    public boolean validate(Reservation reservation) {
        Duration duration = Duration.between(
                reservation.getStartTime(),
                reservation.getEndTime()
        );
        return duration.toHours() <= MAX_DURATION_HOURS;
    }

    @Override
    public String getValidationMessage() {
        return "Reservation duration cannot exceed " + MAX_DURATION_HOURS + " hours";
    }
}
