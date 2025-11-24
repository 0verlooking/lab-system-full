package com.example.labsystem.pattern.observer;

/**
 * Інтерфейс для спостерігачів за подіями резервацій.
 * Демонструє патерн Observer.
 */
public interface ReservationObserver {
    void onReservationEvent(ReservationEvent event);
}
