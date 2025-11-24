package com.example.labsystem.repository;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByLabId(Long labId);

    List<Equipment> findByStatus(EquipmentStatus status);
}
