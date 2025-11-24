# Проектування ORM та Структури Бази Даних

## Огляд

Система використовує:
- **СУБД:** PostgreSQL 16
- **ORM:** JPA/Hibernate через Spring Data JPA
- **Діалект:** PostgreSQLDialect
- **DDL Auto:** update (автоматичне створення/оновлення схеми)

## ER Діаграма

```
┌─────────────────┐           ┌──────────────────┐           ┌─────────────────┐
│     USERS       │           │   LAB_WORKS      │           │      LABS       │
├─────────────────┤           ├──────────────────┤           ├─────────────────┤
│ id (PK)         │◄─────────┤ author_id (FK)   │           │ id (PK)         │
│ username        │           │ id (PK)          │           │ name            │
│ password        │           │ title            │           │ location        │
│ role            │           │ description      │           │ capacity        │
└────────┬────────┘           │ status           │           │ description     │
         │                    │ created_at       │           └────────┬────────┘
         │                    │ updated_at       │                    │
         │                    └──────────────────┘                    │
         │                             │                              │
         │                             │                              │
         │                    ┌────────▼───────────┐                  │
         │                    │ LABWORK_EQUIPMENT  │                  │
         │                    ├────────────────────┤                  │
         │                    │ labwork_id (FK)    │                  │
         │                    │ equipment_id (FK)  │                  │
         │                    └────────────────────┘                  │
         │                             │                              │
         │                             │                              │
         │                    ┌────────▼───────────────┐              │
         │                    │     EQUIPMENT          │              │
         │                    ├────────────────────────┤◄─────────────┘
         │                    │ id (PK)                │
         │                    │ name                   │
         │                    │ inventory_number       │
         │                    │ status                 │
         │                    │ documentation_link     │
         │                    │ lab_id (FK)            │
         │                    │ description            │
         │                    │ created_at             │
         │                    │ updated_at             │
         │                    └────────┬───────────────┘
         │                             │
         │                             │
         │                    ┌────────▼──────────────┐
         │                    │RESERVATION_EQUIPMENT  │
         │                    ├───────────────────────┤
         │                    │ reservation_id (FK)   │
         │                    │ equipment_id (FK)     │
         │                    └───────────────────────┘
         │                             │
         │                             │
         └────────────────────┐ ┌──────▼───────────────┐
                              │ │   RESERVATIONS       │
                              ▼ ├──────────────────────┤
                              ──┤ id (PK)              │
                                │ labwork_id (FK)      │
                                │ lab_id (FK)          │
                                │ user_id (FK)         │
                                │ approved_by_id (FK)  │
                                │ start_time           │
                                │ end_time             │
                                │ status               │
                                │ purpose              │
                                │ approved_at          │
                                │ created_at           │
                                │ updated_at           │
                                └──────────────────────┘
```

## Таблиці та Схема

### 1. USERS (Користувачі)

**Опис:** Зберігає інформацію про користувачів системи.

