#!/bin/bash

# Deploy Supabase Edge Functions
# This script deploys the updated edge functions

set -e

echo "🚀 Deploying Supabase Edge Functions..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    echo "or"
    echo "brew install supabase/tap/supabase"
    exit 1
fi

# Deploy application submission functions
print_status "Deploying publisher-application function..."
supabase functions deploy publisher-application

print_status "Deploying retailer-application function..."
supabase functions deploy retailer-application

# Deploy admin function
print_status "Deploying admin function..."
supabase functions deploy admin

# Deploy notification functions
print_status "Deploying publisher-notify function..."
supabase functions deploy publisher-notify

print_status "Deploying retailer-notify function..."
supabase functions deploy retailer-notify

# Deploy application-decision function (if it exists)
if [ -d "supabase/functions/application-decision" ]; then
    print_status "Deploying application-decision function..."
    supabase functions deploy application-decision
fi

print_success "🎉 All functions deployed successfully!"
echo ""
print_status "📋 Required environment variables in Supabase project:"
print_status "   - SUPABASE_URL"
print_status "   - SUPABASE_ANON_KEY"
print_status "   - SUPABASE_SERVICE_ROLE_KEY"
print_status "   - RESEND_API_KEY (for email notifications)"
echo ""
print_status "🔧 Set environment variables using:"
print_status "supabase secrets set RESEND_API_KEY=your_api_key_here"
echo ""
print_status "🔒 Security features enabled:"
print_status "   ✅ Proper CORS with allowed origins"
print_status "   ✅ Preflight request handling"
print_status "   ✅ Admin authentication via Supabase JWT"
print_status "   ✅ Service role for database operations"
