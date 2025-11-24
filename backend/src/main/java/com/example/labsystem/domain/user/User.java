package com.example.labsystem.domain.user;

import com.example.labsystem.domain.group.Group;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    // ========== Обов'язкові поля профілю ==========

    /**
     * Ім'я (обов'язково)
     */
    @Column(name = "first_name")
    private String firstName;

    /**
     * Прізвище (обов'язково)
     */
    @Column(name = "last_name")
    private String lastName;

    /**
     * По-батькові
     */
    @Column(name = "middle_name")
    private String middleName;

    /**
     * Контактний номер (обов'язково)
     */
    @Column(name = "phone_number")
    private String phoneNumber;

    /**
     * Номер студентського квитка (обов'язково для студентів)
     */
    @Column(name = "student_id", unique = true)
    private String studentId;

    /**
     * Посилання на фото (обов'язково)
     */
    @Column(name = "photo_url")
    private String photoUrl;

    // ========== Група та куратор ==========

    /**
     * Група студента (обов'язково для студентів)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    /**
     * Куратор студента (може відрізнятись від дефолтного куратора групи)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curator_id")
    private User curator;

    // ========== 2FA (TOTP) ==========

    /**
     * Секретний ключ для TOTP (Google Authenticator)
     */
    @Column(name = "totp_secret")
    private String totpSecret;

    /**
     * Чи увімкнена 2FA
     */
    @Column(name = "two_factor_enabled")
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    // ========== Додаткова інформація ==========

    /**
     * Чи активний користувач (для блокування)
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Чи підтверджена пошта
     */
    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    /**
     * Токен для підтвердження пошти або скидання пароля
     */
    @Column(name = "verification_token")
    private String verificationToken;

    /**
     * Термін дії токену
     */
    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;

    // ========== Timestamps ==========

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ========== Helper methods ==========

    /**
     * Отримати повне ім'я (ПІБ)
     */
    public String getFullName() {
        StringBuilder fullName = new StringBuilder();
        if (lastName != null) fullName.append(lastName).append(" ");
        if (firstName != null) fullName.append(firstName).append(" ");
        if (middleName != null) fullName.append(middleName);
        return fullName.toString().trim();
    }

    /**
     * Перевірка чи є користувач адміністратором
     */
    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }

    /**
     * Перевірка чи є користувач куратором
     */
    public boolean isCurator() {
        return role == UserRole.CURATOR;
    }

    /**
     * Перевірка чи є користувач лаборантом
     */
    public boolean isLaborant() {
        return role == UserRole.LABORANT;
    }

    /**
     * Перевірка чи є користувач студентом
     */
    public boolean isStudent() {
        return role == UserRole.STUDENT;
    }
}
