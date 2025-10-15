#!/bin/bash

# NEESH Google Sheets Integration Deployment Script
# This script helps deploy the Google Sheets sync function to Supabase

set -e  # Exit on any error

echo "🚀 NEESH Google Sheets Integration Deployment"
echo "=============================================="
echo ""

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

# Check if we're in the right directory
if [ ! -f "supabase/functions/sync-to-sheets/index.ts" ]; then
    print_error "sync-to-sheets function not found!"
    print_error "Please run this script from the project root directory."
    exit 1
fi

print_status "Found sync-to-sheets function ✓"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI not found. Installing..."
    npm install -g supabase
    if [ $? -ne 0 ]; then
        print_error "Failed to install Supabase CLI"
        print_error "Please install manually: npm install -g supabase"
        exit 1
    fi
    print_success "Supabase CLI installed"
fi

# Check if user is logged in to Supabase
print_status "Checking Supabase authentication..."
if ! supabase status &> /dev/null; then
    print_warning "Not logged in to Supabase"
    print_status "Please log in to Supabase:"
    supabase login
    if [ $? -ne 0 ]; then
        print_error "Failed to log in to Supabase"
        exit 1
    fi
fi

print_success "Supabase authentication verified"

# Check environment variables
print_status "Checking environment variables..."

echo ""
echo "Please ensure you have set these environment variables in your Supabase project:"
echo "1. GOOGLE_SHEETS_ID - Your Google Sheets spreadsheet ID"
echo "2. GOOGLE_SERVICE_ACCOUNT_EMAIL - Service account email"
echo "3. GOOGLE_PRIVATE_KEY - Service account private key (with \\n for newlines)"
echo ""

read -p "Have you set all environment variables in Supabase Dashboard? (y/n): " env_confirmed

if [[ $env_confirmed != "y" && $env_confirmed != "Y" ]]; then
    print_warning "Please set environment variables first:"
    echo "1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID"
    echo "2. Navigate to: Settings → Edge Functions → Environment Variables"
    echo "3. Add the 3 required variables"
    echo "4. Run this script again"
    exit 1
fi

# Deploy the function
print_status "Deploying sync-to-sheets function..."

supabase functions deploy sync-to-sheets

if [ $? -eq 0 ]; then
    print_success "Function deployed successfully!"
else
    print_error "Function deployment failed"
    exit 1
fi

# Test the function
print_status "Testing the deployed function..."

# Get project reference
PROJECT_REF=$(supabase status | grep "API URL" | awk '{print $3}' | sed 's/https:\/\///' | sed 's/\.supabase\.co//')

if [ -z "$PROJECT_REF" ]; then
    print_warning "Could not determine project reference automatically"
    read -p "Please enter your Supabase project reference (from your project URL): " PROJECT_REF
fi

# Get anon key
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

if [ -z "$ANON_KEY" ]; then
    print_warning "Could not determine anon key automatically"
    read -p "Please enter your Supabase anon key: " ANON_KEY
fi

# Test the function
print_status "Testing function with project: $PROJECT_REF"

FUNCTION_URL="https://$PROJECT_REF.supabase.co/functions/v1/sync-to-sheets"

curl_response=$(curl -s -w "%{http_code}" -X POST "$FUNCTION_URL" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json")

http_code="${curl_response: -3}"
response_body="${curl_response%???}"

if [ "$http_code" = "200" ]; then
    print_success "Function test successful!"
    echo "Response: $response_body"
else
    print_warning "Function test returned HTTP $http_code"
    echo "Response: $response_body"
    echo ""
    print_status "This might be normal if environment variables aren't set yet."
fi

# Final instructions
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Next steps:"
echo "1. Set up your Google Sheets document (if not done already)"
echo "2. Configure environment variables in Supabase Dashboard"
echo "3. Test the sync from your CMS interface"
echo ""
echo "Function URL: $FUNCTION_URL"
echo ""
echo "For detailed setup instructions, see:"
echo "📖 scripts/setup-google-sheets-complete.md"
echo ""

# Offer to open setup guide
read -p "Would you like to open the setup guide now? (y/n): " open_guide

if [[ $open_guide == "y" || $open_guide == "Y" ]]; then
    if command -v code &> /dev/null; then
        code scripts/setup-google-sheets-complete.md
    elif command -v open &> /dev/null; then
        open scripts/setup-google-sheets-complete.md
    else
        print_status "Please open: scripts/setup-google-sheets-complete.md"
    fi
fi

print_success "Google Sheets integration deployment complete! 🚀"
