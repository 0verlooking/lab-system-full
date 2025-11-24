package com.example.labsystem.repository;

import com.example.labsystem.domain.photo.LabWorkPhoto;
import com.example.labsystem.domain.photo.PhotoType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabWorkPhotoRepository extends JpaRepository<LabWorkPhoto, Long> {
    List<LabWorkPhoto> findByLabWorkIdOrderByDisplayOrderAsc(Long labWorkId);
    List<LabWorkPhoto> findByLabWorkIdAndType(Long labWorkId, PhotoType type);
    LabWorkPhoto findByLabWorkIdAndIsPrimaryTrue(Long labWorkId);
}
