package com.example.labsystem.domain.document;

import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.order.EquipmentOrder;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Document - Документ у системі (згода на видачу, акт приймання-передачі тощо)
 */
@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Унікальний номер документа (індексація: ххххххх-хххх-ххх)
     * Формат: {projectId}-{serviceType}-{sequence}
     * Приклад: 0000123-RENT-001
     */
    @Column(nullable = false, unique = true)
    private String documentNumber;

    /**
     * Тип документа
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    /**
     * Замовлення до якого відноситься документ
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private EquipmentOrder order;

    /**
     * Лабораторна робота до якої відноситься документ
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labwork_id")
    private LabWork labWork;

    /**
     * Студент
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /**
     * ПІБ студента (копія для збереження)
     */
    @Column(name = "student_full_name")
    private String studentFullName;

    /**
     * Паспортні дані студента
     */
    @Column(name = "passport_data", length = 500)
    private String passportData;

    /**
     * Контактний телефон
     */
    @Column(name = "contact_phone")
    private String contactPhone;

    /**
     * Електронний підпис студента (Base64)
     */
    @Column(name = "student_signature", length = 10000)
    private String studentSignature;

    /**
     * Тип підпису
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "signature_type")
    private SignatureType signatureType;

    /**
     * Фото при видачі (URL)
     */
    @Column(name = "issue_photo_url")
    private String issuePhotoUrl;

    /**
     * Дата видачі обладнання
     */
    @Column(name = "issue_date")
    private LocalDateTime issueDate;

    /**
     * Дата повернення обладнання
     */
    @Column(name = "return_date")
    private LocalDateTime returnDate;

    /**
     * Лаборант/Адміністратор який видав
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by_id")
    private User issuedBy;

    /**
     * Примітки
     */
    @Column(length = 2000)
    private String notes;

    /**
     * Статус документа
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    /**
     * Контент документа у форматі JSON (шаблон + дані)
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (documentNumber == null) {
            documentNumber = generateDocumentNumber();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Генерація номера документа
     */
    private String generateDocumentNumber() {
        String projectPart = labWork != null ? String.format("%07d", labWork.getId()) : "0000000";
        String typePart = type != null ? type.getCode() : "UNKN";
        String sequence = String.format("%03d", System.currentTimeMillis() % 1000);
        return String.format("%s-%s-%s", projectPart, typePart, sequence);
    }

    /**
     * Підписати документ
     */
    public void sign(String signature, SignatureType signatureType) {
        this.studentSignature = signature;
        this.signatureType = signatureType;
        this.status = DocumentStatus.SIGNED;
    }
}
