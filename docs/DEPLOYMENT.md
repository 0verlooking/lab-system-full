# Інструкція з Розгортання Системи

## Зміст
- [Вимоги до системи](#вимоги-до-системи)
- [Встановлення залежностей](#встановлення-залежностей)
- [Швидкий старт](#швидкий-старт)
- [Детальна конфігурація](#детальна-конфігурація)
- [Розгортання для розробки](#розгортання-для-розробки)
- [Production розгортання](#production-розгортання)
- [Моніторинг та логування](#моніторинг-та-логування)
- [Troubleshooting](#troubleshooting)
- [Backup та відновлення](#backup-та-відновлення)

## Вимоги до системи

### Мінімальні вимоги
- **CPU:** 2 cores
- **RAM:** 2 GB
- **Disk:** 10 GB вільного місця
- **OS:** Linux, macOS, Windows 10+

### Рекомендовані вимоги
- **CPU:** 4+ cores
- **RAM:** 4+ GB
- **Disk:** 20+ GB SSD
- **OS:** Linux (Ubuntu 20.04+, CentOS 8+)

### Програмне забезпечення
- **Docker:** 20.10+ ([Встановити](https://docs.docker.com/get-docker/))
- **Docker Compose:** 2.0+ ([Встановити](https://docs.docker.com/compose/install/))
- **Git:** 2.0+ ([Встановити](https://git-scm.com/downloads))

## Встановлення залежностей

### Linux (Ubuntu/Debian)

```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Додавання користувача до групи docker
sudo usermod -aG docker $USER
newgrp docker

# Встановлення Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Встановлення Git
sudo apt install git -y

# Перевірка встановлення
docker --version
docker-compose --version
git --version
```

### macOS

```bash
# Встановіть Docker Desktop для Mac
# https://docs.docker.com/desktop/install/mac-install/

# Встановіть Homebrew (якщо ще не встановлений)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Встановіть Git через Homebrew
brew install git

# Перевірка
docker --version
docker-compose --version
git --version
```

### Windows

1. Встановіть [Docker Desktop для Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Встановіть [Git для Windows](https://git-scm.com/download/win)
3. Використовуйте PowerShell або Git Bash для команд

## Швидкий старт

### 1. Клонування репозиторію

```bash
# Клонування проекту
git clone https://github.com/0verlooking/lab-system-full.git
cd lab-system-full

# Альтернативно: завантажте ZIP архів та розпакуйте
```

### 2. Налаштування змінних оточення

```bash
# Копіювання прикладу конфігурації
cp .env.example .env

# Редагування конфігурації (необов'язково для розробки)
nano .env  # або vim, notepad++, тощо
```

### 3. Запуск системи

```bash
# Збірка та запуск всіх сервісів
docker-compose up -d

# Перегляд статусу
docker-compose ps

# Очікуваний вивід:
# NAME                    STATUS         PORTS
# lab-system-backend      Up (healthy)   0.0.0.0:8080->8080/tcp
# lab-system-db           Up (healthy)   0.0.0.0:5432->5432/tcp
# lab-system-frontend     Up (healthy)   0.0.0.0:3000->80/tcp
```

### 4. Перевірка доступу

Відкрийте в браузері:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/actuator/health
- **API Docs:** http://localhost:8080/api

**Тестові облікові записи:**
- Admin: `admin` / `admin123`
- Student: `student` / `student123`

### 5. Перегляд логів

```bash
# Логи всіх сервісів
docker-compose logs -f

# Логи конкретного сервісу
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 6. Зупинка системи

```bash
# Зупинити всі сервіси
docker-compose down

# Зупинити та видалити volumes (ВИДАЛИТЬ ВСІ ДАНІ!)
docker-compose down -v
```

## Детальна конфігурація

### Файл .env

```bash
# Database Configuration
DB_NAME=lab_system               # Назва бази даних
DB_USER=postgres                 # Користувач PostgreSQL
DB_PASSWORD=7355                 # Пароль (ЗМІНІТЬ для production!)
DB_PORT=5432                     # Порт PostgreSQL

# Backend Configuration
BACKEND_PORT=8080                # Порт для backend API
JWT_SECRET=$2a$10$R9rlQ...      # JWT секретний ключ (ЗГЕНЕРУЙТЕ НОВИЙ!)
JWT_EXPIRATION=3600000           # Час життя токену (мс, 1 година)
LOG_LEVEL=DEBUG                  # Рівень логування (DEBUG/INFO/WARN/ERROR)

# Frontend Configuration
FRONTEND_PORT=3000               # Порт для frontend
VITE_API_URL=http://localhost:8080  # URL backend API

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://frontend:80  # Дозволені домени
```

### Генерація JWT Secret

```bash
# Linux/macOS
openssl rand -base64 32

# Або через BCrypt Generator
# https://bcrypt-generator.com/

# Вставте згенерований ключ в .env як JWT_SECRET
```

### Налаштування портів

Якщо порти зайняті іншими додатками:

```bash
# Відредагуйте .env
FRONTEND_PORT=3001    # Замість 3000
BACKEND_PORT=8081     # Замість 8080
DB_PORT=5433          # Замість 5432

# Перезапустіть
docker-compose down
docker-compose up -d
```

## Розгортання для розробки

### Локальний розробка без Docker

#### Backend

```bash
cd backend

# Переконайтеся, що PostgreSQL запущений
# Створіть базу даних
createdb lab_system

# Налаштуйте src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lab_system
spring.datasource.username=postgres
spring.datasource.password=your_password

# Запуск через Maven
mvn spring-boot:run

# Або збірка JAR
mvn clean package
java -jar target/lab-system-backend-0.0.1-SNAPSHOT.jar
```

#### Frontend

```bash
cd frontend

# Встановлення залежностей
npm install

# Налаштуйте .env.local
VITE_API_URL=http://localhost:8080

# Запуск dev сервера
npm run dev

# Відкрийте http://localhost:5173
```

### Hot Reload для Docker

Для розробки з автоматичним перезавантаженням:

```bash
# Додайте volume mapping для коду
# У docker-compose.override.yml:

version: '3.8'
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    command: mvn spring-boot:run

  frontend:
    volumes:
      - ./frontend/src:/app/src
    command: npm run dev
```

## Production Розгортання

### 1. Підготовка

```bash
# Клонування на production сервер
git clone https://github.com/0verlooking/lab-system-full.git
cd lab-system-full

# Копіювання та налаштування .env
cp .env.example .env
nano .env
```

### 2. Production .env конфігурація

```bash
# ВАЖЛИВО: Змініть всі паролі та секрети!

DB_PASSWORD=your_strong_password_here
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRATION=3600000
LOG_LEVEL=INFO

# Вкажіть ваш production домен
VITE_API_URL=https://api.yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

### 3. HTTPS налаштування (Nginx + Let's Encrypt)

```bash
# Встановіть Certbot
sudo apt install certbot python3-certbot-nginx

# Отримайте SSL сертифікат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматичне оновлення сертифікату
sudo certbot renew --dry-run
```

### 4. Reverse Proxy (Nginx)

Створіть `/etc/nginx/sites-available/labsystem`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Активуйте конфігурацію
sudo ln -s /etc/nginx/sites-available/labsystem /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Запуск production

```bash
# Збірка та запуск
docker-compose -f docker-compose.yml up -d --build

# Перевірка
docker-compose ps
curl http://localhost:8080/actuator/health
```

### 6. Автозапуск при перезавантаженні

```bash
# Створіть systemd service
sudo nano /etc/systemd/system/labsystem.service
```

```ini
[Unit]
Description=Lab System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/lab-system-full
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
# Активуйте service
sudo systemctl enable labsystem.service
sudo systemctl start labsystem.service
sudo systemctl status labsystem.service
```

## Моніторинг та логування

### Перегляд логів

```bash
# Реальний час (all services)
docker-compose logs -f

# Останні 100 рядків
docker-compose logs --tail=100

# Лог конкретного сервісу
docker-compose logs -f backend

# Збереження логів у файл
docker-compose logs > logs.txt
```

### Моніторинг ресурсів

```bash
# Використання ресурсів контейнерами
docker stats

# Disk usage
docker system df

# Детальна інформація про контейнер
docker inspect lab-system-backend
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Expected output:
# {"status":"UP"}

# Database connection check
docker-compose exec postgres pg_isready -U postgres

# Frontend check
curl -I http://localhost:3000
```

## Troubleshooting

### Проблема: Порти зайняті

```bash
# Знайти процес на порту
sudo lsof -i :8080
sudo lsof -i :3000
sudo lsof -i :5432

# Вбити процес
sudo kill -9 <PID>

# Або змініть порти в .env
```

### Проблема: Backend не підключається до БД

```bash
# Перевірте статус PostgreSQL
docker-compose ps postgres

# Перевірте логи БД
docker-compose logs postgres

# Перевірте connection string
docker-compose logs backend | grep "datasource"

# Перезапустіть БД
docker-compose restart postgres

# Зачекайте 10 секунд для ініціалізації БД
# Потім перезапустіть backend
docker-compose restart backend
```

### Проблема: Frontend показує помилки CORS

```bash
# Перевірте CORS_ORIGINS в .env
# Має включати URL frontend

CORS_ORIGINS=http://localhost:3000,http://frontend:80

# Перезапустіть backend
docker-compose restart backend
```

### Проблема: "Out of memory"

```bash
# Збільшіть memory limit для Docker
# Docker Desktop: Settings → Resources → Memory (4GB+)

# Або в docker-compose.yml додайте:
services:
  backend:
    mem_limit: 1g
```

### Проблема: Повільна збірка frontend

```bash
# Очистіть cache
docker-compose build --no-cache frontend

# Або локально:
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Permission denied

```bash
# Linux: додайте користувача до групи docker
sudo usermod -aG docker $USER
newgrp docker

# Або запускайте з sudo (не рекомендовано)
sudo docker-compose up -d
```

## Backup та Відновлення

### Backup бази даних

```bash
# Створити backup
docker-compose exec postgres pg_dump -U postgres lab_system > backup_$(date +%Y%m%d_%H%M%S).sql

# Або через docker exec
docker exec lab-system-db pg_dump -U postgres lab_system > backup.sql

# Автоматичний щоденний backup (cron)
0 2 * * * cd /path/to/lab-system-full && docker-compose exec postgres pg_dump -U postgres lab_system > backups/backup_$(date +\%Y\%m\%d).sql
```

### Відновлення з backup

```bash
# Зупинити backend
docker-compose stop backend

# Видалити існуючу БД та створити нову
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS lab_system;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE lab_system;"

# Відновити з backup
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d lab_system

# Запустити backend
docker-compose start backend
```

### Backup volumes

```bash
# Backup postgres data volume
docker run --rm \
  -v lab-system-full_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres_data_$(date +%Y%m%d).tar.gz /data

# Відновлення volume
docker run --rm \
  -v lab-system-full_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres_data_20240101.tar.gz -C /
```

## Оновлення системи

### Оновлення з Git

```bash
# Зупинити систему
docker-compose down

# Отримати останні зміни
git pull origin main

# Пересібрати та запустити
docker-compose up -d --build

# Перевірити статус
docker-compose ps
```

### Міграція даних

```bash
# При зміні структури БД Hibernate автоматично оновить схему
# Але для production краще використовувати Flyway або Liquibase
# (майбутня функція)
```

## Масштабування

### Горизонтальне масштабування backend

```bash
# Запустити кілька інстансів backend
docker-compose up -d --scale backend=3

# Потрібен load balancer (Nginx, HAProxy)
```

### Вертикальне масштабування

```bash
# Збільшити ресурси в docker-compose.yml:
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## Безпека Production

### 1. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Закрити прямий доступ до портів додатку
# Доступ тільки через Nginx
```

### 2. Регулярні оновлення

```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Оновлення Docker images
docker-compose pull
docker-compose up -d --build
```

### 3. Моніторинг безпеки

```bash
# Сканування вразливостей в images
docker scan lab-system-backend
docker scan lab-system-frontend
```

## Додаткові ресурси

- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## Підтримка

При виникненні проблем:
1. Перегляньте логи: `docker-compose logs`
2. Перевірте статус: `docker-compose ps`
3. Перезапустіть: `docker-compose restart`
4. Перегляньте [Troubleshooting](#troubleshooting)

Для питань створіть issue на GitHub або зверніться до розробника.
