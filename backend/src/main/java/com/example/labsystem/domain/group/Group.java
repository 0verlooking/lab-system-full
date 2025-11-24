package com.example.labsystem.domain.group;

import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Group entity - Навчальні групи
 */
@Entity
@Table(name = "groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    /**
     * Куратор групи за замовчуванням
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_curator_id")
    private User defaultCurator;

    /**
     * Студенти в групі
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    @Builder.Default
    private List<User> students = new ArrayList<>();

    /**
     * Рік вступу
     */
    @Column(name = "enrollment_year")
    private Integer enrollmentYear;

    /**
     * Активна чи ні (для архівації старих груп)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

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
