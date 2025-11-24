package com.example.labsystem.pattern.factory;

/**
 * Базовий інтерфейс для повідомлень.
 * Частина патерну Factory Method.
 */
public interface Notification {
    void send(String recipient, String message);
    String getType();
}
