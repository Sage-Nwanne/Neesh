# CORS and Authentication Fix - Complete Solution

## Overview
This solution implements proper CORS handling and secure authentication for the NEESH application using Supabase Edge Functions with strict origin validation and JWT-based admin authentication.

## Key Changes Made

### 1. Publisher Application Edge Function (`supabase/functions/publisher-application/index.ts`)
- **Proper CORS**: Restricted to specific allowed origins (neesh.art, localhost)
- **Preflight handling**: Responds to OPTIONS requests with correct headers
- **Service role authentication**: Uses service role key for database operations
- **Error handling**: Comprehensive error responses with proper status codes

### 2. Retailer Application Edge Function (`supabase/functions/retailer-application/index.ts`)
- **Same CORS implementation** as publisher function
- **Anonymous submission support**: Allows users without accounts to submit
- **Service role database access**: Bypasses RLS for insertion

### 3. Admin Edge Function (`supabase/functions/admin/index.ts`)
- **JWT Authentication**: Verifies admin users via Supabase JWT tokens
- **Role-based access**: Only allows users with `app_metadata.role === 'admin'`
- **Service role for DB**: Uses service role for privileged database operations
- **Multiple endpoints**:
  - `GET /admin` - List all applications
  - `GET /admin/applications/:id` - Get application details
  - `PUT /admin/applications/:id/approve` - Approve application
  - `PUT /admin/applications/:id/deny` - Reject application

### 4. Frontend Updates

#### Application Forms
- **Updated submission URLs**: Now use Supabase Edge Functions directly
- **Proper headers**: Include Authorization and apikey headers
- **Error handling**: Handle new error response format

#### Admin API Service (`frontend/src/services/adminApi.ts`)
- **Supabase integration**: Uses Supabase client for authentication
- **JWT token retrieval**: Gets user's access token from session
- **Async headers**: Properly awaits authentication headers

#### Admin Authentication (`frontend/src/hooks/useAdminAuth.ts`)
- **Supabase auth**: Uses Supabase authentication instead of localStorage
- **JWT-based**: Relies on proper Supabase user sessions
- **Role validation**: Checks `app_metadata.role === 'admin'`
- **Auth state listener**: Responds to login/logout events

## Security Features

### CORS Protection
```typescript
const ALLOWED_ORIGINS = new Set([
  "https://neesh.art",
  "https://www.neesh.art", 
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);
```

### Admin Authentication
```typescript
// Verify JWT and admin role
const { data: { user }, error: userErr } = await userClient.auth.getUser();
if (userErr || !user || user.app_metadata?.role !== "admin") {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}
```

### Service Role Database Access
```typescript
// Use service role for privileged operations
const adminDb = createClient(supabaseUrl, serviceKey);
```

## Deployment Instructions

### 1. Deploy Edge Functions
```bash
# Run the deployment script
./scripts/deploy-functions.sh

# Or deploy individually
supabase functions deploy publisher-application
supabase functions deploy retailer-application  
supabase functions deploy admin
```

### 2. Set Environment Variables
In your Supabase project dashboard, ensure these are set:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (for email notifications)

### 3. Create Admin Users
Admin users must be created in Supabase with proper metadata:
```sql
-- Update user to have admin role
UPDATE auth.users 
SET app_metadata = jsonb_set(app_metadata, '{role}', '"admin"')
WHERE email = 'admin@neesh.art';
```

### 4. Frontend Environment Variables
Ensure your frontend has:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## API Endpoints

### Application Submission
```javascript
// Publisher application
POST /functions/v1/publisher-application
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer anon-key',
  'apikey': 'anon-key'
}

// Retailer application  
POST /functions/v1/retailer-application
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer anon-key',
  'apikey': 'anon-key'
}
```

### Admin Operations
```javascript
// Get all applications
GET /functions/v1/admin
Headers: {
  'Authorization': 'Bearer user-jwt-token',
  'Content-Type': 'application/json'
}

// Approve application
PUT /functions/v1/admin/applications/:id/approve
Headers: {
  'Authorization': 'Bearer user-jwt-token',
  'Content-Type': 'application/json'
}
Body: { "type": "publisher" | "retailer" }
```

## Testing

### Test Application Submission
```bash
curl -X POST https://your-project.supabase.co/functions/v1/publisher-application \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-anon-key" \
  -H "apikey: your-anon-key" \
  -d '{"email":"test@example.com","first_name":"Test","last_name":"User",...}'
```

### Test Admin Access
```bash
curl -X GET https://your-project.supabase.co/functions/v1/admin \
  -H "Authorization: Bearer user-jwt-token" \
  -H "Content-Type: application/json"
```

## Benefits

1. **Security**: Proper CORS and JWT authentication
2. **Scalability**: Edge Functions handle traffic efficiently  
3. **Maintainability**: Clean separation of concerns
4. **Compliance**: Follows Supabase best practices
5. **Performance**: Reduced latency with edge deployment

## Next Steps

1. **Monitor**: Check Edge Function logs for any issues
2. **Test**: Verify all functionality works in production
3. **Optimize**: Add caching and rate limiting if needed
4. **Extend**: Add more admin endpoints as required

This solution provides a robust, secure foundation for the NEESH application's API layer.
