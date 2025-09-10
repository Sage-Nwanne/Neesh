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

    const subject = `📚 Publisher Application — ${r.magazine_title || 'Unknown Magazine'}`

    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
          <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
        </div>
        <h2 style="color:#2563eb;">New Publisher Application</h2>
        <p><strong>Application ID:</strong> ${r.id ?? '—'}</p>
        
        <h3>Publisher Information</h3>
        <p><strong>Name:</strong> ${r.first_name ?? '—'} ${r.last_name ?? '—'}</p>
        <p><strong>Email:</strong> ${r.email ?? '—'}</p>
        <p><strong>Business Name:</strong> ${r.business_name ?? '—'}</p>
        
        <h3>Magazine Details</h3>
        <p><strong>Magazine Title:</strong> ${r.magazine_title ?? '—'}</p>
        <p><strong>Publication Type:</strong> ${r.publication_type ?? '—'}</p>
        <p><strong>Issue Number:</strong> ${r.issue_number ?? '—'}</p>
        <p><strong>Issue Frequency:</strong> ${r.issue_frequency ?? '—'}</p>
        <p><strong>Description:</strong> ${r.description ?? '—'}</p>
        
        <h3>Business Information</h3>
        <p><strong>Website/Social:</strong> ${r.social_website_link ?? '—'}</p>
        <p><strong>Print Run:</strong> ${r.print_run ?? '—'}</p>
        <p><strong>Available Quantity:</strong> ${r.available_quantity ?? '—'}</p>
        <p><strong>Wholesale Price:</strong> $${r.wholesale_price ?? '—'}</p>
        <p><strong>Suggested Retail Price:</strong> $${r.suggested_retail_price ?? '—'}</p>
        
        <h3>Sales & Distribution</h3>
        <p><strong>Has Sold Before:</strong> ${r.has_sold_before ? 'Yes' : 'No'}</p>
        <p><strong>Distribution Channels:</strong> ${Array.isArray(r.distribution_channels) ? r.distribution_channels.join(', ') : r.distribution_channels ?? '—'}</p>
        <p><strong>Copies Sold Estimate:</strong> ${r.copies_sold_estimate ?? '—'}</p>
        <p><strong>Sales Feedback:</strong> ${r.quotes_feedback ?? '—'}</p>
        
        <h3>Fulfillment</h3>
        <p><strong>Fulfillment Method:</strong> ${r.fulfillment_method ?? '—'}</p>
        <p><strong>Shipping Location:</strong> ${r.shipping_city ?? '—'}, ${r.shipping_state ?? '—'}, ${r.shipping_country ?? '—'}</p>
        <p><strong>Return Policy:</strong> ${r.accepts_returns ?? '—'}</p>
        
        <h3>Additional Details</h3>
        <p><strong>Specifications:</strong> ${r.specs ?? '—'}</p>
        <p><strong>Cover Image:</strong> ${r.cover_image_url ? `<a href="${r.cover_image_url}">View Image</a>` : '—'}</p>
        <p><strong>Volume Pricing:</strong> ${r.volume_pricing_tiers ? JSON.stringify(r.volume_pricing_tiers) : '—'}</p>
        
        <p><strong>Submitted:</strong> ${new Date(r.created_at).toLocaleString()}</p>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Review this application in your <a href="https://your-admin-dashboard.com/applications">admin dashboard</a>.
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
        to: ['sagenwanne5@gmail.com'], // Use verified email for testing
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
    const confirmationSubject = `📚 Application Received - ${r.magazine_title || 'Your Magazine'}`
    const confirmationHtml = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
          <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
        </div>

        <h2 style="color:#1f2937;font-size:20px;margin-bottom:20px;">Thank you for your application!</h2>

        <p style="color:#374151;margin-bottom:15px;">Hi ${r.first_name || 'there'},</p>

        <p style="color:#374151;margin-bottom:15px;">
          We've successfully received your publisher application for <strong>${r.magazine_title || 'your magazine'}</strong>.
          Our team will review your submission and get back to you within 3-5 business days.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
          <h3 style="color:#1f2937;font-size:16px;margin:0 0 10px 0;">Application Summary</h3>
          <p style="color:#6b7280;margin:5px 0;"><strong>Magazine Title:</strong> ${r.magazine_title || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Publisher:</strong> ${r.first_name || '—'} ${r.last_name || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Business:</strong> ${r.business_name || '—'}</p>
          <p style="color:#6b7280;margin:5px 0;"><strong>Application ID:</strong> ${r.id || '—'}</p>
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
        from: 'Neesh Applications <onboarding@resend.dev>',
        to: ['sagenwanne5@gmail.com'], // Use verified email for testing
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
    console.error('Error in publisher-notify function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
