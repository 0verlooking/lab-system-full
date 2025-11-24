package com.example.labsystem.domain.order;

import com.example.labsystem.domain.lab.Equipment;
import jakarta.persistence.*;
import lombok.*;

/**
 * OrderItem - Елемент замовлення (позиція в кошику)
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Замовлення до якого належить цей елемент
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private EquipmentOrder order;

    /**
     * Обладнання
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    /**
     * Кількість одиниць
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    /**
     * Чи доступне обладнання в лабораторії
     */
    @Column(name = "available_in_lab")
    @Builder.Default
    private Boolean availableInLab = true;

    /**
     * Посилання на онлайн магазин (якщо немає в лабораторії)
     */
    @Column(name = "purchase_link", length = 500)
    private String purchaseLink;

    /**
     * Орієнтовна ціна
     */
    private Double price;

    /**
     * Примітка студента
     */
    @Column(length = 500)
    private String note;

    /**
     * Статус позиції
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderItemStatus status = OrderItemStatus.PENDING;
}
