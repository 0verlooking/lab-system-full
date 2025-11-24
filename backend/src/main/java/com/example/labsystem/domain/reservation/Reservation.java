package com.example.labsystem.domain.reservation;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Reservation entity (аналог Orders з microlab_v2).
 * Резервація обладнання для виконання лабораторної роботи.
 * Має статус PENDING який адміністратор може approve/reject.
 */
@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Лабораторна робота для якої робиться резервація (опціонально).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labwork_id")
    private LabWork labWork;

    /**
     * Лабораторія де буде проводитись робота.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_id")
    private Lab lab;

    /**
     * Користувач який створив резервацію.
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Список обладнання яке резервується (аналог components у Projects з microlab_v2).
     */
    @ManyToMany
    @JoinTable(
            name = "reservation_equipment",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "equipment_id")
    )
    @Builder.Default
    private List<Equipment> equipment = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    /**
     * Статус резервації (аналог approveOrder з microlab_v2).
     * PENDING -> можна approve або reject
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(length = 1000)
    private String purpose;

    /**
     * Адміністратор який схвалив/відхилив резервацію.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

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
}
