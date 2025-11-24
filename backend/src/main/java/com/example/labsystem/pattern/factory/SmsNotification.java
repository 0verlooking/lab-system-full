package com.example.labsystem.pattern.factory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Конкретна реалізація SMS повідомлень.
 */
@Slf4j
@Component
public class SmsNotification implements Notification {

    @Override
    public void send(String recipient, String message) {
        log.info("Sending SMS to {}: {}", recipient, message);
        // Тут була б реальна логіка відправки SMS
    }

    @Override
    public String getType() {
        return "SMS";
    }
}
