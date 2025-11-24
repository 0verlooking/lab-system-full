package com.example.labsystem.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO для створення лабораторної роботи (аналог Project з microlab_v2).
 */
@Data
public class LabWorkCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    /**
     * ID обладнання необхідного для роботи (аналог components з microlab_v2).
     */
    private List<Long> equipmentIds = new ArrayList<>();
}
