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

    const url = new URL(req.url)
    const path = url.pathname

    // POST /mailing-list/subscribe
    if (req.method === 'POST' && path.endsWith('/subscribe')) {
      const { email } = await req.json()

      // Validate email
      if (!email || !email.includes('@')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Please provide a valid email address'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      // Check if email already exists
      const { data: existingSubscriber, error: checkError } = await supabaseClient
        .from('mailing_list_subscribers')
        .select('email')
        .eq('email', email.toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing subscriber:', checkError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Database error occurred'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }

      if (existingSubscriber) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'You\'re already subscribed to our mailing list!'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      // Add to database
      const { data: newSubscriber, error: insertError } = await supabaseClient
        .from('mailing_list_subscribers')
        .insert([{
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          status: 'active',
          source: 'website'
        }])
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting subscriber:', insertError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to subscribe. Please try again.'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }

      // Send welcome email via Resend
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
      if (RESEND_API_KEY) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'NEESH <hi@mail.neesh.art>',
              to: [email],
              subject: 'Welcome to NEESH!',
              html: `
                <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH Logo" style="height: 60px; margin-bottom: 20px;" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to NEESH!</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">The Independent Magazine Marketplace</p>
                  </div>
                  
                  <div style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Thank you for joining us!</h2>
                    
                    <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                      You're now part of the NEESH community! We're excited to keep you updated on:
                    </p>
                    
                    <ul style="color: #666666; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                      <li>New independent magazines joining our marketplace</li>
                      <li>Exclusive publisher spotlights and stories</li>
                      <li>Platform updates and new features</li>
                      <li>Special events and community highlights</li>
                    </ul>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://neesh.art" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                        Explore NEESH
                      </a>
                    </div>
                    
                    <p style="color: #999999; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
                      Follow us on social media for daily updates and behind-the-scenes content.
                    </p>
                  </div>
                  
                  <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #6c757d; font-size: 12px; margin: 0;">
                      You can <a href="https://neesh.art/unsubscribe?email=${encodeURIComponent(email)}" style="color: #667eea;">unsubscribe</a> at any time.
                    </p>
                  </div>
                </div>
              `,
            }),
          })

          if (!emailResponse.ok) {
            console.error('Failed to send welcome email:', await emailResponse.text())
          }
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError)
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully subscribed to our mailing list! Check your email for a welcome message.',
          subscriber: newSubscriber
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // POST /mailing-list/unsubscribe
    if (req.method === 'POST' && path.endsWith('/unsubscribe')) {
      const { email } = await req.json()

      if (!email || !email.includes('@')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Please provide a valid email address'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }

      const { error } = await supabaseClient
        .from('mailing_list_subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('email', email.toLowerCase())

      if (error) {
        console.error('Error unsubscribing:', error)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to unsubscribe. Please try again.'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully unsubscribed from our mailing list.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    )

  } catch (error) {
    console.error('Mailing list function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
