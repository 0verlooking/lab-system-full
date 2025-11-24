package com.example.labsystem.domain.document;

/**
 * Тип електронного підпису
 */
public enum SignatureType {
    /**
     * Підпис "пальцем" (canvas)
     */
    DRAWN,

    /**
     * Електронний цифровий підпис (ЕЦП)
     */
    EDS,

    /**
     * Дія (підпис через Дія.Підпис)
     */
    DIIA,

    /**
     * SMS підтвердження
     */
    SMS,

    /**
     * Інше
     */
    OTHER
}
