import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationConfirmationRequest {
  applicationId: string
  applicationType: 'publisher' | 'retailer'
  applicantEmail: string
  applicantName: string
  businessName?: string
  magazineTitle?: string
  shopName?: string
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

    const { 
      applicationId, 
      applicationType, 
      applicantEmail, 
      applicantName,
      businessName,
      magazineTitle,
      shopName
    }: ApplicationConfirmationRequest = await req.json()

    // Email configuration
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Prepare email content based on application type
    let subject: string
    let html: string

    if (applicationType === 'publisher') {
      subject = `Application Received - ${magazineTitle || 'Your Magazine'}`
      html = `
        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
          <div style="text-align:center;margin-bottom:30px;">
            <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
            <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
          </div>
          
          <h2 style="color:#059669;font-size:20px;margin-bottom:20px;">Application Received!</h2>
          
          <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
          
          <p style="color:#374151;margin-bottom:15px;">
            Thank you for submitting your publisher application for <strong>${magazineTitle || 'your magazine'}</strong>! 
            We've received your application and our team will begin reviewing it shortly.
          </p>
          
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
            <h3 style="color:#059669;font-size:16px;margin:0 0 10px 0;">📋 Application Details:</h3>
            <ul style="color:#374151;margin:0;padding-left:20px;">
              <li><strong>Application ID:</strong> ${applicationId}</li>
              <li><strong>Magazine Title:</strong> ${magazineTitle || 'N/A'}</li>
              <li><strong>Business Name:</strong> ${businessName || 'N/A'}</li>
              <li><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:20px;margin:20px 0;">
            <h3 style="color:#d97706;font-size:16px;margin:0 0 10px 0;">⏰ What's Next?</h3>
            <p style="color:#374151;margin:0;">
              Our team will review your application within <strong>5-7 business days</strong>. 
              You'll receive an email notification once we've made a decision.
            </p>
          </div>
          
          <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
            <h3 style="color:#2563eb;font-size:16px;margin:0 0 15px 0;">📧 Stay Updated!</h3>
            <p style="color:#374151;margin:0 0 15px 0;">
              Join our mailing list to get the latest updates about NEESH and the independent magazine community.
            </p>
            <a href="https://neesh.art/mailing-list" 
               style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;">
              Join Mailing List
            </a>
          </div>
          
          <p style="color:#374151;margin-bottom:15px;">
            If you have any questions about your application, feel free to reach out to us at 
            <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
          </p>
          
          <p style="color:#374151;margin-bottom:30px;">
            Thank you for choosing NEESH!<br>
            The NEESH Team
          </p>
          
          <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    } else {
      // Retailer application
      subject = `Application Received - ${shopName || 'Your Shop'}`
      html = `
        <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
          <div style="text-align:center;margin-bottom:30px;">
            <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
            <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
          </div>
          
          <h2 style="color:#059669;font-size:20px;margin-bottom:20px;">Application Received!</h2>
          
          <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
          
          <p style="color:#374151;margin-bottom:15px;">
            Thank you for submitting your retailer application for <strong>${shopName || 'your shop'}</strong>! 
            We've received your application and our team will begin reviewing it shortly.
          </p>
          
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
            <h3 style="color:#059669;font-size:16px;margin:0 0 10px 0;">📋 Application Details:</h3>
            <ul style="color:#374151;margin:0;padding-left:20px;">
              <li><strong>Application ID:</strong> ${applicationId}</li>
              <li><strong>Shop Name:</strong> ${shopName || 'N/A'}</li>
              <li><strong>Business Name:</strong> ${businessName || 'N/A'}</li>
              <li><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:20px;margin:20px 0;">
            <h3 style="color:#d97706;font-size:16px;margin:0 0 10px 0;">⏰ What's Next?</h3>
            <p style="color:#374151;margin:0;">
              Our team will review your application within <strong>5-7 business days</strong>. 
              You'll receive an email notification once we've made a decision.
            </p>
          </div>
          
          <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
            <h3 style="color:#2563eb;font-size:16px;margin:0 0 15px 0;">📧 Stay Updated!</h3>
            <p style="color:#374151;margin:0 0 15px 0;">
              Join our mailing list to get the latest updates about NEESH and the independent magazine community.
            </p>
            <a href="https://neesh.art/mailing-list" 
               style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:500;">
              Join Mailing List
            </a>
          </div>
          
          <p style="color:#374151;margin-bottom:15px;">
            If you have any questions about your application, feel free to reach out to us at 
            <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
          </p>
          
          <p style="color:#374151;margin-bottom:30px;">
            Thank you for choosing NEESH!<br>
            The NEESH Team
          </p>
          
          <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              This is an automated confirmation email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `
    }

    // Send email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Applications <applications@mail.neesh.art>',
        to: [applicantEmail],
        subject: subject,
        html: html,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email sending failed: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Confirmation email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        applicationType,
        applicationId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Application confirmation email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
