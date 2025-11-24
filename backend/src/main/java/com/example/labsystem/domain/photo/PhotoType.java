package com.example.labsystem.domain.photo;

/**
 * Тип фотографії проекту
 */
public enum PhotoType {
    /**
     * Схема проекту (електрична схема, діаграма)
     */
    SCHEMA,

    /**
     * Фото результату (готовий проект)
     */
    RESULT,

    /**
     * Діаграма алгоритму роботи
     */
    ALGORITHM,

    /**
     * Процес збірки/роботи
     */
    PROCESS,

    /**
     * Інше
     */
    OTHER
}
