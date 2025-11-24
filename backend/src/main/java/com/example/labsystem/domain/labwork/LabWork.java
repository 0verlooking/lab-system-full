package com.example.labsystem.domain.labwork;

import com.example.labsystem.domain.comment.Comment;
import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.photo.LabWorkPhoto;
import com.example.labsystem.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity для лабораторних робіт (аналог Projects з microlab_v2).
 * Лабораторна робота містить опис, необхідне обладнання та автора.
 */
@Entity
@Table(name = "lab_works")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    /**
     * Куратор лабораторної роботи (викладач)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curator_id")
    private User curator;

    /**
     * Чи є проект публічним (доступний всім) чи приватним (тільки автору)
     */
    @Column(name = "is_public", nullable = false)
    @Builder.Default
    private Boolean isPublic = false;

    /**
     * Батьківський проект (якщо це копія іншого проекту)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_project_id")
    private LabWork parentProject;

    /**
     * Копії цього проекту
     */
    @OneToMany(mappedBy = "parentProject", cascade = CascadeType.ALL)
    @Builder.Default
    private List<LabWork> childProjects = new ArrayList<>();

    /**
     * Коментарі до проекту
     */
    @OneToMany(mappedBy = "labWork", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    /**
     * Фотографії до проекту
     */
    @OneToMany(mappedBy = "labWork", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LabWorkPhoto> photos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "labwork_equipment",
            joinColumns = @JoinColumn(name = "labwork_id"),
            inverseJoinColumns = @JoinColumn(name = "equipment_id")
    )
    @Builder.Default
    private List<Equipment> requiredEquipment = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LabWorkStatus status = LabWorkStatus.DRAFT;

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
     * Перевірка чи проект є копією
     */
    public boolean isCopy() {
        return parentProject != null;
    }

    /**
     * Додати коментар
     */
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setLabWork(this);
    }

    /**
     * Додати фото
     */
    public void addPhoto(LabWorkPhoto photo) {
        photos.add(photo);
        photo.setLabWork(this);
    }

    /**
     * Створити копію проекту
     */
    public LabWork createCopy(User newAuthor) {
        LabWork copy = LabWork.builder()
                .title(this.title + " (копія)")
                .description(this.description)
                .author(newAuthor)
                .curator(this.curator)
                .isPublic(false)
                .parentProject(this)
                .requiredEquipment(new ArrayList<>(this.requiredEquipment))
                .status(LabWorkStatus.DRAFT)
                .build();
        this.childProjects.add(copy);
        return copy;
    }
}
