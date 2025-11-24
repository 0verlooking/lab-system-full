.PHONY: help build up down restart logs status clean test

help:
	@echo "Lab System - Makefile Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build       - Build all Docker images"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs (all services)"
	@echo "  make logs-db     - View database logs"
	@echo "  make logs-backend - View backend logs"
	@echo "  make logs-frontend - View frontend logs"
	@echo "  make status      - Show status of all containers"
	@echo "  make clean       - Stop and remove all containers, volumes"
	@echo "  make rebuild     - Clean build and start"
	@echo ""

build:
	@echo "Building Docker images..."
	docker-compose build

up:
	@echo "Starting services..."
	docker-compose up -d
	@echo "Services started. Frontend: http://localhost:3000, Backend: http://localhost:8080"

down:
	@echo "Stopping services..."
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

logs-db:
	docker-compose logs -f postgres

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

status:
	@echo "Container Status:"
	docker-compose ps
	@echo ""
	@echo "Health Checks:"
	@docker ps --filter "name=lab-system" --format "table {{.Names}}\t{{.Status}}"

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	@echo "Cleanup complete."

rebuild: clean build up
	@echo "Rebuild complete!"

test-backend:
	@echo "Testing backend..."
	curl -f http://localhost:8080/actuator/health || echo "Backend not ready"

test-frontend:
	@echo "Testing frontend..."
	curl -f http://localhost:3000 || echo "Frontend not ready"
