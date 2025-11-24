package com.example.labsystem.repository;

import com.example.labsystem.domain.lab.Lab;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabRepository extends JpaRepository<Lab, Long> {
}
