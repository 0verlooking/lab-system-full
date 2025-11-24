package com.example.labsystem.mapper;

import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.dto.request.LabCreateRequest;
import com.example.labsystem.dto.request.LabUpdateRequest;
import com.example.labsystem.dto.response.LabResponse;
import org.springframework.stereotype.Component;

@Component
public class LabMapper {

    public Lab toEntity(LabCreateRequest req) {
        Lab lab = new Lab();
        lab.setName(req.getName());
        lab.setLocation(req.getLocation());
        lab.setCapacity(req.getCapacity());
        lab.setDescription(req.getDescription());
        return lab;
    }

    public void updateEntity(Lab lab, LabUpdateRequest req) {
        lab.setName(req.getName());
        lab.setLocation(req.getLocation());
        lab.setCapacity(req.getCapacity());
        lab.setDescription(req.getDescription());
    }

    public LabResponse toResponse(Lab lab) {
        return new LabResponse(
                lab.getId(),
                lab.getName(),
                lab.getLocation(),
                lab.getCapacity(),
                lab.getDescription()
        );
    }
}
