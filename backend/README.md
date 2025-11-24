# Lab Management System - Backend

Веб-система управління лабораторіями для навчального закладу.

## Зміст
- [Огляд проекту](#огляд-проекту)
- [Технічний стек](#технічний-стек)
- [Архітектура](#архітектура)
- [Патерни проектування](#патерни-проектування)
- [SOLID принципи](#solid-принципи)
- [Встановлення та запуск](#встановлення-та-запуск)
- [API Endpoints](#api-endpoints)
- [Docker](#docker)
- [Тестові дані](#тестові-дані)

## Огляд проекту

Система дозволяє:
- Управляти лабораторіями та обладнанням
- Бронювати лабораторії для проведення занять
- Відстежувати статус обладнання
- Керувати користувачами (адміністратори та студенти)

## Технічний стек

- **Java 17**
- **Spring Boot 3.3.4**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
  - Spring Actuator
- **PostgreSQL 16**
- **JWT** для аутентифікації
- **Lombok** для зменшення boilerplate коду
- **Maven** для збірки
- **Docker & Docker Compose** для контейнеризації

## Архітектура

Проект використовує **багатошарову архітектуру**:

```
┌─────────────────────────────────────┐
│       Controller Layer              │  ← REST API endpoints
├─────────────────────────────────────┤
│       Service Layer                 │  ← Бізнес-логіка
├─────────────────────────────────────┤
│       Repository Layer              │  ← Доступ до БД
├─────────────────────────────────────┤
│       Domain Layer                  │  ← Entity класи
└─────────────────────────────────────┘
```

### Структура пакетів

```
com.example.labsystem
├── config              # Конфігурація (Security, DataInitializer)
├── controller          # REST контролери
├── domain              # Entity класи
│   ├── lab             # Lab, Equipment
│   ├── reservation     # Reservation
│   └── user            # User
├── dto                 # Data Transfer Objects
│   ├── request         # Request DTO
│   └── response        # Response DTO
├── exception           # Обробка винятків
├── mapper              # Мапери Entity ↔ DTO
├── pattern             # Design Patterns
│   ├── factory         # Factory Pattern
│   ├── strategy        # Strategy Pattern
│   └── observer        # Observer Pattern
├── repository          # Spring Data JPA repositories
├── security            # JWT, фільтри, UserDetailsService
└── service             # Сервіси (інтерфейси та impl)
```

## Патерни проектування

### 1. Factory Pattern
**Місце:** `pattern.factory`

Використовується для створення різних типів повідомлень (Email, SMS).

```java
NotificationFactory factory = ...;
Notification notification = factory.getNotification("EMAIL");
notification.send(recipient, message);
```

**Переваги:**
- Відокремлення логіки створення об'єктів
- Легко додавати нові типи повідомлень
- Open/Closed Principle

### 2. Strategy Pattern
**Місце:** `pattern.strategy`

Використовується для валідації резервацій з різними правилами.

```java
ReservationValidator validator = ...;
validator.validateAll(reservation); // Застосовує всі стратегії
```

**Стратегії:**
- `TimeSlotValidationStrategy` - перевірка часового слоту
- `DurationValidationStrategy` - перевірка тривалості

**Переваги:**
- Легко додавати нові правила валідації
- Кожна стратегія має одну відповідальність
- Single Responsibility Principle

### 3. Observer Pattern
**Місце:** `pattern.observer`

Використовується для сповіщення про події резервацій.

```java
eventPublisher.publishEvent(new ReservationEvent(
    reservation,
    ReservationEventType.CREATED,
    username
));
```

**Переваги:**
- Слабка зв'язаність між компонентами
- Легко додавати нових спостерігачів
- Open/Closed Principle

### 4. Builder Pattern
**Місце:** Domain entities (`Equipment`, `Reservation`)

Використовується через Lombok `@Builder` для зручного створення об'єктів.

```java
Equipment equipment = Equipment.builder()
    .name("Dell OptiPlex")
    .inventoryNumber("PC-001")
    .status(EquipmentStatus.AVAILABLE)
    .build();
```

## SOLID принципи

### Single Responsibility Principle (SRP)
Кожен клас має одну відповідальність:
- `UserService` - тільки робота з користувачами
- `AuthService` - тільки аутентифікація
- `ReservationService` - тільки резервації

### Open/Closed Principle (OCP)
- Легко додавати нові стратегії валідації без зміни `ReservationValidator`
- Легко додавати нові типи повідомлень без зміни `NotificationFactory`

### Liskov Substitution Principle (LSP)
- Всі реалізації `Notification` можна замінити одна на одну
- Всі реалізації `ReservationValidationStrategy` взаємозамінні

### Interface Segregation Principle (ISP)
- Вузькі інтерфейси: `Notification`, `ReservationValidationStrategy`
- Клієнти не залежать від методів, які не використовують

### Dependency Inversion Principle (DIP)
- Сервіси залежать від абстракцій (Repository interfaces)
- Використання constructor injection через `@RequiredArgsConstructor`

## Встановлення та запуск

### Вимоги
- Java 17+
- Maven 3.9+
- PostgreSQL 16+ (або Docker)

### Локальний запуск

1. **Клонувати репозиторій:**
```bash
git clone <repository-url>
cd lab-system-backend
```

2. **Налаштувати БД:**
Створити базу даних PostgreSQL:
```sql
CREATE DATABASE lab_system;
```

3. **Налаштувати application.properties:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lab_system
spring.datasource.username=postgres
spring.datasource.password=your_password
```

4. **Зібрати проект:**
```bash
mvn clean package
```

5. **Запустити:**
```bash
java -jar target/lab-system-backend-0.0.1-SNAPSHOT.jar
```

Додаток буде доступний на: http://localhost:8080

## Docker

### Запуск через Docker Compose

1. **Зібрати та запустити:**
```bash
docker-compose up -d
```

2. **Переглянути логи:**
```bash
docker-compose logs -f backend
```

3. **Зупинити:**
```bash
docker-compose down
```

### Окремі команди Docker

```bash
# Зібрати образ
docker build -t lab-system-backend .

# Запустити контейнер
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/lab_system \
  lab-system-backend
```

## API Endpoints

### Authentication

#### Реєстрація
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "student1",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Логін
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

### Labs

#### Отримати всі лабораторії
```http
GET /api/labs
Authorization: Bearer <token>
```

#### Створити лабораторію (ADMIN)
```http
POST /api/labs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Computer Lab B",
  "location": "Building 1, Room 202",
  "capacity": 25,
  "description": "Lab description"
}
```

#### Оновити лабораторію (ADMIN)
```http
PUT /api/labs/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Lab Name",
  "location": "New Location",
  "capacity": 30,
  "description": "Updated description"
}
```

#### Видалити лабораторію (ADMIN)
```http
DELETE /api/labs/{id}
Authorization: Bearer <token>
```

### Equipment

#### Отримати обладнання лабораторії
```http
GET /api/equipment/lab/{labId}
Authorization: Bearer <token>
```

#### Додати обладнання
```http
POST /api/equipment
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Dell Monitor",
  "inventoryNumber": "MON-2024-001",
  "status": "AVAILABLE",
  "labId": 1
}
```

### Reservations

#### Створити резервацію
```http
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "labId": 1,
  "startTime": "2024-12-01T10:00:00",
  "endTime": "2024-12-01T12:00:00",
  "purpose": "Programming class"
}
```

#### Мої резервації
```http
GET /api/reservations/my
Authorization: Bearer <token>
```

#### Всі резервації (ADMIN)
```http
GET /api/reservations
Authorization: Bearer <token>
```

#### Оновити статус резервації (ADMIN)
```http
PUT /api/reservations/{id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED"
}
```

### Health Check

```http
GET /actuator/health
```

## Тестові дані

При запуску додатку автоматично створюються:

### Користувачі:
- **Admin:** `admin` / `admin123`
- **Student:** `student` / `student123`

### Лабораторії:
1. Computer Lab A - Building 1, Floor 2, Room 201 (30 місць)
2. Physics Lab - Building 3, Floor 1, Room 105 (20 місць)
3. Chemistry Lab - Building 2, Floor 3, Room 302 (25 місць)

### Обладнання:
1. Dell OptiPlex 7090 (AVAILABLE)
2. HP ProDesk 600 (AVAILABLE)
3. Lenovo ThinkCentre (MAINTENANCE)

## Безпека

- JWT токени з expiration time (1 година)
- Паролі хешуються через BCrypt
- CORS налаштовано для frontend
- Role-based access control (ADMIN, STUDENT)

## Майбутні покращення

- [ ] Unit та Integration тести
- [ ] Swagger/OpenAPI документація
- [ ] Email повідомлення для реальних сповіщень
- [ ] Пагінація для списків
- [ ] Фільтрація та пошук
- [ ] Audit logging
- [ ] Rate limiting

## Автор

Курсова робота з дисципліни "Проектування Програмного Забезпечення"

## Ліцензія

MIT License
