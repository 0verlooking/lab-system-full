package com.example.labsystem.domain.lab;

/**
 * Статус доступності обладнання (аналог availability з microlab_v2).
 */
public enum EquipmentStatus {
    AVAILABLE,   // Доступне для використання
    IN_USE,      // Використовується
    MAINTENANCE, // На обслуговуванні
    BROKEN       // Зламане
}