**Структура:**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,

    CONSTRAINT users_username_unique UNIQUE (username)
);
```

**Поля:**
| Поле | Тип | Обов'язкове | Опис |
|------|-----|------------|------|
| id | BIGINT | Так | Первинний ключ, автоінкремент |
| username | VARCHAR(255) | Так | Унікальне ім'я користувача |
| password | VARCHAR(255) | Так | Хешований пароль (BCrypt) |
| role | VARCHAR(50) | Так | Роль: ADMIN, STUDENT |

**Індекси:**
- PRIMARY KEY: `id`
- UNIQUE: `username`

**Enum Values:**
```java
public enum UserRole {
    ADMIN,   // Адміністратор системи
    STUDENT  // Студент
}
```

### 2. LABS (Лабораторії)

**Опис:** Зберігає інформацію про лабораторії.

**Структура:**
```sql
CREATE TABLE labs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    capacity INTEGER,
    description VARCHAR(255)
);
```

**Поля:**
| Поле | Тип | Обов'язкове | Опис |
|------|-----|------------|------|
| id | BIGINT | Так | Первинний ключ |
| name | VARCHAR(255) | Ні | Назва лабораторії |
| location | VARCHAR(255) | Ні | Розташування |
| capacity | INTEGER | Ні | Кількість місць |
| description | VARCHAR(255) | Ні | Опис лабораторії |

**Індекси:**
- PRIMARY KEY: `id`

### 3. EQUIPMENT (Обладнання)

**Опис:** Зберігає інформацію про обладнання.

**Структура:**
```sql
CREATE TABLE equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    inventory_number VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    documentation_link VARCHAR(500),
    lab_id BIGINT,
    description VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_equipment_lab FOREIGN KEY (lab_id)
        REFERENCES labs(id) ON DELETE SET NULL,
    CONSTRAINT equipment_inventory_unique UNIQUE (inventory_number)
);
```

**Поля:**
| Поле | Тип | Обов'язкове | Опис |
|------|-----|------------|------|
| id | BIGINT | Так | Первинний ключ |
| name | VARCHAR(255) | Так | Назва обладнання |
| inventory_number | VARCHAR(255) | Так | Унікальний інвентарний номер |
| status | VARCHAR(50) | Так | Статус: AVAILABLE, MAINTENANCE, BROKEN |
| documentation_link | VARCHAR(500) | Ні | Посилання на документацію |
| lab_id | BIGINT | Ні | FK до labs(id) |
| description | VARCHAR(1000) | Ні | Детальний опис |
| created_at | TIMESTAMP | Так | Дата створення |
| updated_at | TIMESTAMP | Так | Дата оновлення |

**Індекси:**
- PRIMARY KEY: `id`
- UNIQUE: `inventory_number`
- FOREIGN KEY: `lab_id` → `labs(id)`

**Enum Values:**
```java
public enum EquipmentStatus {
    AVAILABLE,   // Доступне
    MAINTENANCE, // На обслуговуванні
    BROKEN       // Зламане
}
```

### 4. LAB_WORKS (Лабораторні роботи)

**Опис:** Зберігає інформацію про лабораторні роботи (проекти).

**Структура:**
```sql
CREATE TABLE lab_works (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    author_id BIGINT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_labwork_author FOREIGN KEY (author_id)
        REFERENCES users(id) ON DELETE SET NULL
);
```

**Поля:**
| Поле | Тип | Обов'язкове | Опис |
|------|-----|------------|------|
| id | BIGINT | Так | Первинний ключ |
| title | VARCHAR(255) | Так | Назва роботи |
| description | VARCHAR(1000) | Ні | Опис роботи |
| author_id | BIGINT | Ні | FK до users(id) - автор |
| status | VARCHAR(50) | Так | Статус: DRAFT, PUBLISHED, ARCHIVED |
| created_at | TIMESTAMP | Так | Дата створення |
| updated_at | TIMESTAMP | Так | Дата оновлення |

**Індекси:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `author_id` → `users(id)`

**Enum Values:**
```java
public enum LabWorkStatus {
    DRAFT,     // Чернетка
    PUBLISHED, // Опубліковано
    ARCHIVED   // В архіві
}
```

### 5. RESERVATIONS (Резервації)

**Опис:** Зберігає запити на резервацію лабораторій та обладнання.

**Структура:**
```sql
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    labwork_id BIGINT,
    lab_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    approved_by_id BIGINT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    purpose VARCHAR(1000),
    approved_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_reservation_labwork FOREIGN KEY (labwork_id)
        REFERENCES lab_works(id) ON DELETE SET NULL,
    CONSTRAINT fk_reservation_lab FOREIGN KEY (lab_id)
        REFERENCES labs(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_approver FOREIGN KEY (approved_by_id)
        REFERENCES users(id) ON DELETE SET NULL
);
```

**Поля:**
| Поле | Тип | Обов'язкове | Опис |
|------|-----|------------|------|
| id | BIGINT | Так | Первинний ключ |
| labwork_id | BIGINT | Ні | FK до lab_works(id) |
| lab_id | BIGINT | Так | FK до labs(id) |
| user_id | BIGINT | Так | FK до users(id) - хто створив |
| approved_by_id | BIGINT | Ні | FK до users(id) - хто погодив |
| start_time | TIMESTAMP | Так | Час початку |
| end_time | TIMESTAMP | Так | Час закінчення |
| status | VARCHAR(50) | Так | Статус резервації |
| purpose | VARCHAR(1000) | Ні | Мета резервації |
| approved_at | TIMESTAMP | Ні | Час погодження |
| created_at | TIMESTAMP | Так | Дата створення |
| updated_at | TIMESTAMP | Так | Дата оновлення |

**Індекси:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `labwork_id` → `lab_works(id)`
- FOREIGN KEY: `lab_id` → `labs(id)`
- FOREIGN KEY: `user_id` → `users(id)`
- FOREIGN KEY: `approved_by_id` → `users(id)`

**Enum Values:**
```java
public enum ReservationStatus {
    PENDING,   // Очікує погодження
    APPROVED,  // Погоджено
    REJECTED,  // Відхилено
    COMPLETED, // Завершено
    CANCELLED  // Скасовано
}
```

### 6. LABWORK_EQUIPMENT (Many-to-Many)

**Опис:** Зв'язок між лабораторними роботами та необхідним обладнанням.

**Структура:**
```sql
CREATE TABLE labwork_equipment (
    labwork_id BIGINT NOT NULL,
    equipment_id BIGINT NOT NULL,

    PRIMARY KEY (labwork_id, equipment_id),

    CONSTRAINT fk_labwork_equipment_labwork FOREIGN KEY (labwork_id)
        REFERENCES lab_works(id) ON DELETE CASCADE,
    CONSTRAINT fk_labwork_equipment_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment(id) ON DELETE CASCADE
);
```

**Поля:**
| Поле | Тип | Опис |
|------|-----|------|
| labwork_id | BIGINT | FK до lab_works(id) |
| equipment_id | BIGINT | FK до equipment(id) |

**Індекси:**
- PRIMARY KEY: `(labwork_id, equipment_id)`
- FOREIGN KEY: `labwork_id` → `lab_works(id)`
- FOREIGN KEY: `equipment_id` → `equipment(id)`

### 7. RESERVATION_EQUIPMENT (Many-to-Many)

**Опис:** Зв'язок між резерваціями та обладнанням.

**Структура:**
```sql
CREATE TABLE reservation_equipment (
    reservation_id BIGINT NOT NULL,
    equipment_id BIGINT NOT NULL,

    PRIMARY KEY (reservation_id, equipment_id),

    CONSTRAINT fk_reservation_equipment_reservation FOREIGN KEY (reservation_id)
        REFERENCES reservations(id) ON DELETE CASCADE,
    CONSTRAINT fk_reservation_equipment_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment(id) ON DELETE CASCADE
);
```

**Поля:**
| Поле | Тип | Опис |
|------|-----|------|
| reservation_id | BIGINT | FK до reservations(id) |
| equipment_id | BIGINT | FK до equipment(id) |

**Індекси:**
- PRIMARY KEY: `(reservation_id, equipment_id)`
- FOREIGN KEY: `reservation_id` → `reservations(id)`
- FOREIGN KEY: `equipment_id` → `equipment(id)`

## ORM Mapping (JPA/Hibernate)

### Entity Annotations

#### @Entity
Позначає клас як JPA entity.

```java
@Entity
@Table(name = "users")
public class User {
    // ...
}
```

#### @Id та @GeneratedValue
Визначають первинний ключ з автогенерацією.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

#### @Column
Налаштування колонок.

```java
@Column(nullable = false, unique = true)
private String username;

