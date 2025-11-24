package com.example.labsystem.domain.document;

/**
 * Статус документа
 */
public enum DocumentStatus {
    /**
     * Чернетка - документ створюється
     */
    DRAFT,

    /**
     * Очікує підпису студента
     */
    AWAITING_SIGNATURE,

    /**
     * Підписаний студентом
     */
    SIGNED,

    /**
     * Підтверджено лаборантом/адміністратором
     */
    CONFIRMED,

    /**
     * Виконано (обладнання видано)
     */
    EXECUTED,

    /**
     * Закрито (обладнання повернуто)
     */
    CLOSED,

    /**
     * Скасовано
     */
    CANCELLED
}
