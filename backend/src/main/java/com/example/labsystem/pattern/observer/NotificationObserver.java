package com.example.labsystem.pattern.observer;

import com.example.labsystem.pattern.factory.NotificationFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Спостерігач який відправляє повідомлення при подіях резервацій.
 * Демонструє інтеграцію Observer та Factory патернів.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationObserver implements ReservationObserver {

    private final NotificationFactory notificationFactory;

    @Override
    public void onReservationEvent(ReservationEvent event) {
        String message = buildMessage(event);
        try {
            // Використовуємо Factory для отримання потрібного типу повідомлення
            notificationFactory.getNotification("EMAIL")
                    .send(event.getUsername(), message);
        } catch (Exception e) {
            log.error("Failed to send notification for reservation event", e);
        }
    }

    private String buildMessage(ReservationEvent event) {
        return switch (event.getEventType()) {
            case CREATED -> "Your reservation has been created successfully";
            case UPDATED -> "Your reservation has been updated";
            case CANCELLED -> "Your reservation has been cancelled";
            case APPROVED -> "Your reservation has been approved";
        };
    }
}
