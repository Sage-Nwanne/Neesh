import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleSheetsConfig {
  spreadsheetId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Google Sheets configuration from environment variables
    const config: GoogleSheetsConfig = {
      spreadsheetId: Deno.env.get('GOOGLE_SHEETS_ID') ?? '',
      serviceAccountEmail: Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL') ?? '',
      privateKey: (Deno.env.get('GOOGLE_PRIVATE_KEY') ?? '').replace(/\\n/g, '\n'),
    }

    if (!config.spreadsheetId || !config.serviceAccountEmail || !config.privateKey) {
      throw new Error('Missing Google Sheets configuration')
    }

    // Get JWT token for Google Sheets API
    const jwtToken = await getGoogleJWT(config.serviceAccountEmail, config.privateKey)
    
    // Fetch data from all relevant tables
    const [
      { data: publisherApplications },
      { data: retailerApplications },
      { data: mailingListSubscribers },
      { data: siteContent },
      { data: navigationItems },
      { data: landingPageSections },
      { data: faqItems }
    ] = await Promise.all([
      supabaseClient.from('publisher_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('retailer_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('mailing_list_subscribers').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('site_content').select('*').order('key'),
      supabaseClient.from('navigation_items').select('*').order('position'),
      supabaseClient.from('landing_page_sections').select('*').order('page_type, position'),
      supabaseClient.from('faq_items').select('*').order('position')
    ])

    // Sync each table to a different sheet
    const syncResults = await Promise.all([
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Publisher Applications', publisherApplications || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Retailer Applications', retailerApplications || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Mailing List', mailingListSubscribers || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Site Content', siteContent || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Navigation', navigationItems || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'Landing Pages', landingPageSections || []),
      syncTableToSheet(jwtToken, config.spreadsheetId, 'FAQ', faqItems || [])
    ])

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data synced to Google Sheets successfully',
        results: syncResults,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error syncing to Google Sheets:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function getGoogleJWT(serviceAccountEmail: string, privateKey: string): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  // Create JWT
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  
  // Import private key
  const keyData = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0))
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  // Sign the token
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  )

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  const jwt = `${unsignedToken}.${encodedSignature}`

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  })

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

async function syncTableToSheet(accessToken: string, spreadsheetId: string, sheetName: string, data: any[]): Promise<any> {
  if (!data || data.length === 0) {
    return { sheetName, status: 'skipped', reason: 'no data' }
  }

  // Get column headers from the first row
  const headers = Object.keys(data[0])
  
  // Convert data to 2D array format for Google Sheets
  const values = [
    headers, // Header row
    ...data.map(row => headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    }))
  ]

  // Clear existing data and update with new data
  const range = `${sheetName}!A:Z`
  
  try {
    // First, try to clear the sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    // Then update with new data
    const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    })

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      throw new Error(`Failed to update sheet ${sheetName}: ${errorText}`)
    }

    return {
      sheetName,
      status: 'success',
      rowsUpdated: values.length,
      columnsUpdated: headers.length
    }

  } catch (error) {
    return {
      sheetName,
      status: 'error',
      error: error.message
    }
  }
}
