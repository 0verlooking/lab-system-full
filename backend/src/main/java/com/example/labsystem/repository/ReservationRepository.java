package com.example.labsystem.repository;

import com.example.labsystem.domain.reservation.Reservation;
import com.example.labsystem.domain.reservation.ReservationStatus;
import com.example.labsystem.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser(User user);

    List<Reservation> findByStatus(ReservationStatus status);
}
