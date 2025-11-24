package com.example.labsystem.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO для створення резервації (аналог створення Order з microlab_v2).
 */
@Data
public class ReservationCreateRequest {

    @NotNull(message = "Lab ID is required")
    private Long labId;

    /**
     * ID лабораторної роботи (опціонально).
     */
    private Long labWorkId;

    /**
     * ID обладнання яке потрібно зарезервувати (аналог components у Project з microlab_v2).
     */
    private List<Long> equipmentIds = new ArrayList<>();

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    private String purpose;
}
