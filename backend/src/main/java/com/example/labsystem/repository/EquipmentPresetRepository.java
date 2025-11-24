package com.example.labsystem.repository;

import com.example.labsystem.domain.preset.EquipmentPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentPresetRepository extends JpaRepository<EquipmentPreset, Long> {
    List<EquipmentPreset> findByIsGlobalTrue();
    List<EquipmentPreset> findByAuthorId(Long authorId);
    List<EquipmentPreset> findByIsGlobalTrueOrAuthorId(Long authorId);
}
