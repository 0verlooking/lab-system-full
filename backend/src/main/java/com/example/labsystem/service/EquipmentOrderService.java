package com.example.labsystem.service;

import com.example.labsystem.domain.order.EquipmentOrder;
import com.example.labsystem.domain.order.OrderStatus;
import com.example.labsystem.repository.EquipmentOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentOrderService {
    private final EquipmentOrderRepository orderRepository;

    public List<EquipmentOrder> getByStudentId(Long studentId) {
        return orderRepository.findByStudentId(studentId);
    }

    public List<EquipmentOrder> getPending() {
        return orderRepository.findByStatus(OrderStatus.PENDING);
    }

    @Transactional
    public EquipmentOrder create(EquipmentOrder order) {
        order.setStatus(OrderStatus.DRAFT);
        return orderRepository.save(order);
    }

    @Transactional
    public EquipmentOrder reserve(Long id) {
        EquipmentOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setReservation();
        return orderRepository.save(order);
    }

    @Transactional
    public EquipmentOrder approve(Long id, String approvedBy) {
        EquipmentOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(OrderStatus.APPROVED);
        order.setApprovedBy(approvedBy);
        order.setApprovedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Transactional
    public EquipmentOrder reject(Long id) {
        EquipmentOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(OrderStatus.REJECTED);
        return orderRepository.save(order);
    }
}
