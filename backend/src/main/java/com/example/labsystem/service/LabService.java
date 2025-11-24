package com.example.labsystem.service;

import com.example.labsystem.dto.request.LabCreateRequest;
import com.example.labsystem.dto.request.LabUpdateRequest;
import com.example.labsystem.dto.response.LabResponse;
import java.util.List;

public interface LabService {

    List<LabResponse> getAll();

    LabResponse create(LabCreateRequest request);

    LabResponse update(Long id, LabUpdateRequest request);

    void delete(Long id);
}
