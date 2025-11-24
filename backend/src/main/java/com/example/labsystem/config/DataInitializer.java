package com.example.labsystem.config;

import com.example.labsystem.domain.lab.Equipment;
import com.example.labsystem.domain.lab.EquipmentStatus;
import com.example.labsystem.domain.lab.Lab;
import com.example.labsystem.domain.labwork.LabWork;
import com.example.labsystem.domain.labwork.LabWorkStatus;
import com.example.labsystem.domain.reservation.Reservation;
import com.example.labsystem.domain.reservation.ReservationStatus;
import com.example.labsystem.domain.user.User;
import com.example.labsystem.domain.user.UserRole;
import com.example.labsystem.repository.EquipmentRepository;
import com.example.labsystem.repository.LabRepository;
import com.example.labsystem.repository.LabWorkRepository;
import com.example.labsystem.repository.ReservationRepository;
import com.example.labsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Ініціалізує базу даних тестовими даними при запуску додатку.
 * Створює дані згідно з логікою microlab_v2:
 * - Users (аналог auth)
 * - LabWorks (аналог Projects)
 * - Equipment (аналог Components з availability та link)
 * - Reservations (аналог Orders з можливістю approve)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LabRepository labRepository;
    private final EquipmentRepository equipmentRepository;
    private final LabWorkRepository labWorkRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Initializing test data (microlab_v2 logic)...");

        initUsers();
        initLabs();
        initEquipment();
        initLabWorks();
        initReservations();

        log.info("Test data initialization completed!");
    }

    private void initUsers() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);
            log.info("Created admin user: admin/admin123");
        }

        if (userRepository.findByUsername("student").isEmpty()) {
            User student = new User();
            student.setUsername("student");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole(UserRole.STUDENT);
            userRepository.save(student);
            log.info("Created student user: student/student123");
        }

        if (userRepository.findByUsername("researcher").isEmpty()) {
            User researcher = new User();
            researcher.setUsername("researcher");
            researcher.setPassword(passwordEncoder.encode("researcher123"));
            researcher.setRole(UserRole.STUDENT);
            userRepository.save(researcher);
            log.info("Created researcher user: researcher/researcher123");
        }
    }

    private void initLabs() {
        if (labRepository.count() == 0) {
            Lab lab1 = new Lab();
            lab1.setName("Computer Lab A");
            lab1.setLocation("Building 1, Floor 2, Room 201");
            lab1.setCapacity(30);
            lab1.setDescription("Комп'ютерна лабораторія з 30 робочими місцями для програмування");
            labRepository.save(lab1);

            Lab lab2 = new Lab();
            lab2.setName("Physics Lab");
            lab2.setLocation("Building 3, Floor 1, Room 105");
            lab2.setCapacity(20);
            lab2.setDescription("Фізична лабораторія з обладнанням для проведення експериментів");
            labRepository.save(lab2);

            Lab lab3 = new Lab();
            lab3.setName("Chemistry Lab");
            lab3.setLocation("Building 2, Floor 3, Room 302");
            lab3.setCapacity(25);
            lab3.setDescription("Хімічна лабораторія з витяжними шафами та реактивами");
            labRepository.save(lab3);

            log.info("Created 3 labs");
        }
    }

    private void initEquipment() {
        if (equipmentRepository.count() == 0) {
            List<Lab> labs = labRepository.findAll();
            if (labs.isEmpty()) {
                log.warn("No labs found, skipping equipment initialization");
                return;
            }

            Lab lab1 = labs.get(0);
            Lab lab2 = labs.size() > 1 ? labs.get(1) : lab1;

            // Обладнання з documentationLink (аналог link з microlab_v2)
            Equipment eq1 = Equipment.builder()
                    .name("Oscilloscope Tektronix TDS2024C")
                    .inventoryNumber("OSC-2024-001")
                    .status(EquipmentStatus.AVAILABLE)
                    .lab(lab2)
                    .description("4-канальний цифровий осцилограф, 200 MHz")
                    .documentationLink("https://www.tek.com/oscilloscope/tds2024c")
                    .build();
            equipmentRepository.save(eq1);

            Equipment eq2 = Equipment.builder()
                    .name("Multimeter Fluke 87V")
                    .inventoryNumber("MM-2024-002")
                    .status(EquipmentStatus.AVAILABLE)
                    .lab(lab2)
                    .description("Цифровий мультиметр промислового класу")
                    .documentationLink("https://www.fluke.com/87v")
                    .build();
            equipmentRepository.save(eq2);

            Equipment eq3 = Equipment.builder()
                    .name("Dell OptiPlex 7090")
                    .inventoryNumber("PC-2024-003")
                    .status(EquipmentStatus.AVAILABLE)
                    .lab(lab1)
                    .description("Настільний комп'ютер для розробки")
                    .documentationLink("https://www.dell.com/optiplex7090")
                    .build();
            equipmentRepository.save(eq3);

            Equipment eq4 = Equipment.builder()
                    .name("Function Generator Agilent 33220A")
                    .inventoryNumber("FG-2024-004")
                    .status(EquipmentStatus.AVAILABLE)
                    .lab(lab2)
                    .description("Генератор функцій 20 MHz")
                    .documentationLink("https://www.keysight.com/33220A")
                    .build();
            equipmentRepository.save(eq4);

            Equipment eq5 = Equipment.builder()
                    .name("Power Supply TTi PL330DP")
                    .inventoryNumber("PS-2024-005")
                    .status(EquipmentStatus.AVAILABLE)
                    .lab(lab2)
                    .description("Двоканальний лабораторний блок живлення")
                    .documentationLink("https://www.aimtti.com/PL330DP")
                    .build();
            equipmentRepository.save(eq5);

            log.info("Created 5 equipment items with documentation links (using {} labs)", labs.size());
        }
    }

    private void initLabWorks() {
        if (labWorkRepository.count() == 0) {
            User researcher = userRepository.findByUsername("researcher")
                    .orElse(userRepository.findAll().get(0));

            List<Equipment> equipment = equipmentRepository.findAll();

            if (equipment.isEmpty()) {
                log.warn("No equipment found, skipping lab works initialization");
                return;
            }

            // LabWork 1 (аналог Project з microlab_v2)
            LabWork lw1 = LabWork.builder()
                    .title("Дослідження характеристик осцилографа")
                    .description("Лабораторна робота присвячена вивченню принципів роботи цифрового осцилографа та вимірюванню параметрів сигналів")
                    .author(researcher)
                    .requiredEquipment(equipment.size() >= 2
                            ? List.of(equipment.get(0), equipment.get(1))
                            : List.of(equipment.get(0)))
                    .status(LabWorkStatus.PUBLISHED)
                    .build();
            labWorkRepository.save(lw1);

            // LabWork 2
            LabWork lw2 = LabWork.builder()
                    .title("Аналіз частотних характеристик")
                    .description("Вивчення частотних характеристик електричних кіл за допомогою генератора функцій")
                    .author(researcher)
                    .requiredEquipment(equipment.size() >= 4
                            ? List.of(equipment.get(3))
                            : List.of(equipment.get(0)))
                    .status(LabWorkStatus.PUBLISHED)
                    .build();
            labWorkRepository.save(lw2);

            // LabWork 3 (draft)
            LabWork lw3 = LabWork.builder()
                    .title("Програмування мікроконтролерів")
                    .description("Основи програмування мікроконтролерів Arduino")
                    .author(researcher)
                    .requiredEquipment(equipment.size() >= 3
                            ? List.of(equipment.get(2))
                            : List.of(equipment.get(equipment.size() > 1 ? 1 : 0)))
                    .status(LabWorkStatus.DRAFT)
                    .build();
            labWorkRepository.save(lw3);

            log.info("Created 3 lab works with {} equipment items available", equipment.size());
        }
    }

    private void initReservations() {
        if (reservationRepository.count() == 0) {
            User student = userRepository.findByUsername("student")
                    .orElse(userRepository.findAll().get(1));
            User admin = userRepository.findByUsername("admin")
                    .orElse(userRepository.findAll().get(0));

            List<Lab> labs = labRepository.findAll();
            if (labs.isEmpty()) {
                log.warn("No labs found, skipping reservations initialization");
                return;
            }

            List<LabWork> labWorks = labWorkRepository.findAll();
            if (labWorks.isEmpty()) {
                log.warn("No lab works found, skipping reservations initialization");
                return;
            }

            List<Equipment> equipment = equipmentRepository.findAll();
            if (equipment.isEmpty()) {
                log.warn("No equipment found, skipping reservations initialization");
                return;
            }

            Lab lab = labs.size() > 1 ? labs.get(1) : labs.get(0);
            LabWork labWork = labWorks.get(0);

            // Reservation 1 - PENDING (аналог Order який очікує approve)
            Reservation r1 = Reservation.builder()
                    .lab(lab)
                    .user(student)
                    .labWork(labWork)
                    .equipment(equipment.size() >= 2
                            ? List.of(equipment.get(0), equipment.get(1))
                            : List.of(equipment.get(0)))
                    .startTime(LocalDateTime.now().plusDays(2))
                    .endTime(LocalDateTime.now().plusDays(2).plusHours(3))
                    .purpose("Виконання лабораторної роботи №1")
                    .status(ReservationStatus.PENDING)
                    .build();
            reservationRepository.save(r1);

            // Reservation 2 - APPROVED
            Reservation r2 = Reservation.builder()
                    .lab(lab)
                    .user(student)
                    .labWork(labWork)
                    .equipment(new ArrayList<>(List.of(equipment.get(0))))
                    .startTime(LocalDateTime.now().plusDays(5))
                    .endTime(LocalDateTime.now().plusDays(5).plusHours(2))
                    .purpose("Повторне вимірювання для звіту")
                    .status(ReservationStatus.APPROVED)
                    .approvedBy(admin)
                    .approvedAt(LocalDateTime.now().minusHours(1))
                    .build();
            reservationRepository.save(r2);

            // Reservation 3 - PENDING
            Reservation r3 = Reservation.builder()
                    .lab(lab)
                    .user(student)
                    .equipment(new ArrayList<>(List.of(equipment.size() >= 4
                            ? equipment.get(3)
                            : equipment.get(equipment.size() > 1 ? 1 : 0))))
                    .startTime(LocalDateTime.now().plusDays(7))
                    .endTime(LocalDateTime.now().plusDays(7).plusHours(4))
                    .purpose("Дослідження генератора функцій")
                    .status(ReservationStatus.PENDING)
                    .build();
            reservationRepository.save(r3);

            log.info("Created 3 reservations (2 pending, 1 approved)");
        }
    }
}
