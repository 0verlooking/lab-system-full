package com.example.labsystem.pattern.observer;

import com.example.labsystem.domain.reservation.Reservation;
import lombok.Getter;

/**
 * Подія резервації.
 * Частина патерну Observer.
 */
@Getter
public class ReservationEvent {
    private final Reservation reservation;
    private final ReservationEventType eventType;
    private final String username;

    public ReservationEvent(Reservation reservation, ReservationEventType eventType, String username) {
        this.reservation = reservation;
        this.eventType = eventType;
        this.username = username;
    }

    public enum ReservationEventType {
        CREATED,
        UPDATED,
        CANCELLED,
        APPROVED
    }
}
