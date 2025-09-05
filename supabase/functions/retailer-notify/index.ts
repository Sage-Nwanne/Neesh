import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()
    const r = record

    // Email configuration
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const subject = `🆕 Retailer Application ${r.application_number || ''} — ${r.shop_name || 'Unknown Shop'}`

    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5">
        <h2>New Retailer Application</h2>
        <p><strong>Application ID:</strong> ${r.application_number ?? '—'}</p>
        
        <h3>Shop Information</h3>
        <p><strong>Shop Name:</strong> ${r.shop_name ?? '—'}</p>
        <p><strong>Store Category:</strong> ${r.store_category ?? '—'}</p>
        <p><strong>Store Type:</strong> ${r.store_type ?? '—'}</p>
        <p><strong>Store Size:</strong> ${r.store_size ?? '—'}</p>
        <p><strong>Years in Business:</strong> ${r.years_in_business ?? '—'}</p>
        
        <h3>Address</h3>
        <p><strong>Address:</strong> ${r.business_address_line_1 ?? '—'}</p>
        ${r.business_address_line_2 ? `<p><strong>Address Line 2:</strong> ${r.business_address_line_2}</p>` : ''}
        <p><strong>City:</strong> ${r.business_city ?? '—'}</p>
        <p><strong>State:</strong> ${r.business_state ?? '—'}</p>
        <p><strong>ZIP:</strong> ${r.business_zip_code ?? '—'}</p>
        <p><strong>Country:</strong> ${r.business_country ?? '—'}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Buyer Name:</strong> ${r.buyer_name ?? '—'}</p>
        <p><strong>Email:</strong> ${r.buyer_email ?? '—'}</p>
        <p><strong>Phone:</strong> ${r.buyer_phone ?? '—'}</p>
        
        <h3>Business Operations</h3>
        <p><strong>POS System:</strong> ${r.pos_system ?? '—'}</p>
        <p><strong>Monthly Budget:</strong> $${r.monthly_magazine_budget ?? '—'}</p>
        <p><strong>Delivery Frequency:</strong> ${r.preferred_delivery_frequency ?? '—'}</p>
        <p><strong>Current Sources:</strong> ${Array.isArray(r.current_magazine_sources) ? r.current_magazine_sources.join(', ') : '—'}</p>
        <p><strong>Current Titles:</strong> ${r.current_magazine_titles ?? '—'}</p>
        
        <h3>Store Profile</h3>
        <p><strong>Target Customers:</strong> ${Array.isArray(r.target_customers) ? r.target_customers.join(', ') : '—'}</p>
        <p><strong>Aesthetic Preferences:</strong> ${Array.isArray(r.aesthetic_preferences) ? r.aesthetic_preferences.join(', ') : '—'}</p>
        <p><strong>Interested Genres:</strong> ${Array.isArray(r.interested_genres) ? r.interested_genres.join(', ') : '—'}</p>
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Submitted: ${new Date(r.created_at).toLocaleString()}<br>
          Application ID: ${r.application_number ?? r.id}
        </p>
      </div>
    `

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Applications <applications@neesh.art>',
        to: ['hi@neesh.art'],
        subject: subject,
        html: html,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email sending failed: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in retailer-notify function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
