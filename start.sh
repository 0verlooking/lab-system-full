#!/bin/bash

echo "================================================"
echo "  Lab System - Quick Start Script"
echo "================================================"
echo ""

# Stop all containers
echo "🛑 Stopping all containers..."
docker compose down

# Remove old images to force rebuild
echo "🗑️  Removing old images..."
docker rmi lab-system-full-frontend lab-system-full-backend 2>/dev/null || true

# Build and start
echo "🔨 Building and starting containers..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Show status
echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "================================================"
echo "✅ READY!"
echo "================================================"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8080"
echo "📊 Database: localhost:5432"
echo ""
echo "👤 Login credentials:"
echo "   Admin:    admin / admin123"
echo "   Student:  student / student123"
echo ""
echo "📝 View logs: docker compose logs -f"
echo "🛑 Stop:      docker compose down"
echo ""
