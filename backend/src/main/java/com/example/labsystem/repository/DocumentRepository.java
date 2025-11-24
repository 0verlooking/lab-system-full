package com.example.labsystem.repository;

import com.example.labsystem.domain.document.Document;
import com.example.labsystem.domain.document.DocumentStatus;
import com.example.labsystem.domain.document.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByLabWorkId(Long labWorkId);
    List<Document> findByStudentId(Long studentId);
    List<Document> findByStatus(DocumentStatus status);
    List<Document> findByType(DocumentType type);
    Optional<Document> findByDocumentNumber(String documentNumber);
}