@Column(length = 1000)
private String description;
```

#### @Enumerated
Mapping для enum типів.

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private UserRole role;
```

#### @ManyToOne
Зв'язокMany-to-One.

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "lab_id")
private Lab lab;
```

#### @ManyToMany
Зв'язок Many-to-Many.

```java
@ManyToMany
@JoinTable(
    name = "labwork_equipment",
    joinColumns = @JoinColumn(name = "labwork_id"),
    inverseJoinColumns = @JoinColumn(name = "equipment_id")
)
private List<Equipment> requiredEquipment = new ArrayList<>();
```

#### @PrePersist та @PreUpdate
Автоматичне оновлення timestamp полів.

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
}

@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```

## Типи Зв'язків

### One-to-Many
- `Labs` → `Equipment` (одна лабораторія може мати багато обладнання)
- `Users` → `LabWorks` (один користувач може створити багато робіт)
- `Users` → `Reservations` (один користувач може мати багато резервацій)

### Many-to-One
- `Equipment` → `Lab` (багато обладнання належить одній лабораторії)
- `LabWork` → `User` (багато робіт створено одним користувачем)
- `Reservation` → `User` (багато резервацій створено одним користувачем)
- `Reservation` → `Lab` (багато резервацій для однієї лабораторії)

### Many-to-Many
- `LabWork` ↔ `Equipment` (робота потребує багато обладнання, обладнання використовується в багатьох роботах)
- `Reservation` ↔ `Equipment` (резервація включає багато обладнання, обладнання може бути в багатьох резерваціях)

## Cascading та Fetch Strategies

### Cascade Types
```java
// Видалення лабораторії → видалення всіх резервацій
@ManyToOne(optional = false, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
private Lab lab;
```

### Fetch Strategies
- **LAZY (default):** Дані завантажуються тільки при зверненні
- **EAGER:** Дані завантажуються одразу з entity

```java
// LAZY - краще для продуктивності
@ManyToOne(fetch = FetchType.LAZY)
private Lab lab;
```

## Hibernate Configuration

### application.properties
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/lab_system
spring.datasource.username=postgres
spring.datasource.password=7355

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### DDL Auto Strategies
- **create:** Видаляє та створює схему при старті
- **create-drop:** Видаляє схему при закритті
- **update:** Оновлює схему (рекомендовано для розробки)
- **validate:** Перевіряє схему без змін
- **none:** Нічого не робить

## Repository Layer

### Spring Data JPA Repositories

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}

public interface LabRepository extends JpaRepository<Lab, Long> {
    List<Lab> findByNameContainingIgnoreCase(String name);
}

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByLabId(Long labId);
    List<Equipment> findByStatus(EquipmentStatus status);
}

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByLabIdAndStartTimeBetween(
        Long labId,
        LocalDateTime start,
        LocalDateTime end
    );
}
```

## Нормалізація

База даних відповідає **3NF (Third Normal Form)**:
- ✅ 1NF: Всі поля атомарні
- ✅ 2NF: Немає часткових залежностей від ключів
- ✅ 3NF: Немає транзитивних залежностей

## Висновки

Структура бази даних:
- **Ефективна** - правильні індекси та зв'язки
- **Масштабована** - можливість додавання нових entity
- **Нормалізована** - відповідає 3NF
- **Гнучка** - підтримка різних типів зв'язків
- **Безпечна** - constraints та foreign keys

ORM (JPA/Hibernate):
- **Декларативний підхід** - annotations
- **Автоматична генерація схеми** - DDL auto
- **Type-safe queries** - Spring Data JPA
- **Lazy loading** - оптимізація продуктивності
- **Automatic timestamps** - @PrePersist/@PreUpdate
