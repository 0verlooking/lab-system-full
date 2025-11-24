package com.example.labsystem.pattern.strategy;

import com.example.labsystem.domain.reservation.Reservation;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Стратегія валідації часового слоту резервації.
 * Перевіряє, що резервація не в минулому і endTime після startTime.
 */
@Component
public class TimeSlotValidationStrategy implements ReservationValidationStrategy {

    @Override
    public boolean validate(Reservation reservation) {
        LocalDateTime now = LocalDateTime.now();
        return reservation.getStartTime().isAfter(now)
                && reservation.getEndTime().isAfter(reservation.getStartTime());
    }

    @Override
    public String getValidationMessage() {
        return "Reservation time slot must be in the future and end time must be after start time";
    }
}
