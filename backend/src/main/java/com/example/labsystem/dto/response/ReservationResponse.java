package com.example.labsystem.dto.response;

import com.example.labsystem.domain.reservation.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {

    private Long id;
    private Long labId;
    private String labName;
    private Long userId;
    private String username;

    // Лабораторна робота (якщо є)
    private Long labWorkId;
    private String labWorkTitle;

    // Обладнання
    private List<EquipmentResponse> equipment;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ReservationStatus status;
    private String purpose;

    // Інформація про схвалення (approve з microlab_v2)
    private String approvedBy;
    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;
}
