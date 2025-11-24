package com.example.labsystem.domain.news;

/**
 * Тип новини
 */
public enum NewsType {
    /**
     * Нове обладнання додано до лабораторії
     */
    NEW_EQUIPMENT("Нове обладнання"),

    /**
     * Новий опублікований проект
     */
    NEW_PROJECT("Новий проект"),

    /**
     * Оголошення
     */
    ANNOUNCEMENT("Оголошення"),

    /**
     * Системне повідомлення
     */
    SYSTEM("Системне повідомлення"),

    /**
     * Оновлення
     */
    UPDATE("Оновлення"),

    /**
     * Подія
     */
    EVENT("Подія"),

    /**
     * Інше
     */
    OTHER("Інше");

    private final String displayName;

    NewsType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
