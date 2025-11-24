package com.example.labsystem.repository;

import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.labwork.LabWorkStatus;
import com.example.labsystem.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabWorkRepository extends JpaRepository<LabWork, Long> {

    List<LabWork> findByAuthor(User author);

    List<LabWork> findByStatus(LabWorkStatus status);

    List<LabWork> findByStatusOrderByCreatedAtDesc(LabWorkStatus status);

    List<LabWork> findAllByOrderByCreatedAtDesc();
}
