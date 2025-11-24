package com.example.labsystem.controller;

import com.example.labsystem.dto.request.LabWorkCreateRequest;
import com.example.labsystem.dto.request.LabWorkUpdateRequest;
import com.example.labsystem.dto.response.LabWorkResponse;
import com.example.labsystem.service.LabWorkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Контролер для роботи з лабораторними роботами (аналог ProjectsController з microlab_v2).
 */
@RestController
@RequestMapping("/api/labworks")
@RequiredArgsConstructor
public class LabWorkController {

    private final LabWorkService labWorkService;

    /**
     * Створити нову лабораторну роботу (аналог addProjectToAPI).
     */
    @PostMapping
    public ResponseEntity<LabWorkResponse> create(@Valid @RequestBody LabWorkCreateRequest request) {
        LabWorkResponse response = labWorkService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Отримати всі лабораторні роботи (аналог fetchProjects).
     */
    @GetMapping
    public ResponseEntity<List<LabWorkResponse>> getAll() {
        List<LabWorkResponse> labWorks = labWorkService.getAllLabWorks();
        return ResponseEntity.ok(labWorks);
    }

    /**
     * Отримати лабораторну роботу за ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LabWorkResponse> getById(@PathVariable Long id) {
        LabWorkResponse labWork = labWorkService.getById(id);
        return ResponseEntity.ok(labWork);
    }

    /**
     * Отримати всі опубліковані лабораторні роботи.
     */
    @GetMapping("/published")
    public ResponseEntity<List<LabWorkResponse>> getPublished() {
        List<LabWorkResponse> labWorks = labWorkService.getPublished();
        return ResponseEntity.ok(labWorks);
    }

    /**
     * Отримати мої лабораторні роботи.
     */
    @GetMapping("/my")
    public ResponseEntity<List<LabWorkResponse>> getMyLabWorks() {
        List<LabWorkResponse> labWorks = labWorkService.getMyLabWorks();
        return ResponseEntity.ok(labWorks);
    }

    /**
     * Оновити лабораторну роботу.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LabWorkResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LabWorkUpdateRequest request) {
        LabWorkResponse response = labWorkService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Видалити лабораторну роботу.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        labWorkService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
