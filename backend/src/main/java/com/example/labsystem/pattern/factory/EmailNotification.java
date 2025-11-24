package com.example.labsystem.pattern.factory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Конкретна реалізація Email повідомлень.
 */
@Slf4j
@Component
public class EmailNotification implements Notification {

    @Override
    public void send(String recipient, String message) {
        log.info("Sending EMAIL to {}: {}", recipient, message);
        // Тут була б реальна логіка відправки email
    }

    @Override
    public String getType() {
        return "EMAIL";
    }
}
