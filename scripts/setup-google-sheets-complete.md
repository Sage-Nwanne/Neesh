# Complete Google Sheets Integration Setup

## 🎯 **Overview**

This guide will walk you through setting up Google Sheets integration for your NEESH CMS. Once complete, you'll be able to sync all your database content to Google Sheets with a single button click.

## 📋 **What You'll Get**

After setup, you'll have:
- **Automatic data sync** from Supabase to Google Sheets
- **7 organized sheets** with your data:
  - Publisher Applications
  - Retailer Applications  
  - Mailing List Subscribers
  - Site Content (editable website text)
  - Navigation Items
  - Landing Page Sections
  - FAQ Items
- **One-click sync** from your CMS dashboard
- **Real-time data access** for your boss in familiar spreadsheet format

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project**:
   - Click "Select a project" → "New Project"
   - Name it "NEESH Sheets Integration"
   - Click "Create"

3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

### **Step 2: Create Service Account**

1. **Go to Credentials**:
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"

2. **Configure Service Account**:
   - **Service account name**: `neesh-sheets-sync`
   - **Service account ID**: `neesh-sheets-sync` (auto-filled)
   - **Description**: `Service account for syncing NEESH data to Google Sheets`
   - Click "Create and Continue"

3. **Skip role assignment** (click "Continue")
4. **Skip user access** (click "Done")

### **Step 3: Generate Service Account Key**

1. **Find your service account** in the credentials list
2. **Click on the service account name**
3. **Go to "Keys" tab**
4. **Click "Add Key" → "Create new key"**
5. **Choose "JSON" format**
6. **Click "Create"** - this downloads a JSON file
7. **Save this file securely** - you'll need it in the next step

### **Step 4: Create Google Sheets Document**

1. **Go to Google Sheets**: https://sheets.google.com/
2. **Create a new spreadsheet**
3. **Name it**: "NEESH Database Dashboard"
4. **Create these sheets** (tabs at the bottom):
   - Right-click on "Sheet1" → "Rename" → "Publisher Applications"
   - Click "+" to add new sheets and name them:
     - "Retailer Applications"
     - "Mailing List"
     - "Site Content"
     - "Navigation"
     - "Landing Pages"
     - "FAQ"

5. **Share with service account**:
   - Click "Share" button (top right)
   - Add the service account email from your JSON file (looks like: `neesh-sheets-sync@your-project.iam.gserviceaccount.com`)
   - Set permission to "Editor"
   - **Uncheck "Notify people"**
   - Click "Share"

6. **Copy the Spreadsheet ID**:
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part (long string of letters and numbers)

### **Step 5: Configure Supabase Environment Variables**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. **Navigate to**: Settings → Edge Functions → Environment Variables
3. **Add these 3 environment variables**:

#### **Variable 1: GOOGLE_SHEETS_ID**
- **Name**: `GOOGLE_SHEETS_ID`
- **Value**: Your spreadsheet ID from Step 4

#### **Variable 2: GOOGLE_SERVICE_ACCOUNT_EMAIL**
- **Name**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: The email from your JSON file (e.g., `neesh-sheets-sync@your-project.iam.gserviceaccount.com`)

#### **Variable 3: GOOGLE_PRIVATE_KEY**
- **Name**: `GOOGLE_PRIVATE_KEY`
- **Value**: The private key from your JSON file
- **⚠️ IMPORTANT**: Replace all actual newlines with `\n`
- Example: `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----`

### **Step 6: Deploy the Sync Function**

You have two options:

#### **Option A: Deploy via Supabase CLI (Recommended)**
```bash
# Make sure you're in the project root
cd /path/to/your/neesh-project

# Deploy the function
npx supabase functions deploy sync-to-sheets
```

#### **Option B: Deploy via Supabase Dashboard**
1. Go to Edge Functions in your Supabase Dashboard
2. Click "Create a new function"
3. Name it `sync-to-sheets`
4. Copy and paste the entire content from `supabase/functions/sync-to-sheets/index.ts`
5. Click "Deploy function"

### **Step 7: Test the Integration**

1. **Test the function**:
   ```bash
   curl -X POST "https://YOUR_PROJECT_ID.supabase.co/functions/v1/sync-to-sheets" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

2. **Or test from your CMS**:
   - Go to `/live-editor` or `/visual-cms`
   - Click the "📊 Sync to Google Sheets" button
   - Check for success message

3. **Check your Google Sheets**:
   - Open your "NEESH Database Dashboard" spreadsheet
   - You should see data populated in all the sheets

## 🎉 **You're Done!**

Your Google Sheets integration is now complete. Your boss can:

1. **Access the spreadsheet** at the Google Sheets URL
2. **View all data** in organized, familiar spreadsheet format
3. **See real-time updates** when you sync from the CMS
4. **Export or share data** as needed

## 🔄 **How to Use**

### **For You (Admin)**:
- Use the "Sync to Google Sheets" button in any CMS tool
- Data syncs automatically and overwrites previous data
- Check the sync status in the CMS interface

### **For Your Boss**:
- **Access**: Open the Google Sheets document
- **View**: All data is organized in separate tabs
- **Understand**: Each sheet represents a different type of data
- **Export**: Use Google Sheets' built-in export features if needed

## 📊 **What Each Sheet Contains**

- **Publisher Applications**: People who want to become publishers
- **Retailer Applications**: People who want to become retailers
- **Mailing List**: Email subscribers from your website popup
- **Site Content**: All editable website text (headlines, descriptions, etc.)
- **Navigation**: Website menu items
- **Landing Pages**: Content for publisher and retailer landing pages
- **FAQ**: Frequently asked questions and answers

## 🔧 **Troubleshooting**

### **"Missing Google Sheets configuration" error**
- Check that all 3 environment variables are set in Supabase
- Verify the variable names are exactly correct (case-sensitive)

### **"Permission denied" error**
- Make sure you shared the spreadsheet with the service account email
- Verify the service account has "Editor" permissions

### **"Invalid credentials" error**
- Check that the private key is properly formatted with `\n` for newlines
- Verify the service account email is correct

### **Empty sheets after sync**
- Check that your database tables have data
- Verify the function deployed successfully
- Check the function logs in Supabase Dashboard

## 🔒 **Security Notes**

- **Never commit** the service account JSON file to version control
- **Use environment variables** for all sensitive data
- **Regularly review** who has access to the Google Sheets document
- **Consider rotating** service account keys periodically

## 📞 **Support**

If you encounter issues:
1. Check the function logs in Supabase Dashboard → Edge Functions → sync-to-sheets
2. Verify all environment variables are set correctly
3. Test the Google Sheets API access manually
4. Contact your developer for technical assistance

---

**🎯 Result**: Your boss now has real-time access to all website data in a familiar Google Sheets format, updated with a single button click!
