package com.example.labsystem.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LabRequest {

    @NotBlank
    private String name;

    private String description;

    @Min(1)
    private Integer capacity;
}
