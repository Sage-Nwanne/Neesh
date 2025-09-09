#!/bin/bash

# NEESH Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting NEESH Deployment Process..."

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
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    npm install
    
    # Frontend dependencies
    cd frontend
    npm install
    cd ..
    
    # Backend dependencies
    cd backend
    npm install
    cd ..
    
    print_success "Dependencies installed"
}

# Run tests (if available)
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    cd frontend
    if npm run test --if-present; then
        print_success "Frontend tests passed"
    else
        print_warning "No frontend tests found or tests failed"
    fi
    cd ..
    
    # Backend tests
    cd backend
    if npm run test --if-present; then
        print_success "Backend tests passed"
    else
        print_warning "No backend tests found or tests failed"
    fi
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    print_success "Frontend build completed"
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    cd frontend
    netlify deploy --prod --dir=dist
    cd ..
    
    print_success "Deployed to Netlify"
}

# Deploy backend to Vercel
deploy_vercel() {
    print_status "Deploying backend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd backend
    vercel --prod
    cd ..
    
    print_success "Backend deployed to Vercel"
}

# Deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    if ! command -v firebase &> /dev/null; then
        print_warning "Firebase CLI not found. Installing..."
        npm install -g firebase-tools
    fi
    
    firebase deploy
    
    print_success "Deployed to Firebase"
}

# Main deployment function
main() {
    echo "🎯 NEESH Deployment Script"
    echo "=========================="
    
    # Parse command line arguments
    PLATFORM=${1:-"netlify"}
    SKIP_TESTS=${2:-false}
    
    print_status "Deployment platform: $PLATFORM"
    
    # Run deployment steps
    check_dependencies
    install_dependencies
    
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    else
        print_warning "Skipping tests"
    fi
    
    build_frontend
    
    case $PLATFORM in
        "netlify")
            deploy_netlify
            ;;
        "vercel")
            deploy_vercel
            ;;
        "firebase")
            deploy_firebase
            ;;
        "all")
            deploy_netlify
            deploy_vercel
            ;;
        *)
            print_error "Unknown platform: $PLATFORM"
            print_status "Available platforms: netlify, vercel, firebase, all"
            exit 1
            ;;
    esac
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Don't forget to:"
    print_status "1. Update environment variables in your hosting platform"
    print_status "2. Configure custom domains if needed"
    print_status "3. Set up monitoring and analytics"
    print_status "4. Test the deployed application"
}

# Show usage if help is requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Usage: $0 [platform] [skip_tests]"
    echo ""
    echo "Platforms:"
    echo "  netlify   - Deploy frontend to Netlify (default)"
    echo "  vercel    - Deploy backend to Vercel"
    echo "  firebase  - Deploy to Firebase"
    echo "  all       - Deploy to both Netlify and Vercel"
    echo ""
    echo "Options:"
    echo "  skip_tests - Set to 'true' to skip running tests"
    echo ""
    echo "Examples:"
    echo "  $0 netlify"
    echo "  $0 vercel true"
    echo "  $0 all"
    exit 0
fi

# Run main function
main "$@"
