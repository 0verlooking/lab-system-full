package com.example.labsystem.dto.request;

import com.example.labsystem.domain.labwork.LabWorkStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class LabWorkUpdateRequest {

    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private List<Long> equipmentIds;

    private LabWorkStatus status;
}
