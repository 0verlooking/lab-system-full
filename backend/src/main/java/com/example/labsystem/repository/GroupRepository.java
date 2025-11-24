package com.example.labsystem.repository;

import com.example.labsystem.domain.group.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);
    List<Group> findByActiveTrue();
    List<Group> findByDefaultCuratorId(Long curatorId);
}
