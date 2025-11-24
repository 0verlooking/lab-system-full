package com.example.labsystem.controller;

import com.example.labsystem.dto.request.LabCreateRequest;
import com.example.labsystem.dto.request.LabUpdateRequest;
import com.example.labsystem.dto.response.LabResponse;
import com.example.labsystem.service.LabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/labs")
public class LabController {

    private final LabService labService;

    @GetMapping
    public List<LabResponse> getAll() {
        return labService.getAll();
    }

    @PostMapping
    public LabResponse create(@RequestBody LabCreateRequest request) {
        return labService.create(request);
    }

    @PutMapping("/{id}")
    public LabResponse update(
            @PathVariable Long id,
            @RequestBody LabUpdateRequest request) {
        return labService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        labService.delete(id);
        return ResponseEntity.ok().build();
    }
}
