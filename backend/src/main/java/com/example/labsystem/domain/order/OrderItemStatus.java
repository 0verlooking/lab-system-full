package com.example.labsystem.domain.order;

/**
 * Статус позиції в замовленні
 */
public enum OrderItemStatus {
    /**
     * Очікує обробки
     */
    PENDING,

    /**
     * Доступне в лабораторії
     */
    AVAILABLE,

    /**
     * Немає в наявності
     */
    OUT_OF_STOCK,

    /**
     * Потребує закупівлі
     */
    REQUIRES_PURCHASE,

    /**
     * Замовлено
     */
    ORDERED,

    /**
     * Готово до видачі
     */
    READY
}
