# Система Управління Лабораторіями

Веб-система для управління лабораторіями, обладнанням та резервацією навчальних ресурсів.

## 📋 Зміст

- [Огляд проекту](#огляд-проекту)
- [Технології](#технології)
- [Архітектура](#архітектура)
- [Швидкий старт](#швидкий-старт)
- [Розгортання](#розгортання)
- [API Документація](#api-документація)
- [Структура проекту](#структура-проекту)
- [Патерни проектування](#патерни-проектування)
- [SOLID Принципи](#solid-принципи)
- [Тестові дані](#тестові-дані)

## 🎯 Огляд проекту

Система дозволяє:
- **Аутентифікація** - Реєстрація, вхід з JWT токенами
- **Управління лабораторіями** - Створення, редагування, видалення лабораторій
- **Управління обладнанням** - Додавання обладнання до лабораторій, відстеження статусу
- **Резервація** - Бронювання лабораторій для занять
- **Репозиторій проектів** - Зберігання та обмін навчальними проектами
- **Керування складом** - Каталог деталей, корзина, пресети
- **Документообіг** - Створення та підпис документів

## 🛠 Технології

### Backend
- **Java 17**
- **Spring Boot 3.3.4**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
  - Spring Actuator
- **PostgreSQL 16**
- **JWT** для аутентифікації
- **Maven** для збірки

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Axios** для HTTP запитів
- **React Router** для навігації

### DevOps
- **Docker** та **Docker Compose**
- **Nginx** для frontend
- **PostgreSQL** для бази даних

## 🏗 Архітектура

### Загальна архітектура

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│    Frontend     │─────▶│    Backend      │─────▶│   PostgreSQL    │
│  (React + TS)   │      │  (Spring Boot)  │      │    Database     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
   Port: 3000              Port: 8080                Port: 5432
```

### Backend Architecture (Layered)

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

## 🚀 Швидкий старт

### Вимоги

- Docker 20.10+
- Docker Compose 2.0+

### Встановлення та запуск

1. **Клонувати репозиторій:**
```bash
git clone <repository-url>
cd lab-system-full
```

2. **Налаштувати змінні оточення:**
```bash
cp .env.example .env
# Відредагуйте .env файл за необхідності
```

3. **Запустити проект:**
```bash
docker-compose up -d
```

4. **Перевірити статус:**
```bash
docker-compose ps
```

5. **Переглянути логи:**
```bash
docker-compose logs -f
```

Додаток буде доступний:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Backend Health: http://localhost:8080/actuator/health

### Зупинка

```bash
docker-compose down
```

### Повне очищення (включаючи дані БД)

```bash
docker-compose down -v
```

## 📦 Розгортання

### Production Build

1. **Оновити .env файл з production значеннями:**
```env
DB_PASSWORD=secure_password_here
JWT_SECRET=your_secure_jwt_secret
LOG_LEVEL=INFO
VITE_API_URL=https://your-domain.com/api
```

2. **Зібрати та запустити:**
```bash
docker-compose -f docker-compose.yml up -d --build
```

### Окремий запуск сервісів

**Тільки база даних:**
```bash
docker-compose up -d postgres
```

**Backend:**
```bash
docker-compose up -d backend
```

**Frontend:**
```bash
docker-compose up -d frontend
```

## 📚 API Документація

### Аутентифікація

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

### Лабораторії

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

### Обладнання

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

### Резервації

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

Повну документацію API дивіться в [backend/README.md](backend/README.md)

## 📁 Структура проекту

```
lab-system-full/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       └── java/com/example/labsystem/
│   │           ├── config/          # Конфігурація
│   │           ├── controller/      # REST контролери
│   │           ├── domain/          # Entity класи
│   │           ├── dto/             # Data Transfer Objects
│   │           ├── exception/       # Обробка винятків
│   │           ├── mapper/          # Мапери Entity ↔ DTO
│   │           ├── pattern/         # Design Patterns
│   │           ├── repository/      # JPA repositories
│   │           ├── security/        # JWT Security
│   │           └── service/         # Бізнес-логіка
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── api/                # API клієнти
│   │   ├── components/         # React компоненти
│   │   ├── context/            # React Context
│   │   ├── pages/              # Сторінки
│   │   ├── router/             # Routing
│   │   └── types/              # TypeScript типи
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml          # Docker Compose конфігурація
├── .env                        # Змінні оточення (не в git)
├── .env.example                # Приклад змінних оточення
├── .gitignore
└── README.md                   # Цей файл
```

## 🎨 Патерни проектування

### 1. Factory Pattern
**Застосування:** Створення різних типів повідомлень (Email, SMS)

```java
NotificationFactory factory = ...;
Notification notification = factory.getNotification("EMAIL");
notification.send(recipient, message);
```

### 2. Strategy Pattern
**Застосування:** Валідація резервацій з різними правилами

```java
ReservationValidator validator = ...;
validator.validateAll(reservation);
```

**Стратегії:**
- `TimeSlotValidationStrategy` - перевірка часового слоту
- `DurationValidationStrategy` - перевірка тривалості

### 3. Observer Pattern
**Застосування:** Сповіщення про події резервацій

```java
eventPublisher.publishEvent(new ReservationEvent(
    reservation,
    ReservationEventType.CREATED,
    username
));
```

### 4. Builder Pattern
**Застосування:** Створення domain entities через Lombok `@Builder`

```java
Equipment equipment = Equipment.builder()
    .name("Dell OptiPlex")
    .inventoryNumber("PC-001")
    .status(EquipmentStatus.AVAILABLE)
    .build();
```

## 📐 SOLID Принципи

### Single Responsibility Principle (SRP)
Кожен клас має одну відповідальність:
- `UserService` - робота з користувачами
- `AuthService` - аутентифікація
- `ReservationService` - резервації

### Open/Closed Principle (OCP)
- Легко додавати нові стратегії валідації
- Легко додавати нові типи повідомлень

### Liskov Substitution Principle (LSP)
- Всі реалізації `Notification` взаємозамінні
- Всі реалізації `ReservationValidationStrategy` взаємозамінні

### Interface Segregation Principle (ISP)
- Вузькі інтерфейси: `Notification`, `ReservationValidationStrategy`

### Dependency Inversion Principle (DIP)
- Сервіси залежать від абстракцій (Repository interfaces)
- Constructor injection через `@RequiredArgsConstructor`

## 🔧 Тестові дані

При запуску автоматично створюються:

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

## 🔒 Безпека

- JWT токени з терміном дії (1 година)
- Паролі хешуються через BCrypt
- CORS налаштовано для frontend
- Role-based access control (ADMIN, STUDENT)

## 📊 Database Schema

### Users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
```

### Labs
```sql
CREATE TABLE labs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT
);
```

### Equipment
```sql
CREATE TABLE equipment (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    inventory_number VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    lab_id BIGINT REFERENCES labs(id)
);
```

### Reservations
```sql
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    lab_id BIGINT NOT NULL REFERENCES labs(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT,
    status VARCHAR(50) NOT NULL
);
```

## 🐛 Troubleshooting

### Проблеми з запуском

**Порти зайняті:**
```bash
# Змініть порти в .env файлі
FRONTEND_PORT=3001
BACKEND_PORT=8081
DB_PORT=5433
```

**База даних не запускається:**
```bash
# Очистити дані БД та перезапустити
docker-compose down -v
docker-compose up -d postgres
```

**Backend не може підключитися до БД:**
```bash
# Перевірити логи
docker-compose logs postgres
docker-compose logs backend

# Переконайтеся, що БД повністю запустилася
docker-compose ps
```

## 📝 Ліцензія

MIT License

## 👨‍💻 Автор

Курсова робота з дисципліни "Проектування Програмного Забезпечення"

---

**Примітка:** Для детальної інформації про backend та frontend дивіться відповідні README файли:
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
