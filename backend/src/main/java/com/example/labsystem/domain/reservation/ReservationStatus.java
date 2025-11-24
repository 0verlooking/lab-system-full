package com.example.labsystem.domain.reservation;

public enum ReservationStatus {
    PENDING,   // запит створений, очікує рішення
    APPROVED,  // підтверджено
    REJECTED,  // відхилено
    CANCELLED  // скасовано користувачем/адміном
}
