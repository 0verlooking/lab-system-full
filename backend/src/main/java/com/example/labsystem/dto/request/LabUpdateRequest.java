package com.example.labsystem.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LabUpdateRequest {
    private String name;
    private String location;
    private Integer capacity;
    private String description;
}
