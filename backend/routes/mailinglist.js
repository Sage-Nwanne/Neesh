import express from 'express';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Subscribe to mailing list
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if email already exists in our mailing list
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('mailing_list_subscribers')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }

    if (existingSubscriber) {
      return res.status(200).json({
        success: true,
        message: 'You\'re already subscribed to our mailing list!'
      });
    }

    // Add to our database
    const { data: newSubscriber, error: insertError } = await supabase
      .from('mailing_list_subscribers')
      .insert([{
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
        status: 'active',
        source: 'website'
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting subscriber:', insertError);
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe. Please try again.'
      });
    }

    // Send welcome email via Resend
    try {
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'hi@neesh.art',
        to: [email],
        subject: 'Welcome to NEESH!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to NEESH!</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
            <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header with NEESH branding -->
              <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
                <img src="https://neesh.art/NEESH-logo-transparent.png.png" alt="NEESH" style="height: 60px; margin-bottom: 20px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">Welcome to NEESH!</h1>
              </div>

              <!-- Main content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333; font-size: 18px; line-height: 1.6; margin-bottom: 25px; font-weight: 500;">
                  Thanks for subscribing to our mailing list!
                </p>

                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                  You'll be the first to know about all things NEESH, including:
                </p>

                <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                  <ul style="color: #555; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;">🏪 New independent magazines joining our platform</li>
                    <li style="margin-bottom: 8px;">📖 Featured publishers and their inspiring stories</li>
                    <li style="margin-bottom: 8px;">🚀 Platform updates and exciting new features</li>
                    <li style="margin-bottom: 8px;">📰 Indie print news, trends, and industry insights</li>
                    <li>🎯 Exclusive opportunities for publishers and retailers</li>
                  </ul>
                </div>

                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                  We're building something special for the independent print community, and we're excited to have you along for the journey. Together, we're keeping indie print moving forward.
                </p>

                <div style="text-align: center; margin: 35px 0;">
                  <a href="https://neesh.art" style="background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: opacity 0.3s;">
                    Explore NEESH
                  </a>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    Have questions? <a href="mailto:hi@neesh.art" style="color: #000; text-decoration: none; font-weight: 500;">Talk to the Team</a>
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0 0 15px 0; font-weight: 500;">
                  NEESH - Connecting independent publishers with retailers who celebrate print culture
                </p>

                <div style="margin: 20px 0;">
                  <a href="https://www.instagram.com/neeshprint" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 14px;">Instagram</a>
                  <span style="color: #ccc;">|</span>
                  <a href="https://neesh.art" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 14px;">Website</a>
                  <span style="color: #ccc;">|</span>
                  <a href="mailto:hi@neesh.art" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact</a>
                </div>

                <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
                  If you no longer wish to receive these emails, you can
                  <a href="mailto:hi@neesh.art?subject=Unsubscribe&body=Please unsubscribe ${email} from the NEESH mailing list." style="color: #666; text-decoration: underline;">unsubscribe here</a>.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      if (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the subscription if email fails
      } else {
        console.log('Welcome email sent successfully:', emailData);
      }
    } catch (emailError) {
      console.error('Error with Resend email:', emailError);
      // Don't fail the subscription if email fails
    }

    // Send notification to admin
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'hi@neesh.art',
        to: ['hi@neesh.art'],
        subject: 'New Mailing List Subscription',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Mailing List Subscription</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Source:</strong> Website</p>
          </div>
        `
      });
    } catch (notificationError) {
      console.error('Error sending admin notification:', notificationError);
      // Don't fail the subscription if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! Check your email for a welcome message.',
      data: {
        email: newSubscriber.email,
        subscribed_at: newSubscriber.subscribed_at
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

// Unsubscribe from mailing list
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const { error } = await supabase
      .from('mailing_list_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase());

    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from our mailing list.'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

export default router;
