package com.example.labsystem.pattern.factory;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Factory для створення різних типів повідомлень.
 * Демонструє патерн Factory Method.
 *
 * Переваги:
 * - Відокремлює логіку створення об'єктів від їх використання
 * - Легко додавати нові типи повідомлень без зміни існуючого коду (Open/Closed Principle)
 */
@Component
public class NotificationFactory {

    private final Map<String, Notification> notificationMap;

    public NotificationFactory(List<Notification> notifications) {
        this.notificationMap = notifications.stream()
                .collect(Collectors.toMap(Notification::getType, Function.identity()));
    }

    public Notification getNotification(String type) {
        Notification notification = notificationMap.get(type.toUpperCase());
        if (notification == null) {
            throw new IllegalArgumentException("Unknown notification type: " + type);
        }
        return notification;
    }
}
