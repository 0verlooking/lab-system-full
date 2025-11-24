# 📡 API ENDPOINTS - Швидкий довідник

## 🔐 Аутентифікація

```bash
# Логін
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Відповідь: {"token": "...", "role": "ADMIN", "username": "admin"}
```

## 👥 Користувачі

```bash
# Поточний користувач (потрібен token)
curl http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🏢 Лабораторії

```bash
# Список лабораторій
curl http://localhost:8080/api/labs \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити лабораторію (ADMIN only)
curl -X POST http://localhost:8080/api/labs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Лабораторія IoT",
    "location": "Корпус 2, кімната 301",
    "capacity": 20,
    "description": "Лабораторія для роботи з IoT пристроями"
  }'
```

## 🔧 Обладнання

```bash
# Обладнання лабораторії
curl http://localhost:8080/api/equipment/lab/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Додати обладнання
curl -X POST http://localhost:8080/api/equipment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arduino Uno",
    "inventoryNumber": "ARD-2024-001",
    "status": "AVAILABLE",
    "labId": 1
  }'
```

## 📚 Проекти (LabWorks)

```bash
# Всі опубліковані проекти
curl http://localhost:8080/api/labworks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Мої проекти
curl http://localhost:8080/api/labworks/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити проект
curl -X POST http://localhost:8080/api/labworks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Розумний будинок",
    "description": "Система автоматизації будинку на Arduino",
    "equipmentIds": [1, 2, 3]
  }'
```

## 👨‍🎓 Групи (НОВЕ!)

```bash
# Список груп
curl http://localhost:8080/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити групу (CURATOR/ADMIN)
curl -X POST http://localhost:8080/api/groups \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "КІ-21",
    "description": "Комп\'ютерна інженерія, 2 курс, 1 група",
    "enrollmentYear": 2023,
    "active": true
  }'
```

## 💬 Коментарі (НОВЕ!)

```bash
# Коментарі до проекту
curl http://localhost:8080/api/comments/labwork/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Додати коментар
curl -X POST http://localhost:8080/api/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Чудовий проект!",
    "labWorkId": 1
  }'

# Відповісти на коментар
curl -X POST http://localhost:8080/api/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Дякую!",
    "labWorkId": 1,
    "parentCommentId": 1
  }'
```

## 🛒 Замовлення/Кошик (НОВЕ!)

```bash
# Мої замовлення
curl http://localhost:8080/api/orders/my \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити замовлення
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "labWorkId": 1,
    "notes": "Потрібно для курсового проекту"
  }'

# Зарезервувати (24 години)
curl -X POST http://localhost:8080/api/orders/1/reserve \
  -H "Authorization: Bearer YOUR_TOKEN"

# Погодити замовлення (LABORANT/ADMIN)
curl -X POST http://localhost:8080/api/orders/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN"

# Відхилити замовлення (LABORANT/ADMIN)
curl -X POST http://localhost:8080/api/orders/1/reject \
  -H "Authorization: Bearer YOUR_TOKEN"

# Список на погодження (LABORANT/ADMIN)
curl http://localhost:8080/api/orders/pending \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📰 Новини (НОВЕ!)

```bash
# Активні новини
curl http://localhost:8080/api/news \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити новину (CURATOR/ADMIN)
curl -X POST http://localhost:8080/api/news \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Нове обладнання!",
    "content": "У лабораторію надійшли нові Arduino Mega",
    "type": "NEW_EQUIPMENT",
    "priority": 5
  }'

# Опублікувати новину (CURATOR/ADMIN)
curl -X POST http://localhost:8080/api/news/1/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 Резервації

```bash
# Мої резервації
curl http://localhost:8080/api/reservations/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Створити резервацію
curl -X POST http://localhost:8080/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "labId": 1,
    "labWorkId": 1,
    "equipmentIds": [1, 2],
    "startTime": "2024-12-01T10:00:00",
    "endTime": "2024-12-01T14:00:00",
    "purpose": "Виконання лабораторної роботи"
  }'

# Погодити резервацію (ADMIN)
curl -X POST http://localhost:8080/api/reservations/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Швидкий тест

1. **Отримати токен:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' | jq -r .token)
```

2. **Перевірити лабораторії:**
```bash
curl http://localhost:8080/api/labs -H "Authorization: Bearer $TOKEN" | jq
```

3. **Перевірити новини:**
```bash
curl http://localhost:8080/api/news -H "Authorization: Bearer $TOKEN" | jq
```

4. **Перевірити групи:**
```bash
curl http://localhost:8080/api/groups -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🔑 Ролі та доступ

| Endpoint | ADMIN | CURATOR | LABORANT | STUDENT |
|----------|-------|---------|----------|---------|
| GET /api/groups | ✅ | ✅ | ✅ | ✅ |
| POST /api/groups | ✅ | ✅ | ❌ | ❌ |
| POST /api/news | ✅ | ✅ | ❌ | ❌ |
| POST /api/orders/approve | ✅ | ❌ | ✅ | ❌ |
| POST /api/comments | ✅ | ✅ | ✅ | ✅ |

**Всі інші GET endpoints доступні всім авторизованим користувачам!**
