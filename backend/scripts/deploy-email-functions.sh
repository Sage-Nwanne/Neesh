#!/bin/bash

# Deploy Email Notification Functions to Supabase
# This script deploys the publisher and retailer notification functions

echo "🚀 Deploying email notification functions to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "📦 Install it with: npm install -g supabase"
    echo "🔗 Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "supabase/functions" ]; then
    echo "❌ supabase/functions directory not found."
    echo "📁 Make sure you're running this from the project root directory."
    exit 1
fi

echo "📁 Found Supabase functions directory"

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "🔑 Please log in to Supabase:"
    supabase login
fi

# Link to the project (if not already linked)
echo "🔗 Linking to Supabase project..."
supabase link --project-ref smfzrubkyxejzkblrrjr

# Deploy publisher notification function
echo "📚 Deploying publisher-notify function..."
if supabase functions deploy publisher-notify; then
    echo "✅ Publisher notification function deployed successfully"
else
    echo "❌ Failed to deploy publisher notification function"
    exit 1
fi

# Deploy retailer notification function (if it exists)
if [ -d "supabase/functions/retailer-notify" ]; then
    echo "🏪 Deploying retailer-notify function..."
    if supabase functions deploy retailer-notify; then
        echo "✅ Retailer notification function deployed successfully"
    else
        echo "❌ Failed to deploy retailer notification function"
        exit 1
    fi
else
    echo "ℹ️  Retailer notification function not found, skipping..."
fi

echo ""
echo "🎉 Email notification functions deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Supabase Dashboard:"
echo "   - Go to: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/settings/functions"
echo "   - Add: RESEND_API_KEY=your_resend_api_key"
echo ""
echo "2. Run the SQL script to set up database triggers:"
echo "   - Go to: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql"
echo "   - Run: backend/scripts/setup-email-notifications.sql"
echo ""
echo "3. Test by submitting an application form"
echo ""
echo "🔗 Function URLs:"
echo "   Publisher: https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/publisher-notify"
echo "   Retailer:  https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/retailer-notify"
