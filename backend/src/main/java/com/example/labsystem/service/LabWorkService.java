package com.example.labsystem.service;

import com.example.labsystem.dto.request.LabWorkCreateRequest;
import com.example.labsystem.dto.request.LabWorkUpdateRequest;
import com.example.labsystem.dto.response.LabWorkResponse;

import java.util.List;

/**
 * Сервіс для роботи з лабораторними роботами (аналог ProjectsService з microlab_v2).
 */
public interface LabWorkService {

    /**
     * Створити нову лабораторну роботу (аналог addProjectToAPI).
     */
    LabWorkResponse create(LabWorkCreateRequest request);

    /**
     * Отримати всі лабораторні роботи (аналог fetchProjects).
     */
    List<LabWorkResponse> getAllLabWorks();

    /**
     * Отримати лабораторну роботу за ID.
     */
    LabWorkResponse getById(Long id);

    /**
     * Отримати всі опубліковані лабораторні роботи.
     */
    List<LabWorkResponse> getPublished();

    /**
     * Отримати мої лабораторні роботи (створені поточним користувачем).
     */
    List<LabWorkResponse> getMyLabWorks();

    /**
     * Оновити лабораторну роботу.
     */
    LabWorkResponse update(Long id, LabWorkUpdateRequest request);

    /**
     * Видалити лабораторну роботу.
     */
    void delete(Long id);
}
