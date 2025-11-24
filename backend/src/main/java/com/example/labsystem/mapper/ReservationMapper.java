package com.example.labsystem.mapper;

import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.domain.reservation.Reservation;
import com.example.labsystem.domain.reservation.ReservationStatus;
import com.example.labsystem.domain.user.User;
import com.example.labsystem.dto.request.ReservationCreateRequest;
import com.example.labsystem.dto.response.ReservationResponse;

public class ReservationMapper {

    private ReservationMapper() {
    }

    public static Reservation toEntity(
            ReservationCreateRequest request,
            Lab lab,
            User user
    ) {
        return Reservation.builder()
                .lab(lab)
                .user(user)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(ReservationStatus.PENDING)
                .build();
    }

    public static ReservationResponse toResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .labId(reservation.getLab().getId())
                .labName(reservation.getLab().getName())
                .userId(reservation.getUser().getId())
                .username(reservation.getUser().getUsername())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())
                .purpose(reservation.getPurpose())
                .status(reservation.getStatus())
                .build();
    }
}
