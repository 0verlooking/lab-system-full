package com.example.labsystem.repository;

import com.example.labsystem.domain.order.EquipmentOrder;
import com.example.labsystem.domain.order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EquipmentOrderRepository extends JpaRepository<EquipmentOrder, Long> {
    List<EquipmentOrder> findByStudentId(Long studentId);
    List<EquipmentOrder> findByStatus(OrderStatus status);
    List<EquipmentOrder> findByLabWorkId(Long labWorkId);
    List<EquipmentOrder> findByStatusAndReservedUntilBefore(OrderStatus status, LocalDateTime dateTime);
}
