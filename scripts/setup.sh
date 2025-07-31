#!/bin/bash

# SmartRelief Development Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up SmartRelief Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        print_error "Python 3.11+ is not installed."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed."
        exit 1
    fi
    
    print_success "All system requirements are met!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd packages/backend
    npm install
    cd ../..
    
    # Mobile dependencies
    print_status "Installing mobile dependencies..."
    cd packages/mobile
    npm install
    cd ../..
    
    # AI service dependencies
    print_status "Installing AI service dependencies..."
    cd packages/ai-service
    if command -v python3 &> /dev/null; then
        python3 -m pip install -r requirements.txt
    else
        python -m pip install -r requirements.txt
    fi
    cd ../..
    
    print_success "All dependencies installed!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Root .env
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Created root .env file"
    fi
    
    # Backend .env
    if [ ! -f packages/backend/.env ]; then
        cp packages/backend/.env.example packages/backend/.env
        print_status "Created backend .env file"
    fi
    
    # AI service .env
    if [ ! -f packages/ai-service/.env ]; then
        cp packages/ai-service/.env.example packages/ai-service/.env
        print_status "Created AI service .env file"
    fi
    
    # Mobile .env
    if [ ! -f packages/mobile/.env ]; then
        cp packages/mobile/.env.example packages/mobile/.env
        print_status "Created mobile .env file"
    fi
    
    print_success "Environment files setup complete!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Start PostgreSQL and Redis containers
    print_status "Starting database containers..."
    docker-compose up -d postgres redis
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run database migrations
    print_status "Running database migrations..."
    cd packages/backend
    npx prisma generate
    npx prisma migrate dev --name init
    npx prisma db seed
    cd ../..
    
    print_success "Database setup complete!"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d .git ]; then
        npx husky install
        npx husky add .husky/pre-commit "npm run lint-staged"
        print_success "Git hooks setup complete!"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup."
    fi
}

# Main setup function
main() {
    echo "=============================================="
    echo "🏥 SmartRelief Development Environment Setup"
    echo "=============================================="
    echo ""
    
    check_requirements
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    setup_database
    echo ""
    
    setup_git_hooks
    echo ""
    
    print_success "🎉 SmartRelief development environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Review and update environment variables in .env files"
    echo "2. Start the development servers with: npm run dev"
    echo "3. Access the applications:"
    echo "   - Backend API: http://localhost:3000"
    echo "   - AI Service: http://localhost:8000"
    echo "   - Mobile App: Use Expo Go app with QR code"
    echo ""
    echo "For more information, see the documentation in the docs/ folder."
}

# Run main function
main "$@"
