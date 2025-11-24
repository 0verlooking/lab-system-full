package com.example.labsystem.service;

import com.example.labsystem.domain.group.Group;
import com.example.labsystem.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupService {
    private final GroupRepository groupRepository;

    public List<Group> getAllActive() {
        return groupRepository.findByActiveTrue();
    }

    public Group getById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found: " + id));
    }

    @Transactional
    public Group create(Group group) {
        return groupRepository.save(group);
    }

    @Transactional
    public Group update(Long id, Group groupData) {
        Group group = getById(id);
        group.setName(groupData.getName());
        group.setDescription(groupData.getDescription());
        group.setDefaultCurator(groupData.getDefaultCurator());
        group.setEnrollmentYear(groupData.getEnrollmentYear());
        return groupRepository.save(group);
    }

    @Transactional
    public void delete(Long id) {
        Group group = getById(id);
        group.setActive(false);
        groupRepository.save(group);
    }
}
