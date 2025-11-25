# Система Управління Лабораторіями

**Курсова робота** з дисципліни "Проектування Програмного Забезпечення"

Веб-система для управління лабораторіями, обладнанням, резервацією навчальних ресурсів та репозиторієм проектів.

---

## 📋 Зміст

- [Огляд проекту](#огляд-проекту)
- [Швидкий старт](#швидкий-старт)
- [Документація курсової роботи](#документація-курсової-роботи)
- [Технології](#технології)
- [Архітектура системи](#архітектура-системи)
- [Структура проекту](#структура-проекту)
- [Автор](#автор)

---

## 🎯 Огляд проекту

### Функціональні можливості системи:

#### 1️⃣ Аутентифікація та авторизація
- Реєстрація нових користувачів
- Вхід в систему з JWT токенами
- Розмежування прав доступу (ADMIN, STUDENT, CURATOR, LABORANT)

#### 2️⃣ Управління лабораторіями
- Створення, редагування та видалення лабораторій
- Перегляд списку лабораторій
- Фільтрація та пошук

#### 3️⃣ Управління обладнанням
- Каталог обладнання з деталями
- Відстеження статусу (Доступно, В використанні, На обслуговуванні)
- Кошик для резервації обладнання
- Збережені пресети обладнання

#### 4️⃣ Репозиторій проектів
- Створення та публікація навчальних проектів
- Прикріплення необхідного обладнання до проекту
- Коментування проектів
- Публічні та приватні проекти

#### 5️⃣ Система замовлень
- Оформлення замовлень на обладнання
- Відстеження статусу замовлень
- Бронювання на 24 години

#### 6️⃣ Панель адміністратора
- Управління користувачами
- Управління групами студентів
- Модерація проектів

---

## 🚀 Швидкий старт

### Вимоги

- **Docker** 20.10+ та **Docker Compose** 2.0+
- Або альтернативно:
  - Java 17+
  - Node.js 18+
  - PostgreSQL 16+

### Запуск через Docker (рекомендовано)

#### Windows:
```bash
start.bat
```

#### Linux/Mac:
```bash
docker compose up -d --build
```

### Доступ до системи

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Database:** localhost:5432

### Тестові облікові записи

| Роль    | Логін   | Пароль     |
|---------|---------|------------|
| Admin   | admin   | admin123   |
| Student | student | student123 |

---

## 📚 Документація курсової роботи

Вся документація розташована в папці [`docs/`](docs/):

### 1. Технічне завдання (5 балів)
📄 [TECHNICAL_SPECIFICATION.md](docs/TECHNICAL_SPECIFICATION.md)
- Опис вимог до системи
- Функціональні та нефункціональні вимоги
- Обмеження та припущення

### 2. Use Case діаграми (5 балів)
📄 [USE_CASES.md](docs/USE_CASES.md)
- Діаграми варіантів використання
- Опис акторів системи
- Детальний опис кожного Use Case

### 3. Проектування ORM та структури БД (10 балів)
📄 [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md)
- ER-діаграма бази даних
- Опис таблиць та зв'язків
- JPA Entity класи та анотації
- Стратегії зберігання та індексування

### 4. Wireframes інтерфейсу користувача (10 балів)
📄 [WIREFRAMES.md](docs/WIREFRAMES.md)
- Макети всіх основних сторінок
- Опис навігації та UX потоків
- Адаптивний дизайн

### 5. Реалізація Front-End (10 балів)
📄 [frontend/README.md](frontend/README.md)
- Архітектура React додатку
- Компоненти та їх структура
- Робота з API
- Стилізація та CSS система

### 6. Реалізація архітектури ПЗ на Java з SOLID (15 балів)
📄 [backend/README.md](backend/README.md)
- Layered Architecture (Controller → Service → Repository → Domain)
- Застосування SOLID принципів
- Dependency Injection через Spring
- Обробка помилок та валідація

### 7. Архітектура ПЗ з патернами проектування (20 балів)
📄 [PATTERNS.md](docs/PATTERNS.md)
- Factory Pattern (NotificationFactory)
- Strategy Pattern (ReservationValidator)
- Observer Pattern (Events)
- Builder Pattern (Domain entities)
- Singleton Pattern (Spring beans)

### 8. Sequence діаграми головних процесів (10 балів)
📄 [SEQUENCE_DIAGRAMS.md](docs/SEQUENCE_DIAGRAMS.md)
- Аутентифікація користувача
- Створення резервації
- Оформлення замовлення обладнання
- Публікація проекту

### 9. Docker контейнери та розгортання (10 балів)
📄 [DEPLOYMENT.md](docs/DEPLOYMENT.md)
- Конфігурація Docker Compose
- Налаштування контейнерів (Frontend, Backend, Database)
- CI/CD процес
- Production deployment

---

## 🛠 Технології

### Backend
- **Java 17** - мова програмування
- **Spring Boot 3.3.4** - framework
  - Spring Web (REST API)
  - Spring Data JPA (ORM)
  - Spring Security (JWT)
  - Spring Validation
  - Spring Actuator (моніторинг)
- **PostgreSQL 16** - база даних
- **Hibernate** - ORM реалізація
- **Lombok** - зменшення boilerplate коду
- **Maven** - система збірки

### Frontend
- **React 18** - UI бібліотека
- **TypeScript** - типізація
- **Vite** - build tool
- **React Router** - маршрутизація
- **Axios** - HTTP клієнт
- **Context API** - управління станом

### DevOps
- **Docker** - контейнеризація
- **Docker Compose** - оркестрація
- **Nginx** - веб-сервер для frontend
- **PostgreSQL** - СУБД в контейнері

---

## 🏗 Архітектура системи

### Загальна архітектура (3-tier)

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│                    (React + TypeScript)                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│   │  Pages   │  │Components│  │ Context  │  │  Router  │ │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST (Axios)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│                    (Spring Boot + Java)                     │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│   │ Controllers  │  │   Services   │  │  Repositories│   │
│   │  (REST API)  │─▶│ (Business    │─▶│    (JPA)     │   │
│   │              │  │   Logic)     │  │              │   │
│   └──────────────┘  └──────────────┘  └──────────────┘   │
│          │                  │                  │           │
│   ┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────┐  │
│   │   DTOs      │  │    Patterns     │  │  Security  │  │
│   │  (Mappers)  │  │   (Factory,     │  │   (JWT)    │  │
│   │             │  │   Strategy...)  │  │            │  │
│   └─────────────┘  └─────────────────┘  └────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ JDBC
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│                   (PostgreSQL Database)                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│   │  Users   │  │   Labs   │  │Equipment │  │Reserv-ns │ │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Backend Layered Architecture

```
┌─────────────────────────────────────────────┐
│         Controller Layer                    │
│  - @RestController                          │
│  - HTTP endpoints (GET, POST, PUT, DELETE)  │
│  - Request/Response handling                │
│  - DTO validation (@Valid)                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Service Layer                       │
│  - @Service                                 │
│  - Business logic                           │
│  - Transaction management (@Transactional)  │
│  - Entity ↔ DTO mapping                     │
│  - Pattern implementations                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Repository Layer                    │
│  - @Repository (JPA)                        │
│  - Database operations (CRUD)               │
│  - Custom queries (@Query)                  │
│  - Specifications for filtering             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Domain Layer                        │
│  - @Entity classes                          │
│  - JPA annotations                          │
│  - Relationships (@OneToMany, etc.)         │
│  - Lombok builders                          │
└─────────────────────────────────────────────┘
```

---

## 📁 Структура проекту

```
lab-system-full/
│
├── backend/                           # Spring Boot Backend
│   ├── src/main/java/com/example/labsystem/
│   │   ├── config/                   # Конфігурація Spring
│   │   │   ├── DataInitializer.java  # Ініціалізація тестових даних
│   │   │   ├── CorsConfig.java       # CORS налаштування
│   │   │   └── SecurityConfig.java   # Security конфігурація
│   │   │
│   │   ├── controller/               # REST контролери
│   │   │   ├── AuthController.java
│   │   │   ├── LabController.java
│   │   │   ├── EquipmentController.java
│   │   │   └── ReservationController.java
│   │   │
│   │   ├── domain/                   # Entity класи (Domain Model)
│   │   │   ├── User.java
│   │   │   ├── Lab.java
│   │   │   ├── Equipment.java
│   │   │   └── Reservation.java
│   │   │
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── request/              # Request DTOs
│   │   │   └── response/             # Response DTOs
│   │   │
│   │   ├── exception/                # Обробка винятків
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   └── ResourceNotFoundException.java
│   │   │
│   │   ├── mapper/                   # Мапери Entity ↔ DTO
│   │   │   ├── LabMapper.java
│   │   │   └── EquipmentMapper.java
│   │   │
│   │   ├── pattern/                  # Design Patterns
│   │   │   ├── factory/              # Factory Pattern
│   │   │   ├── strategy/             # Strategy Pattern
│   │   │   └── observer/             # Observer Pattern
│   │   │
│   │   ├── repository/               # JPA Repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── LabRepository.java
│   │   │   └── EquipmentRepository.java
│   │   │
│   │   ├── security/                 # Security & JWT
│   │   │   ├── JwtUtil.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   │
│   │   └── service/                  # Бізнес-логіка
│   │       ├── AuthService.java
│   │       ├── LabService.java
│   │       └── ReservationService.java
│   │
│   ├── Dockerfile                    # Backend Docker образ
│   ├── pom.xml                       # Maven dependencies
│   └── README.md                     # Backend документація
│
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── api/                      # API клієнти (Axios)
│   │   │   ├── authApi.ts
│   │   │   ├── labsApi.ts
│   │   │   └── equipmentApi.ts
│   │   │
│   │   ├── components/               # React компоненти
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── routing/
│   │   │       └── PrivateRoute.tsx
│   │   │
│   │   ├── context/                  # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   │
│   │   ├── pages/                    # Сторінки
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RepositoryPage.tsx
│   │   │   ├── EquipmentCatalogPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   └── AdminPanelPage.tsx
│   │   │
│   │   ├── router/                   # Маршрутизація
│   │   │   └── AppRouter.tsx
│   │   │
│   │   ├── types/                    # TypeScript типи
│   │   │   ├── Lab.ts
│   │   │   ├── Equipment.ts
│   │   │   └── User.ts
│   │   │
│   │   ├── App.tsx                   # Головний компонент
│   │   ├── App.css                   # Стилі
│   │   └── main.tsx                  # Entry point
│   │
│   ├── Dockerfile                    # Frontend Docker образ
│   ├── nginx.conf                    # Nginx конфігурація
│   ├── package.json                  # NPM dependencies
│   └── README.md                     # Frontend документація
│
├── docs/                              # Документація курсової
│   ├── README.md                     # Загальний огляд документації
│   ├── TECHNICAL_SPECIFICATION.md    # Технічне завдання
│   ├── USE_CASES.md                  # Use Case діаграми
│   ├── DATABASE_DESIGN.md            # Структура БД та ORM
│   ├── WIREFRAMES.md                 # Wireframes UI
│   ├── PATTERNS.md                   # Патерни проектування
│   ├── SEQUENCE_DIAGRAMS.md          # Sequence діаграми
│   └── DEPLOYMENT.md                 # Docker та розгортання
│
├── docker-compose.yml                # Docker Compose конфігурація
├── .env.example                      # Приклад змінних оточення
├── start.bat                         # Скрипт запуску (Windows)
├── .gitignore                        # Git ignore правила
└── README.md                         # Цей файл
```

---

## 🔒 Безпека

- **JWT Authentication** - токени з терміном дії 1 година
- **BCrypt** - хешування паролів
- **CORS** - налаштовано для frontend
- **Role-based Access Control** - розмежування прав за ролями
- **Input Validation** - валідація всіх вхідних даних

---

## 🐛 Troubleshooting

### Порти зайняті
```bash
# Змініть порти в .env файлі
FRONTEND_PORT=3001
BACKEND_PORT=8081
DB_PORT=5433
```

### База даних не запускається
```bash
docker compose down -v
docker compose up -d postgres
```

### Перегляд логів
```bash
# Всі сервіси
docker compose logs -f

# Окремий сервіс
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

---

## 👨‍💻 Автор

**Курсова робота**
Дисципліна: Проектування Програмного Забезпечення
Рік: 2024-2025

---

## 📊 Критерії оцінювання

| № | Критерій | Бали | Документ |
|---|----------|------|----------|
| 1 | Технічне завдання | 5 | [TECHNICAL_SPECIFICATION.md](docs/TECHNICAL_SPECIFICATION.md) |
| 2 | Use Case діаграми | 5 | [USE_CASES.md](docs/USE_CASES.md) |
| 3 | Проектування ORM та БД | 10 | [DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) |
| 4 | Wireframes інтерфейсу | 10 | [WIREFRAMES.md](docs/WIREFRAMES.md) |
| 5 | Реалізація Front-End | 10 | [frontend/README.md](frontend/README.md) |
| 6 | Архітектура на Java (SOLID) | 15 | [backend/README.md](backend/README.md) |
| 7 | Патерни проектування | 20 | [PATTERNS.md](docs/PATTERNS.md) |
| 8 | Sequence діаграми | 10 | [SEQUENCE_DIAGRAMS.md](docs/SEQUENCE_DIAGRAMS.md) |
| 9 | Docker та розгортання | 10 | [DEPLOYMENT.md](docs/DEPLOYMENT.md) |
| 10 | Захист курсової роботи | 5 | - |
| | **ВСЬОГО** | **100** | |

---

## 📞 Додаткова інформація

- Детальна backend документація: [backend/README.md](backend/README.md)
- Детальна frontend документація: [frontend/README.md](frontend/README.md)
- Повна документація курсової: [docs/README.md](docs/README.md)
