# Документація Системи Управління Лабораторіями

## Зміст документації

### 1. [Технічне Завдання](TECHNICAL_SPECIFICATION.md)
Повний опис системи, функціональні та нефункціональні вимоги, технічний стек, архітектура.

**Включає:**
- Загальні відомості про проект
- Цілі та завдання
- Функціональні вимоги
- Нефункціональні вимоги (продуктивність, безпека, масштабованість)
- Архітектура системи
- Патерни проектування (Factory, Strategy, Observer, Builder)
- SOLID принципи
- Технічний стек
- API endpoints
- Оцінка виконання курсової роботи

### 2. [Use Case Діаграми](USE_CASES.md)
Сценарії використання системи різними користувачами.

**Охоплює:**
- Аутентифікація
- Управління лабораторіями (Адміністратор)
- Резервація лабораторії (Студент)
- Управління обладнанням (Адміністратор/Лаборант)
- Погодження резервації (Адміністратор)
- Перегляд обладнання (Студент)
- Повна Use Case діаграма системи

### 3. [Проектування ORM та Структури БД](DATABASE_DESIGN.md)
Детальний опис бази даних, схеми, зв'язків та ORM mapping.

**Включає:**
- ER діаграма
- Опис всіх таблиць з полями та типами
- Індекси та constraints
- Enum values
- ORM mapping (JPA/Hibernate annotations)
- Типи зв'язків (One-to-Many, Many-to-One, Many-to-Many)
- Cascading та Fetch Strategies
- Hibernate конфігурація
- Repository Layer (Spring Data JPA)
- Нормалізація (3NF)

### 4. [Sequence Діаграми](SEQUENCE_DIAGRAMS.md)
Діаграми послідовності для головних процесів системи.

**Процеси:**
- Процес аутентифікації (успішний логін, невірний пароль)
- Процес створення резервації
- Процес погодження резервації
- Процес додавання обладнання
- Процес отримання списку лабораторій
- Процес відхилення резервації

### 5. [Інструкція з Розгортання](DEPLOYMENT.md)
Детальна інструкція з встановлення та розгортання системи.

**Розділи:**
- Вимоги до системи
- Встановлення залежностей (Linux, macOS, Windows)
- Швидкий старт
- Детальна конфігурація (.env файл)
- Розгортання для розробки
- Production розгортання
- HTTPS налаштування
- Моніторинг та логування
- Troubleshooting (вирішення проблем)
- Backup та відновлення
- Оновлення системи
- Масштабування
- Безпека Production

## Структура проекту

```
lab-system-full/
├── backend/                    # Spring Boot Backend
│   ├── src/                   # Java source код
│   ├── Dockerfile             # Docker образ backend
│   ├── pom.xml               # Maven конфігурація
│   └── README.md             # Backend документація
│
├── frontend/                   # React Frontend
│   ├── src/                   # TypeScript source код
│   ├── Dockerfile             # Docker образ frontend
│   ├── package.json          # NPM залежності
│   └── README.md             # Frontend документація
│
├── docs/                       # Документація (цей каталог)
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── USE_CASES.md
│   ├── DATABASE_DESIGN.md
│   ├── SEQUENCE_DIAGRAMS.md
│   ├── DEPLOYMENT.md
│   └── README.md             # Цей файл
│
├── docker-compose.yml          # Docker Compose конфігурація
├── .env                        # Змінні оточення (не в git)
├── .env.example                # Приклад змінних оточення
├── .gitignore
├── Makefile                    # Команди для зручності
└── README.md                   # Головний README проекту
```

## Швидкі посилання

### Для розробників
- [Головний README](../README.md) - Початок роботи з проектом
- [Backend README](../backend/README.md) - Backend специфічна документація
- [Frontend README](../frontend/README.md) - Frontend специфічна документація

### Для архітекторів
- [Технічне Завдання](TECHNICAL_SPECIFICATION.md) - Повний технічний опис
- [База Даних](DATABASE_DESIGN.md) - Схема та ORM
- [Sequence Діаграми](SEQUENCE_DIAGRAMS.md) - Потоки виконання

### Для DevOps
- [Розгортання](DEPLOYMENT.md) - Інструкції з встановлення та налаштування
- [docker-compose.yml](../docker-compose.yml) - Docker конфігурація

### Для бізнес-аналітиків
- [Use Cases](USE_CASES.md) - Сценарії використання
- [Технічне Завдання](TECHNICAL_SPECIFICATION.md) - Функціональні вимоги

## Ключові технології

### Backend
- Java 17
- Spring Boot 3.3.4 (Web, Data JPA, Security, Validation, Actuator)
- PostgreSQL 16
- JWT Authentication
- Maven

### Frontend
- React 18
- TypeScript 5
- Vite
- Axios
- React Router

### DevOps
- Docker & Docker Compose
- Nginx
- PostgreSQL

## Патерни проектування

Система реалізує 4 основних патерни:

1. **Factory Pattern** - Створення повідомлень
2. **Strategy Pattern** - Валідація резервацій
3. **Observer Pattern** - Система подій
4. **Builder Pattern** - Створення entity об'єктів

Детальніше в [Технічному Завданні](TECHNICAL_SPECIFICATION.md#53-патерни-проектування)

## SOLID Принципи

Всі принципи SOLID дотримані:
- **S** - Single Responsibility
- **O** - Open/Closed
- **L** - Liskov Substitution
- **I** - Interface Segregation
- **D** - Dependency Inversion

Детальніше в [Технічному Завданні](TECHNICAL_SPECIFICATION.md#54-solid-принципи)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід

### Labs
- `GET /api/labs` - Список лабораторій
- `POST /api/labs` - Створення (ADMIN)
- `PUT /api/labs/{id}` - Оновлення (ADMIN)
- `DELETE /api/labs/{id}` - Видалення (ADMIN)

### Equipment
- `GET /api/equipment/lab/{labId}` - Обладнання лабораторії
- `POST /api/equipment` - Додавання (ADMIN)

### Reservations
- `POST /api/reservations` - Створення резервації
- `GET /api/reservations/my` - Мої резервації
- `PUT /api/reservations/{id}/status` - Зміна статусу (ADMIN)

Повна документація API в [README.md](../README.md#-api-документація)

## Тестові дані

При запуску автоматично створюються:

**Користувачі:**
- Admin: `admin` / `admin123`
- Student: `student` / `student123`

**Лабораторії:**
1. Computer Lab A (30 місць)
2. Physics Lab (20 місць)
3. Chemistry Lab (25 місць)

**Обладнання:**
1. Dell OptiPlex 7090 (AVAILABLE)
2. HP ProDesk 600 (AVAILABLE)
3. Lenovo ThinkCentre (MAINTENANCE)

## Контакти та підтримка

### Для питань по проекту:
- Перегляньте документацію вище
- Створіть issue на GitHub
- Перегляньте [Troubleshooting](DEPLOYMENT.md#troubleshooting)

### Для контрибуції:
1. Fork репозиторій
2. Створіть feature branch
3. Коміт змін
4. Push до branch
5. Створіть Pull Request

## Ліцензія

MIT License

## Автор

Курсова робота з дисципліни "Проектування Програмного Забезпечення"

---

**Остання актуалізація:** 2024

**Версія документації:** 1.0
