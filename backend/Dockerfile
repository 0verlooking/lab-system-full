# Багатоетапна збірка для оптимізації розміру образу

# Етап 1: Збірка додатку
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Копіюємо pom.xml та завантажуємо залежності (кешуються окремо)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Копіюємо весь проект та збираємо
COPY src ./src
RUN mvn clean package -DskipTests

# Етап 2: Виконання додатку
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Встановлюємо необхідні системні пакети
RUN apk add --no-cache curl

# Створюємо непривілейованого користувача
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Копіюємо зібраний jar з етапу збірки
COPY --from=build /app/target/*.jar app.jar

# Відкриваємо порт
EXPOSE 8080

# Health check для моніторингу
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Запускаємо додаток з JVM оптимізаціями
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
