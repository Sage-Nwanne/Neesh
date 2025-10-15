# Google Sheets Integration Setup Guide

This guide will help you set up the Google Sheets integration to automatically sync your Supabase database tables to Google Sheets for easy viewing.

## Prerequisites

1. Google Cloud Project with Sheets API enabled
2. Service Account with appropriate permissions
3. Google Sheets document to sync data to

## Step 1: Create Google Cloud Project and Service Account

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. **Create a Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it "neesh-sheets-sync"
   - Click "Create and Continue"
   - Skip role assignment for now
   - Click "Done"

5. **Generate Service Account Key**:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the key file

## Step 2: Create Google Sheets Document

1. **Create a new Google Sheets document**: https://sheets.google.com/
2. **Name it**: "NEESH Database Dashboard"
3. **Create the following sheets** (tabs):
   - Publisher Applications
   - Retailer Applications
   - Mailing List
   - Site Content
   - Navigation
   - Landing Pages
   - FAQ

4. **Share the document** with your service account:
   - Click "Share" button
   - Add the service account email (from the JSON key file)
   - Give "Editor" permissions
   - Click "Send"

5. **Copy the Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 3: Configure Supabase Environment Variables

Add these environment variables to your Supabase project:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr
2. **Navigate to**: Settings → Edge Functions → Environment Variables
3. **Add the following variables**:

```
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
```

**Important**: For the private key, replace actual newlines with `\n` in the environment variable.

## Step 4: Deploy the Sync Function

The sync function is already created at `supabase/functions/sync-to-sheets/index.ts`.

To deploy it manually via Supabase Dashboard:

1. **Go to**: Edge Functions in your Supabase Dashboard
2. **Create a new function** named `sync-to-sheets`
3. **Copy and paste** the code from `supabase/functions/sync-to-sheets/index.ts`
4. **Deploy the function**

## Step 5: Test the Integration

1. **Test the function** by calling it:
   ```bash
   curl -X POST "https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/sync-to-sheets" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

2. **Check your Google Sheets** to see if data appears

## Step 6: Set Up Automated Sync (Optional)

You can set up automated syncing using:

### Option A: Supabase Cron Jobs (if available)
```sql
-- Run sync every hour
SELECT cron.schedule('sync-sheets-hourly', '0 * * * *', 'SELECT net.http_post(url:=''https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/sync-to-sheets'', headers:=''{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'')');
```

### Option B: External Cron Service
Use a service like GitHub Actions, Vercel Cron, or Zapier to call the sync function regularly.

### Option C: Manual Sync
Create a simple admin button to trigger sync manually when needed.

## Step 7: Share with Your Boss

1. **Share the Google Sheets document** with your boss's email
2. **Give "Viewer" permissions** (so they can see but not accidentally edit)
3. **Explain the sheets**:
   - **Publisher Applications**: All publisher application submissions
   - **Retailer Applications**: All retailer application submissions  
   - **Mailing List**: Email subscribers from the popup
   - **Site Content**: Editable website content
   - **Navigation**: Website navigation items
   - **Landing Pages**: Publisher and retailer landing page content
   - **FAQ**: Frequently asked questions

## Troubleshooting

### Common Issues:

1. **"Permission denied" error**:
   - Make sure the service account has access to the Google Sheets document
   - Check that the Sheets API is enabled

2. **"Invalid credentials" error**:
   - Verify the service account email and private key are correct
   - Make sure newlines in private key are properly escaped as `\n`

3. **"Spreadsheet not found" error**:
   - Check the spreadsheet ID is correct
   - Ensure the service account has access to the document

4. **Empty sheets**:
   - Check that your database tables have data
   - Verify the table names match what's expected in the function

### Testing Individual Components:

1. **Test database connection**:
   ```sql
   SELECT COUNT(*) FROM publisher_applications;
   ```

2. **Test Google Sheets API**:
   - Try manually calling the Google Sheets API with your credentials

3. **Check function logs**:
   - View logs in Supabase Dashboard → Edge Functions → sync-to-sheets

## Security Notes

- **Never commit** the service account JSON file to version control
- **Use environment variables** for all sensitive data
- **Give minimum required permissions** to the service account
- **Regularly rotate** service account keys if needed

## Data Refresh

The sync function will:
- **Clear existing data** in each sheet
- **Replace with fresh data** from Supabase
- **Maintain column headers** for easy reading
- **Handle different data types** (text, numbers, dates, JSON)

Your boss will always see the most up-to-date data when the sync runs!
