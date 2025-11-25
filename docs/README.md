# Документація Курсової Роботи

**Система Управління Лабораторіями**
Курсова робота з дисципліни "Проектування Програмного Забезпечення"

---

## 📚 Зміст документації

Цей розділ містить повну технічну документацію проекту відповідно до вимог курсової роботи.

---

## 📋 Структура документації

### 1. Технічне завдання (5 балів)
📄 **[TECHNICAL_SPECIFICATION.md](TECHNICAL_SPECIFICATION.md)**

**Зміст:**
- Вступ та мета проекту
- Функціональні вимоги
  - Аутентифікація та авторизація
  - Управління лабораторіями
  - Управління обладнанням
  - Репозиторій проектів
  - Система замовлень
  - Панель адміністратора
- Нефункціональні вимоги
  - Продуктивність
  - Безпека
  - Надійність
  - Масштабованість
- Технічні обмеження та припущення
- Критерії приймання

**Ключові моменти:**
- Детальний опис всіх функціональних можливостей
- Вимоги до безпеки (JWT, BCrypt)
- Вимоги до продуктивності та доступності

---

### 2. Use Case діаграми (5 балів)
📄 **[USE_CASES.md](USE_CASES.md)**

**Зміст:**
- Актори системи
  - Student (Студент)
  - Admin (Адміністратор)
  - Curator (Куратор)
  - Laborant (Лаборант)
- Use Case діаграма загальна
- Детальні Use Cases:
  - UC-1: Аутентифікація користувача
  - UC-2: Перегляд каталогу обладнання
  - UC-3: Створення резервації
  - UC-4: Публікація проекту
  - UC-5: Оформлення замовлення
  - UC-6: Модерація проектів (Admin)
  - UC-7: Управління користувачами (Admin)

**Ключові моменти:**
- Визначення всіх акторів та їх ролей
- Опис взаємодії користувачів з системою
- Передумови та постумови для кожного Use Case
- Альтернативні сценарії

---

### 3. Проектування ORM та структури БД (10 балів)
📄 **[DATABASE_DESIGN.md](DATABASE_DESIGN.md)**

**Зміст:**
- ER-діаграма бази даних
- Опис таблиць:
  - users (користувачі)
  - labs (лабораторії)
  - equipment (обладнання)
  - reservations (резервації)
  - lab_works (проекти)
  - orders (замовлення)
  - news (новини)
- JPA Entity класи з анотаціями
- Relationships (One-to-Many, Many-to-One, Many-to-Many)
- Індекси та constraints
- Стратегії генерації ID
- Timestamps та аудит

**Ключові моменти:**
- PostgreSQL як СУБД
- Hibernate як ORM
- Використання JPA annotations
- Lazy/Eager loading стратегії
- Cascade operations

---

### 4. Wireframes інтерфейсу користувача (10 балів)
📄 **[WIREFRAMES.md](WIREFRAMES.md)**

**Зміст:**
- Огляд дизайн-системи
  - Кольорова палітра (CSS variables)
  - Компоненти (buttons, cards, forms, badges)
  - Layout система (page, container, grid)
- Wireframes головних сторінок:
  - LoginPage (сторінка логіну)
  - HomePage (головна сторінка)
  - RepositoryPage (репозиторій проектів)
  - ProjectDetailPage (деталі проекту)
  - EquipmentCatalogPage (каталог обладнання)
  - CartPage (кошик)
  - AdminPanelPage (панель адміністратора)
- Навігація та UX потоки
- Адаптивний дизайн (responsive breakpoints)
- Ключові UX принципи

**Ключові моменти:**
- Єдина CSS система з змінними
- Консистентний дизайн на всіх сторінках
- Адаптивність для різних пристроїв
- Доступність (accessibility)

---

### 5. Реалізація Front-End (10 балів)
📄 **[../frontend/README.md](../frontend/README.md)**

**Зміст:**
- Архітектура React додатку
  - Component structure
  - Routing (React Router)
  - State management (Context API)
  - API integration (Axios)
- Основні компоненти:
  - Layout components (Header, Navbar)
  - Page components
  - Routing components (PrivateRoute)
- Context API:
  - AuthContext (аутентифікація)
  - CartContext (кошик)
- TypeScript типізація
- Стилізація (CSS система)
- Build та deployment

**Ключові моменти:**
- React 18 + TypeScript
- Vite як build tool
- Axios для HTTP запитів
- JWT токени в localStorage
- Protected routes

---

### 6. Реалізація архітектури ПЗ на Java з SOLID (15 балів)
📄 **[../backend/README.md](../backend/README.md)**

**Зміст:**
- Layered Architecture:
  - Controller Layer (@RestController)
  - Service Layer (@Service)
  - Repository Layer (@Repository)
  - Domain Layer (@Entity)
- Застосування SOLID принципів:
  - Single Responsibility Principle
  - Open/Closed Principle
  - Liskov Substitution Principle
  - Interface Segregation Principle
  - Dependency Inversion Principle
- Spring Boot конфігурація
- Security (JWT)
- Exception handling
- Validation
- Transaction management

**Ключові моменти:**
- Spring Boot 3.3.4 + Java 17
- Spring Data JPA
- Spring Security
- Constructor injection
- Global exception handler

---

### 7. Архітектура ПЗ з патернами проектування (20 балів)
📄 **[PATTERNS.md](PATTERNS.md)**

