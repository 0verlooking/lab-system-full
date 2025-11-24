package com.example.labsystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LabResponse {
    private Long id;
    private String name;
    private String location;
    private Integer capacity;
    private String description;
}
