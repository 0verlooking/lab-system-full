package com.example.labsystem.domain.order;

import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * EquipmentOrder - Замовлення обладнання (кошик)
 * Студент формує замовлення, яке потім погоджує адміністратор/лаборант
 */
@Entity
@Table(name = "equipment_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Студент, що створив замовлення
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /**
     * Лабораторна робота для якої потрібне обладнання (опційно)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labwork_id")
    private LabWork labWork;

    /**
     * Елементи замовлення
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    /**
     * Статус замовлення
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.DRAFT;

    /**
     * Чекбокс "заберу якщо будуть всі доступні"
     */
    @Column(name = "accept_partial")
    @Builder.Default
    private Boolean acceptPartial = false;

    /**
     * Мета використання обладнання
     */
    @Column(length = 1000)
    private String purpose;

    /**
     * Хто погодив замовлення
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    /**
     * Коли погоджено
     */
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    /**
     * Час бронювання (24 години)
     */
    @Column(name = "reserved_until")
    private LocalDateTime reservedUntil;

    /**
     * Примітки лаборанта
     */
    @Column(name = "laborant_notes", length = 1000)
    private String laborantNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Встановити резервацію на 24 години
     */
    public void setReservation() {
        this.reservedUntil = LocalDateTime.now().plusHours(24);
        this.status = OrderStatus.RESERVED;
    }

    /**
     * Погодити замовлення
     */
    public void approve(User approver) {
        this.status = OrderStatus.APPROVED;
        this.approvedBy = approver;
        this.approvedAt = LocalDateTime.now();
    }
}
