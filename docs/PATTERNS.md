# Патерни Проектування

## Зміст

- [Огляд](#огляд)
- [Creational Patterns](#creational-patterns)
- [Structural Patterns](#structural-patterns)
- [Behavioral Patterns](#behavioral-patterns)
- [Архітектурні патерни](#архітектурні-патерни)
- [Spring Framework Patterns](#spring-framework-patterns)

---

## Огляд

В проекті використовуються наступні design patterns для побудови гнучкої, розширюваної та підтримуваної архітектури:

| Патерн | Тип | Застосування | Пакет |
|--------|-----|--------------|-------|
| Factory | Creational | Створення повідомлень | `pattern.factory` |
| Builder | Creational | Побудова entities | Lombok `@Builder` |
| Singleton | Creational | Spring beans | `@Service`, `@Component` |
| Strategy | Behavioral | Валідація резервацій | `pattern.strategy` |
| Observer | Behavioral | Обробка подій | `pattern.observer` |
| Decorator | Structural | Security filters | `security` |
| Proxy | Structural | JPA repositories | Spring Data JPA |
| Layered | Architectural | Backend structure | Controller→Service→Repository |
| MVC | Architectural | Frontend structure | React Components |
| DTO | Architectural | Data transfer | `dto` package |

---

## Creational Patterns

### 1. Factory Pattern

**Призначення:** Надає інтерфейс для створення об'єктів у суперкласі, але дозволяє підкласам змінювати тип створюваних об'єктів.

**Застосування:** Створення різних типів повідомлень (Email, SMS, Push).

#### Реалізація:

**Інтерфейс Notification:**
```java
package com.example.labsystem.pattern.factory;

public interface Notification {
    void send(String recipient, String message);
    String getType();
}
```

**Конкретні реалізації:**

```java
// Email повідомлення
@Component
@Slf4j
public class EmailNotification implements Notification {

    @Override
    public void send(String recipient, String message) {
        log.info("Sending EMAIL to {}: {}", recipient, message);
        // В реальному додатку - відправка через SMTP
    }

    @Override
    public String getType() {
        return "EMAIL";
    }
}

// SMS повідомлення
@Component
@Slf4j
public class SmsNotification implements Notification {

    @Override
    public void send(String recipient, String message) {
        log.info("Sending SMS to {}: {}", recipient, message);
        // В реальному додатку - відправка через SMS gateway
    }

    @Override
    public String getType() {
        return "SMS";
    }
}

// Push повідомлення
@Component
@Slf4j
public class PushNotification implements Notification {

    @Override
    public void send(String recipient, String message) {
        log.info("Sending PUSH to {}: {}", recipient, message);
        // В реальному додатку - відправка через Firebase/APNs
    }

    @Override
    public String getType() {
        return "PUSH";
    }
}
```

**Factory клас:**

```java
@Component
@RequiredArgsConstructor
public class NotificationFactory {

    private final List<Notification> notifications;

    public Notification getNotification(String type) {
        return notifications.stream()
            .filter(n -> n.getType().equalsIgnoreCase(type))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Unknown notification type: " + type));
    }
}
```

**Використання:**

```java
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final NotificationFactory notificationFactory;

    public void notifyUser(String type, String recipient, String message) {
        Notification notification = notificationFactory.getNotification(type);
        notification.send(recipient, message);
    }
}
```

**Переваги:**
- Легко додавати нові типи повідомлень без зміни існуючого коду
- Відокремлення логіки створення від використання
- Spring автоматично інжектить всі реалізації через `List<Notification>`

---

### 2. Builder Pattern

**Призначення:** Дозволяє створювати складні об'єкти крок за кроком.

**Застосування:** Побудова domain entities з великою кількістю полів.

#### Реалізація через Lombok:

```java
@Entity
@Table(name = "equipment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "inventory_number", nullable = false, unique = true)
    private String inventoryNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_id")
    private Lab lab;

    private String description;
    private String manufacturer;
    private String model;
    private String documentationLink;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

**Використання:**

```java
Equipment equipment = Equipment.builder()
    .name("Arduino Mega 2560")
    .inventoryNumber("ARD-2024-001")
    .status(EquipmentStatus.AVAILABLE)
    .manufacturer("Arduino")
    .model("Mega 2560")
    .description("Microcontroller board based on ATmega2560")
    .documentationLink("https://docs.arduino.cc/hardware/mega-2560")
    .lab(lab)
    .build();
```

**Переваги:**
- Читабельність коду
- Можливість створювати об'єкти з різним набором параметрів
- Immutability (якщо потрібно)
- Lombok генерує код автоматично

---

### 3. Singleton Pattern

**Призначення:** Гарантує, що клас має лише один екземпляр і надає глобальну точку доступу до нього.

**Застосування:** Spring beans (Services, Repositories, Controllers).

#### Реалізація через Spring:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class LabService {

    private final LabRepository labRepository;
    private final LabMapper labMapper;

    // Цей клас є singleton в Spring context

    public List<LabResponse> getAllLabs() {
        return labRepository.findAll().stream()
            .map(labMapper::toResponse)
            .collect(Collectors.toList());
    }
}
```

**Як працює:**
- Spring створює один екземпляр `LabService` при запуску додатку
- Всі залежності (Repository, Mapper) також є singletons
- При інжекті `LabService` в інші компоненти використовується той самий екземпляр

**Переваги:**
- Контроль над створенням екземплярів
- Ефективне використання памʼяті
- Глобальна точка доступу
- Thread-safe (Spring контейнер керує життєвим циклом)

---

## Behavioral Patterns

### 4. Strategy Pattern

**Призначення:** Визначає сімейство алгоритмів, інкапсулює кожен з них і робить їх взаємозамінними.

**Застосування:** Валідація резервацій з різними правилами перевірки.

#### Реалізація:

**Інтерфейс стратегії:**
```java
package com.example.labsystem.pattern.strategy;

public interface ReservationValidationStrategy {
    void validate(Reservation reservation);
}
```

**Конкретні стратегії:**

```java
// Перевірка часового слоту
@Component
public class TimeSlotValidationStrategy implements ReservationValidationStrategy {

    @Override
    public void validate(Reservation reservation) {
        LocalDateTime start = reservation.getStartTime();
        LocalDateTime end = reservation.getEndTime();

        if (start.isAfter(end)) {
            throw new ValidationException("Start time must be before end time");
        }

        if (start.isBefore(LocalDateTime.now())) {
            throw new ValidationException("Cannot create reservation in the past");
        }
    }
}

// Перевірка тривалості
@Component
public class DurationValidationStrategy implements ReservationValidationStrategy {

    private static final int MAX_HOURS = 8;

    @Override
    public void validate(Reservation reservation) {
        long hours = ChronoUnit.HOURS.between(
            reservation.getStartTime(),
            reservation.getEndTime()
        );

        if (hours > MAX_HOURS) {
            throw new ValidationException(
                "Reservation duration cannot exceed " + MAX_HOURS + " hours"
            );
        }

        if (hours < 1) {
            throw new ValidationException(
                "Reservation duration must be at least 1 hour"
            );
        }
    }
}

// Перевірка конфліктів
@Component
@RequiredArgsConstructor
public class ConflictValidationStrategy implements ReservationValidationStrategy {

    private final ReservationRepository reservationRepository;

    @Override
    public void validate(Reservation reservation) {
        boolean hasConflict = reservationRepository.existsOverlapping(
            reservation.getLab().getId(),
            reservation.getStartTime(),
            reservation.getEndTime(),
            reservation.getId() != null ? reservation.getId() : -1L
        );

        if (hasConflict) {
            throw new ValidationException("Time slot is already booked");
        }
    }
}
```

**Validator клас:**

```java
@Component
@RequiredArgsConstructor
public class ReservationValidator {

    private final List<ReservationValidationStrategy> strategies;

    public void validateAll(Reservation reservation) {
        strategies.forEach(strategy -> strategy.validate(reservation));
    }
}
```

**Використання в сервісі:**

```java
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationValidator validator;
    private final ReservationRepository reservationRepository;

    @Transactional
    public ReservationResponse createReservation(
        ReservationRequest request,
        String username
    ) {
        Reservation reservation = buildReservation(request, username);

        // Виконуємо всі валідації
        validator.validateAll(reservation);

        Reservation saved = reservationRepository.save(reservation);
        return mapToResponse(saved);
    }
}
```

**Переваги:**
- Кожна валідація - окремий клас (Single Responsibility)
- Легко додавати нові правила валідації
- Можна комбінувати стратегії
- Тестується окремо кожна стратегія

---

### 5. Observer Pattern

**Призначення:** Визначає залежність один-до-багатьох між об'єктами таким чином, що при зміні стану одного об'єкта всі залежні об'єкти сповіщаються.

**Застосування:** Система подій для резервацій, замовлень, проектів.

#### Реалізація через Spring Events:

**Event класи:**

```java
@Getter
@AllArgsConstructor
public class ReservationEvent {
    private final Reservation reservation;
    private final ReservationEventType type;
    private final String username;
}

public enum ReservationEventType {
    CREATED,
    APPROVED,
    CANCELLED,
    COMPLETED
}
```

**Publisher (Subject):**

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ApplicationEventPublisher eventPublisher;
    private final ReservationRepository reservationRepository;

    @Transactional
    public ReservationResponse createReservation(
        ReservationRequest request,
        String username
    ) {
        Reservation reservation = buildReservation(request, username);
        Reservation saved = reservationRepository.save(reservation);

        // Публікуємо подію
        eventPublisher.publishEvent(new ReservationEvent(
            saved,
            ReservationEventType.CREATED,
            username
        ));

        return mapToResponse(saved);
    }

    @Transactional
    public void approveReservation(Long id) {
        Reservation reservation = findById(id);
        reservation.setStatus(ReservationStatus.APPROVED);
        Reservation saved = reservationRepository.save(reservation);

        eventPublisher.publishEvent(new ReservationEvent(
            saved,
            ReservationEventType.APPROVED,
            reservation.getUser().getUsername()
        ));
    }
}
```

**Observers (Listeners):**

```java
// Email notification listener
@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationEmailListener {

    private final NotificationFactory notificationFactory;

    @EventListener
    @Async
    public void handleReservationCreated(ReservationEvent event) {
        if (event.getType() == ReservationEventType.CREATED) {
            Notification email = notificationFactory.getNotification("EMAIL");
            email.send(
                event.getUsername(),
                "Reservation created for " + event.getReservation().getLab().getName()
            );
            log.info("Email sent for reservation #{}", event.getReservation().getId());
        }
    }

    @EventListener
    @Async
    public void handleReservationApproved(ReservationEvent event) {
        if (event.getType() == ReservationEventType.APPROVED) {
            Notification email = notificationFactory.getNotification("EMAIL");
            email.send(
                event.getUsername(),
                "Your reservation has been approved"
            );
        }
    }
}

// Logging listener
@Component
@Slf4j
public class ReservationLoggingListener {

    @EventListener
    public void logReservationEvent(ReservationEvent event) {
        log.info("Reservation event: {} - Reservation #{} - User: {}",
            event.getType(),
            event.getReservation().getId(),
            event.getUsername()
        );
    }
}

// Statistics listener
@Component
@RequiredArgsConstructor
public class ReservationStatisticsListener {

    private final StatisticsService statisticsService;

    @EventListener
    public void updateStatistics(ReservationEvent event) {
        statisticsService.recordReservationEvent(
            event.getType(),
            event.getReservation().getLab().getId()
        );
    }
}
```

**Переваги:**
- Слабкий зв'язок між компонентами
- Легко додавати нових спостерігачів
- Асинхронна обробка (`@Async`)
- Spring автоматично керує підпискою

---

## Structural Patterns

### 6. Decorator Pattern

**Призначення:** Динамічно додає об'єктам нову функціональність.

**Застосування:** Security filters для JWT authentication.

#### Реалізація:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, userDetails.getUsername())) {
                    // Декоруємо request з authentication
                    UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // Передаємо далі по ланцюгу
        filterChain.doFilter(request, response);
    }
}
```

**Конфігурація:**

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            // Додаємо наш декоратор до ланцюга
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

**Переваги:**
- Додаємо функціональність без зміни базового класу
- Можна комбінувати декоратори
- Гнучке керування поведінкою в runtime

---

### 7. Proxy Pattern

**Призначення:** Надає замінник або placeholder для іншого об'єкта для контролю доступу до нього.

**Застосування:** Spring Data JPA repositories.

#### Реалізація:

```java
@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {

    // Spring автоматично створює proxy з реалізацією
    List<Lab> findAll();

    Optional<Lab> findById(Long id);

    @Query("SELECT l FROM Lab l WHERE l.capacity >= :minCapacity")
    List<Lab> findByMinCapacity(@Param("minCapacity") Integer minCapacity);

    boolean existsByName(String name);
}
```

**Як працює:**
1. Spring створює proxy клас, який реалізує `LabRepository`
2. Proxy перехоплює виклики методів
3. Proxy генерує SQL запити на основі назви методу або `@Query`
4. Виконує запит через EntityManager
5. Маппить результати в Entity об'єкти

**Переваги:**
- Не потрібно писати JDBC код
- Lazy loading для associations
- Transaction management
- Автоматичне керування з'єднаннями

---

## Архітектурні патерни

### 8. Layered Architecture

**Призначення:** Організація коду в шари з чіткою відповідальністю.

**Застосування:** Backend структура проекту.

#### Структура:

```
┌─────────────────────────────────────────┐
│         Controller Layer                │  @RestController
│  - HTTP handling                        │  - Request/Response
│  - DTO validation                       │  - Error handling
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Service Layer                   │  @Service
│  - Business logic                       │  - @Transactional
│  - Entity ↔ DTO mapping                 │  - Pattern usage
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Repository Layer                │  @Repository
│  - Database operations                  │  - JPA queries
│  - CRUD operations                      │  - Specifications
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Domain Layer                    │  @Entity
│  - Business entities                    │  - JPA annotations
│  - Relationships                        │  - Lombok
└─────────────────────────────────────────┘
```

#### Приклад реалізації:

**Controller Layer:**
```java
@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
public class LabController {

    private final LabService labService;

    @GetMapping
    public ResponseEntity<List<LabResponse>> getAllLabs() {
        return ResponseEntity.ok(labService.getAllLabs());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LabResponse> createLab(@Valid @RequestBody LabRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(labService.createLab(request));
    }
}
```

**Service Layer:**
```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LabService {

    private final LabRepository labRepository;
    private final LabMapper labMapper;

    public List<LabResponse> getAllLabs() {
        return labRepository.findAll().stream()
            .map(labMapper::toResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public LabResponse createLab(LabRequest request) {
        Lab lab = labMapper.toEntity(request);
        Lab saved = labRepository.save(lab);
        return labMapper.toResponse(saved);
    }
}
```

**Repository Layer:**
```java
@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    List<Lab> findAll();
    Optional<Lab> findById(Long id);
}
```

**Domain Layer:**
```java
@Entity
@Table(name = "labs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer capacity;
}
```

**Переваги:**
- Чітке розділення відповідальності
- Легке тестування кожного шару окремо
- Можливість змінювати реалізацію шару без впливу на інші
- Зрозуміла структура для нових розробників

---

### 9. Data Transfer Object (DTO)

**Призначення:** Передача даних між шарами без розкриття внутрішньої структури entities.

**Застосування:** Request/Response об'єкти для API.

#### Реалізація:

**Request DTO:**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String description;
}
```

**Response DTO:**
```java
@Data
@Builder
public class LabResponse {
    private Long id;
    private String name;
    private String location;
    private Integer capacity;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer equipmentCount;
}
```

**Mapper:**
```java
@Component
public class LabMapper {

    public Lab toEntity(LabRequest request) {
        return Lab.builder()
            .name(request.getName())
            .location(request.getLocation())
            .capacity(request.getCapacity())
            .description(request.getDescription())
            .build();
    }

    public LabResponse toResponse(Lab lab) {
        return LabResponse.builder()
            .id(lab.getId())
            .name(lab.getName())
            .location(lab.getLocation())
            .capacity(lab.getCapacity())
            .description(lab.getDescription())
            .createdAt(lab.getCreatedAt())
            .updatedAt(lab.getUpdatedAt())
            .equipmentCount(lab.getEquipment() != null ? lab.getEquipment().size() : 0)
            .build();
    }
}
```

**Переваги:**
- Контроль над даними, що передаються через API
- Можливість додавати обчислювані поля (equipmentCount)
- Валідація на вході
- Не розкриваємо внутрішню структуру Entity

---

## Spring Framework Patterns

### 10. Dependency Injection

**Застосування:** Constructor injection через `@RequiredArgsConstructor`.

```java
@Service
@RequiredArgsConstructor  // Lombok генерує constructor
public class ReservationService {

    // Dependencies
    private final ReservationRepository reservationRepository;
    private final LabRepository labRepository;
    private final UserRepository userRepository;
    private final ReservationValidator validator;
    private final ApplicationEventPublisher eventPublisher;

    // Spring автоматично інжектить всі залежності через constructor
}
```

---

## Висновок

### Підсумок використаних патернів:

| Патерн | Мета | Результат |
|--------|------|-----------|
| Factory | Створення різних типів повідомлень | Легко розширювати систему нотифікацій |
| Builder | Побудова складних entities | Читабельний код створення об'єктів |
| Singleton | Один екземпляр services | Ефективне використання ресурсів |
| Strategy | Гнучка валідація | Легко додавати нові правила |
| Observer | Обробка подій | Слабкий зв'язок між компонентами |
| Decorator | Розширення функціональності | Гнучка security конфігурація |
| Proxy | Абстракція доступу до БД | Простота роботи з даними |
| Layered | Організація коду | Чітка структура та підтримуваність |
| DTO | Передача даних | Безпека та гнучкість API |

### Досягнуті цілі:

1. **Гнучкість** - легко розширювати систему новою функціональністю
2. **Підтримуваність** - код структурований та зрозумілий
3. **Тестованість** - кожен компонент можна тестувати окремо
4. **Повторне використання** - патерни можна застосовувати в різних частинах системи
5. **SOLID принципи** - патерни допомагають дотримуватись SOLID

---

**Примітка:** Всі патерни інтегровані з Spring Framework та використовують переваги IoC контейнера для автоматичного керування життєвим циклом компонентів.
