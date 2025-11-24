package com.example.labsystem.dto.request;

import com.example.labsystem.domain.reservation.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationStatusUpdateRequest {

    @NotNull
    private Long reservationId;

    @NotNull
    private ReservationStatus status;
}
