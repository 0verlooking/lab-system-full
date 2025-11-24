package com.example.labsystem.controller;

import com.example.labsystem.domain.order.EquipmentOrder;
import com.example.labsystem.service.EquipmentOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final EquipmentOrderService orderService;

    @GetMapping("/my")
    public ResponseEntity<List<EquipmentOrder>> getMyOrders(Authentication auth) {
        // Get user ID from auth - simplified for now
        return ResponseEntity.ok(orderService.getByStudentId(1L));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'LABORANT')")
    public ResponseEntity<List<EquipmentOrder>> getPending() {
        return ResponseEntity.ok(orderService.getPending());
    }

    @PostMapping
    public ResponseEntity<EquipmentOrder> create(@RequestBody EquipmentOrder order) {
        return ResponseEntity.ok(orderService.create(order));
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<EquipmentOrder> reserve(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.reserve(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'LABORANT')")
    public ResponseEntity<EquipmentOrder> approve(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(orderService.approve(id, auth.getName()));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'LABORANT')")
    public ResponseEntity<EquipmentOrder> reject(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.reject(id));
    }
}
