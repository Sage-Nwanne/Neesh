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
      console.warn('RESEND_API_KEY not configured - skipping email notifications')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Application processed successfully (email notifications disabled)',
          adminEmailId: null,
          confirmationEmailSent: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
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

    // Send notification email to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Applications <onboarding@resend.dev>',
        to: ['sagenwanne5@gmail.com'], // Admin notification
        subject: subject,
        html: html,
      }),
    })

    if (!adminEmailResponse.ok) {
      const errorText = await adminEmailResponse.text()
      throw new Error(`Admin email sending failed: ${errorText}`)
    }

    const adminEmailResult = await adminEmailResponse.json()
    console.log('Admin email sent successfully:', adminEmailResult)

    // Send confirmation email to applicant
    const confirmationSubject = `🏪 Application Received - ${r.shop_name || 'Your Shop'}`
    const confirmationHtml = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
          <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
        </div>

        <h2 style="color:#1f2937;font-size:20px;margin-bottom:20px;">Thank you for your application!</h2>

        <p style="color:#374151;margin-bottom:15px;">Hi ${r.buyer_name || 'there'},</p>

        <p style="color:#374151;margin-bottom:15px;">
          We've successfully received your retailer application for <strong>${r.shop_name || 'your shop'}</strong>.
          Our team will review your submission and get back to you within 3-5 business days.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
          <h3 style="color:#1f2937;font-size:16px;margin:0 0 10px 0;">Application Summary</h3>
          <p style="color:#6b7280;margin:5px 0;"><strong>Shop Name:</strong> ${r.shop_name || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Buyer:</strong> ${r.buyer_name || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Store Type:</strong> ${r.store_type || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Application Number:</strong> ${r.application_number || '—'}</p>
        </div>

        <p style="color:#374151;margin-bottom:15px;">
          If you have any questions in the meantime, feel free to reach out to us at
          <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
        </p>

        <p style="color:#374151;margin-bottom:30px;">
          Best regards,<br>
          The NEESH Team
        </p>

        <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            This is an automated message from NEESH. Please do not reply to this email.
          </p>
        </div>
      </div>
    `

    const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Applications <applications@mail.neesh.art>',
        to: [r.buyer_email], // Send to actual applicant
        subject: confirmationSubject,
        html: confirmationHtml,
      }),
    })

    if (!confirmationEmailResponse.ok) {
      const errorText = await confirmationEmailResponse.text()
      console.error('Confirmation email sending failed:', errorText)
      // Don't fail the entire function if confirmation email fails
    } else {
      const confirmationEmailResult = await confirmationEmailResponse.json()
      console.log('Confirmation email sent successfully:', confirmationEmailResult)
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmailResult.id,
        confirmationEmailSent: confirmationEmailResponse.ok
      }),
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
