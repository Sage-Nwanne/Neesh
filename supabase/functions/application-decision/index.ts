import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationDecisionRequest {
  applicationId: string
  applicationType: 'publisher' | 'retailer'
  decision: 'approved' | 'denied'
  reviewedBy: string
  denialReason?: string
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

    const { applicationId, applicationType, decision, reviewedBy, denialReason }: ApplicationDecisionRequest = await req.json()

    // Email configuration
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Get application data
    const tableName = applicationType === 'publisher' ? 'publisher_applications' : 'retailer_applications'
    const { data: application, error: fetchError } = await supabaseClient
      .from(tableName)
      .select('*')
      .eq('id', applicationId)
      .single()

    if (fetchError || !application) {
      throw new Error(`Application not found: ${fetchError?.message}`)
    }

    // Update application status
    const updateData: any = {
      status: decision,
      reviewed_at: new Date().toISOString(),
      ...(denialReason && { denial_reason: denialReason })
    }

    // Only add reviewed_by if it's a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (uuidRegex.test(reviewedBy)) {
      updateData.reviewed_by = reviewedBy
    }

    const { error: updateError } = await supabaseClient
      .from(tableName)
      .update(updateData)
      .eq('id', applicationId)

    if (updateError) {
      throw new Error(`Failed to update application: ${updateError.message}`)
    }

    // Prepare email content based on decision and type
    let subject: string
    let html: string
    let recipientEmail: string

    if (applicationType === 'publisher') {
      recipientEmail = application.email
      const applicantName = application.first_name || 'there'
      const magazineTitle = application.magazine_title || 'your magazine'

      if (decision === 'approved') {
        // Generate invitation token (in production, use proper JWT)
        const invitationToken = btoa(JSON.stringify({
          applicationId,
          email: application.email,
          type: 'publisher',
          timestamp: Date.now()
        }))

        const dashboardUrl = `${Deno.env.get('FRONTEND_URL') || 'https://neesh.art'}/welcome?token=${invitationToken}`

        subject = `🎉 Welcome to NEESH - ${magazineTitle} Approved!`
        html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:30px;">
              <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
              <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
            </div>

            <div style="text-align:center;margin-bottom:30px;">
              <video width="400" height="225" controls style="border-radius:8px;max-width:100%;">
                <source src="https://neesh.art/Neesh_Brand_Video.mp4" type="video/mp4">
                Your email client doesn't support video playback.
              </video>
            </div>

            <h2 style="color:#16a34a;font-size:20px;margin-bottom:20px;">🎉 Congratulations! Your application has been approved!</h2>
            
            <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
            
            <p style="color:#374151;margin-bottom:15px;">
              Great news! Your publisher application for <strong>${magazineTitle}</strong> has been approved. 
              Welcome to the NEESH community!
            </p>
            
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
              <h3 style="color:#16a34a;font-size:16px;margin:0 0 15px 0;">Next Steps:</h3>
              <ol style="color:#374151;margin:0;padding-left:20px;">
                <li style="margin-bottom:8px;">Click the button below to access your publisher dashboard</li>
                <li style="margin-bottom:8px;">Sign in for the first time using your preferred credentials</li>
                <li style="margin-bottom:8px;">Complete your publisher profile setup</li>
                <li>Start listing your magazines!</li>
              </ol>
            </div>
            
            <div style="text-align:center;margin:30px 0;">
              <a href="${dashboardUrl}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color:#374151;margin-bottom:15px;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
            </p>
            
            <p style="color:#374151;margin-bottom:30px;">
              Welcome aboard!<br>
              The NEESH Team
            </p>
            
            <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                This invitation link will expire in 7 days. If you need a new link, contact us at hi@neesh.art.
              </p>
            </div>
          </div>
        `
      } else {
        subject = `Application Update - ${magazineTitle}`
        html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:30px;">
              <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
              <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
            </div>
            
            <h2 style="color:#dc2626;font-size:20px;margin-bottom:20px;">Application Update</h2>
            
            <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
            
            <p style="color:#374151;margin-bottom:15px;">
              Thank you for your interest in joining NEESH as a publisher. After careful review, 
              we're unable to approve your application for <strong>${magazineTitle}</strong> at this time.
            </p>
            
            ${denialReason ? `
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin:20px 0;">
                <h3 style="color:#dc2626;font-size:16px;margin:0 0 10px 0;">Reason:</h3>
                <p style="color:#374151;margin:0;">${denialReason}</p>
              </div>
            ` : ''}
            
            <p style="color:#374151;margin-bottom:15px;">
              We encourage you to address any feedback and reapply in the future. 
              If you have questions about this decision, please reach out to us at 
              <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
            </p>
            
            <p style="color:#374151;margin-bottom:30px;">
              Thank you for your understanding.<br>
              The NEESH Team
            </p>
          </div>
        `
      }
    } else {
      // Retailer application
      recipientEmail = application.buyer_email
      const applicantName = application.buyer_name || 'there'
      const shopName = application.shop_name || 'your shop'

      if (decision === 'approved') {
        // Generate invitation token
        const invitationToken = btoa(JSON.stringify({
          applicationId,
          email: application.buyer_email,
          type: 'retailer',
          timestamp: Date.now()
        }))

        const dashboardUrl = `${Deno.env.get('FRONTEND_URL') || 'https://neesh.art'}/welcome?token=${invitationToken}`

        subject = `🎉 Welcome to NEESH - ${shopName} Approved!`
        html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:30px;">
              <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
              <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
            </div>

            <div style="text-align:center;margin-bottom:30px;">
              <video width="400" height="225" controls style="border-radius:8px;max-width:100%;">
                <source src="https://neesh.art/Neesh_Brand_Video.mp4" type="video/mp4">
                Your email client doesn't support video playback.
              </video>
            </div>

            <h2 style="color:#16a34a;font-size:20px;margin-bottom:20px;">🎉 Congratulations! Your application has been approved!</h2>
            
            <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
            
            <p style="color:#374151;margin-bottom:15px;">
              Great news! Your retailer application for <strong>${shopName}</strong> has been approved. 
              Welcome to the NEESH retail network!
            </p>
            
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin:20px 0;">
              <h3 style="color:#16a34a;font-size:16px;margin:0 0 15px 0;">Next Steps:</h3>
              <ol style="color:#374151;margin:0;padding-left:20px;">
                <li style="margin-bottom:8px;">Click the button below to access your retailer dashboard</li>
                <li style="margin-bottom:8px;">Sign in for the first time using your preferred credentials</li>
                <li style="margin-bottom:8px;">Browse our magazine catalog</li>
                <li>Start placing orders!</li>
              </ol>
            </div>
            
            <div style="text-align:center;margin:30px 0;">
              <a href="${dashboardUrl}" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:600;display:inline-block;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color:#374151;margin-bottom:15px;">
              If you have any questions, feel free to reach out to us at 
              <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
            </p>
            
            <p style="color:#374151;margin-bottom:30px;">
              Welcome aboard!<br>
              The NEESH Team
            </p>
            
            <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                This invitation link will expire in 7 days. If you need a new link, contact us at hi@neesh.art.
              </p>
            </div>
          </div>
        `
      } else {
        subject = `Application Update - ${shopName}`
        html = `
          <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;max-width:600px;margin:0 auto;padding:20px;">
            <div style="text-align:center;margin-bottom:30px;">
              <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height:60px;margin-bottom:10px;" />
              <p style="color:#6b7280;margin:5px 0 0 0;">Independent Magazine Platform</p>
            </div>
            
            <h2 style="color:#dc2626;font-size:20px;margin-bottom:20px;">Application Update</h2>
            
            <p style="color:#374151;margin-bottom:15px;">Hi ${applicantName},</p>
            
            <p style="color:#374151;margin-bottom:15px;">
              Thank you for your interest in joining NEESH as a retail partner. After careful review, 
              we're unable to approve your application for <strong>${shopName}</strong> at this time.
            </p>
            
            ${denialReason ? `
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;margin:20px 0;">
                <h3 style="color:#dc2626;font-size:16px;margin:0 0 10px 0;">Reason:</h3>
                <p style="color:#374151;margin:0;">${denialReason}</p>
              </div>
            ` : ''}
            
            <p style="color:#374151;margin-bottom:15px;">
              We encourage you to address any feedback and reapply in the future. 
              If you have questions about this decision, please reach out to us at 
              <a href="mailto:hi@neesh.art" style="color:#2563eb;">hi@neesh.art</a>.
            </p>
            
            <p style="color:#374151;margin-bottom:30px;">
              Thank you for your understanding.<br>
              The NEESH Team
            </p>
          </div>
        `
      }
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
        to: ['sagenwanne5@gmail.com'], // Use verified email for testing
        subject: subject,
        html: html,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email sending failed: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Decision email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        decision,
        applicationType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Application decision error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
