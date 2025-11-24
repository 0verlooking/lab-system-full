package com.example.labsystem.pattern.observer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Publisher для подій резервацій.
 * Демонструє патерн Observer (Subject).
 *
 * Переваги:
 * - Слабка зв'язаність між компонентами (Loose Coupling)
 * - Легко додавати нових спостерігачів без зміни Publisher'а (Open/Closed Principle)
 */
@Component
@RequiredArgsConstructor
public class ReservationEventPublisher {

    private final List<ReservationObserver> observers;

    public void publishEvent(ReservationEvent event) {
        observers.forEach(observer -> {
            try {
                observer.onReservationEvent(event);
            } catch (Exception e) {
                // Продовжуємо публікацію навіть якщо один observer зазнав невдачі
            }
        });
    }
}
