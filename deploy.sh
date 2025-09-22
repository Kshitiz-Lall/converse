#!/bin/bash

# DevToolkit Deployment Script
# This script helps deploy the application to various cloud providers

set -e  # Exit on any error

echo "🚀 DevToolkit Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_status "Docker is installed"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi
    print_status "Docker Compose is available"
}

# Create environment file if it doesn't exist
setup_environment() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_info "Please edit .env file with your configuration before running the application"
        return 1
    fi
    print_status "Environment file exists"
    return 0
}

# Build and start the application
start_application() {
    print_info "Building and starting the application..."
    
    # Use docker compose (newer) or docker-compose (older)
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    # Build and start services
    $COMPOSE_CMD down --remove-orphans
    $COMPOSE_CMD build --no-cache
    $COMPOSE_CMD up -d
    
    print_status "Application started successfully!"
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    check_services
}

# Check if services are running
check_services() {
    print_info "Checking service health..."
    
    # Check MongoDB
    if curl -f http://localhost:27017 &> /dev/null || nc -z localhost 27017 &> /dev/null; then
        print_status "MongoDB is running"
    else
        print_warning "MongoDB might not be ready yet"
    fi
    
    # Check Backend
    if curl -f http://localhost:3000/health &> /dev/null; then
        print_status "Backend API is running"
    else
        print_warning "Backend API might not be ready yet"
    fi
    
    # Check Frontend
    if curl -f http://localhost:3001 &> /dev/null; then
        print_status "Frontend is running"
    else
        print_warning "Frontend might not be ready yet"
    fi
}

# Stop the application
stop_application() {
    print_info "Stopping the application..."
    
    if docker compose version &> /dev/null; then
        docker compose down
    else
        docker-compose down
    fi
    
    print_status "Application stopped"
}

# Show logs
show_logs() {
    if docker compose version &> /dev/null; then
        docker compose logs -f
    else
        docker-compose logs -f
    fi
}

# Clean up Docker resources
cleanup() {
    print_info "Cleaning up Docker resources..."
    
    if docker compose version &> /dev/null; then
        docker compose down -v --remove-orphans
    else
        docker-compose down -v --remove-orphans
    fi
    
    docker system prune -f
    print_status "Cleanup completed"
}

# Show application URLs
show_urls() {
    echo ""
    echo "🌐 Application URLs:"
    echo "Frontend: http://localhost:3001"
    echo "Backend API: http://localhost:3000"
    echo "API Health Check: http://localhost:3000/health"
    echo ""
}

# Main menu
show_menu() {
    echo ""
    echo "Please select an option:"
    echo "1) Start Application (Build & Run)"
    echo "2) Stop Application"
    echo "3) Show Logs"
    echo "4) Check Service Status"
    echo "5) Cleanup (Remove all containers and volumes)"
    echo "6) Show Application URLs"
    echo "7) Exit"
    echo ""
}

# Main script execution
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Setup environment
    if ! setup_environment; then
        read -p "Do you want to continue with the template .env file? (y/n): " -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Please configure your .env file and run the script again"
            exit 1
        fi
    fi
    
    while true; do
        show_menu
        read -p "Enter your choice [1-7]: " choice
        
        case $choice in
            1)
                start_application
                show_urls
                ;;
            2)
                stop_application
                ;;
            3)
                show_logs
                ;;
            4)
                check_services
                ;;
            5)
                read -p "Are you sure you want to remove all containers and volumes? (y/n): " -r
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    cleanup
                fi
                ;;
            6)
                show_urls
                ;;
            7)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-7."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@"