**Зміст:**
- Creational Patterns:
  - Factory Pattern (NotificationFactory)
  - Builder Pattern (Lombok @Builder)
  - Singleton Pattern (Spring beans)
- Behavioral Patterns:
  - Strategy Pattern (ReservationValidator)
  - Observer Pattern (Spring Events)
- Structural Patterns:
  - Decorator Pattern (Security filters)
  - Proxy Pattern (JPA repositories)
- Architectural Patterns:
  - Layered Architecture
  - DTO Pattern
- Spring Framework Patterns:
  - Dependency Injection
  - Aspect-Oriented Programming (Transactions)

**Ключові моменти:**
- Детальні приклади коду для кожного патерну
- Діаграми структури
- Переваги використання кожного патерну
- Інтеграція з Spring Framework

---

### 8. Sequence діаграми головних процесів (10 балів)
📄 **[SEQUENCE_DIAGRAMS.md](SEQUENCE_DIAGRAMS.md)**

**Зміст:**
- Діаграми послідовностей для:
  - SD-1: Аутентифікація користувача
  - SD-2: Створення резервації лабораторії
  - SD-3: Оформлення замовлення обладнання
  - SD-4: Публікація проекту в репозиторій
  - SD-5: Відправка повідомлень (Observer Pattern)
- Для кожної діаграми:
  - Учасники (actors, components)
  - Послідовність викликів
  - Альтернативні сценарії
  - Повернення даних

**Ключові моменти:**
- Взаємодія між Frontend та Backend
- REST API calls
- Робота з базою даних
- Pattern implementations в дії
- Error handling flows

---

### 9. Docker контейнери та розгортання (10 балів)
📄 **[DEPLOYMENT.md](DEPLOYMENT.md)**

**Зміст:**
- Архітектура контейнерів:
  - Frontend container (Nginx + React build)
  - Backend container (Java + Spring Boot)
  - Database container (PostgreSQL)
- Docker Compose конфігурація
- Dockerfile для кожного сервісу
- Environment variables
- Volumes та networks
- Health checks
- Production deployment:
  - Build process
  - Environment configuration
  - Database migrations
  - Backup strategies
- CI/CD процес (концепція)
- Troubleshooting

**Ключові моменти:**
- Multi-container application
- Docker Compose orchestration
- Environment-based configuration
- Production-ready setup
- Easy deployment process

---

## 🎯 Критерії оцінювання

| № | Критерій | Бали | Статус | Документ |
|---|----------|------|--------|----------|
| 1 | Технічне завдання | 5 | ✅ Готово | [TECHNICAL_SPECIFICATION.md](TECHNICAL_SPECIFICATION.md) |
| 2 | Use Case діаграми | 5 | ✅ Готово | [USE_CASES.md](USE_CASES.md) |
| 3 | Проектування ORM та БД | 10 | ✅ Готово | [DATABASE_DESIGN.md](DATABASE_DESIGN.md) |
| 4 | Wireframes інтерфейсу | 10 | ✅ Готово | [WIREFRAMES.md](WIREFRAMES.md) |
| 5 | Реалізація Front-End | 10 | ✅ Готово | [../frontend/README.md](../frontend/README.md) |
| 6 | Архітектура на Java (SOLID) | 15 | ✅ Готово | [../backend/README.md](../backend/README.md) |
| 7 | Патерни проектування | 20 | ✅ Готово | [PATTERNS.md](PATTERNS.md) |
| 8 | Sequence діаграми | 10 | ✅ Готово | [SEQUENCE_DIAGRAMS.md](SEQUENCE_DIAGRAMS.md) |
| 9 | Docker та розгортання | 10 | ✅ Готово | [DEPLOYMENT.md](DEPLOYMENT.md) |
| 10 | Захист курсової роботи | 5 | 🟡 Очікується | - |
| | **ВСЬОГО** | **100** | | |

---

## 📊 Технічний стек

### Backend
- Java 17
- Spring Boot 3.3.4 (Web, Data JPA, Security, Validation, Actuator)
- PostgreSQL 16
- Hibernate ORM
- JWT Authentication
- Lombok
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Context API

### DevOps
- Docker
- Docker Compose
- Nginx
- Git

---

## 🚀 Швидкий старт

1. **Клонувати репозиторій:**
   ```bash
   git clone <repository-url>
   cd lab-system-full
   ```

2. **Запустити через Docker:**
   ```bash
   # Windows
   start.bat

   # Linux/Mac
   docker compose up -d --build
   ```

3. **Відкрити додаток:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

4. **Тестові дані:**
   - Admin: `admin` / `admin123`
   - Student: `student` / `student123`

---

## 📖 Додаткові ресурси

- **Головний README**: [../README.md](../README.md)
- **Backend детальна документація**: [../backend/README.md](../backend/README.md)
- **Frontend детальна документація**: [../frontend/README.md](../frontend/README.md)
- **API Endpoints**: Описані в [../backend/README.md](../backend/README.md)

---

## 📝 Примітки

Всі діаграми створені у текстовому форматі (ASCII art) для сумісності з Markdown.
Для захисту курсової рекомендується:
1. Ознайомитись з усіма розділами документації
2. Розуміти архітектурні рішення
3. Вміти пояснити вибір патернів проектування
4. Підготувати демонстрацію роботи системи

---

**Автор:** Курсова робота з дисципліни "Проектування Програмного Забезпечення"
**Рік:** 2024-2025
