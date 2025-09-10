import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Email service function for sending invitation emails
const sendRetailerInvitationEmail = async (application) => {
  try {
    // Generate a temporary invitation token (in production, use proper JWT)
    const invitationToken = Buffer.from(JSON.stringify({
      applicationId: application.id,
      email: application.buyer_email,
      shopName: application.shop_name,
      timestamp: Date.now()
    })).toString('base64');

    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/retailer-setup?token=${invitationToken}`;

    // For now, just log the invitation details
    // In production, you would send this via email service (Resend, SendGrid, etc.)
    console.log('=== RETAILER INVITATION EMAIL ===');
    console.log(`To: ${application.buyer_email}`);
    console.log(`Shop: ${application.shop_name}`);
    console.log(`Application ID: ${application.application_number}`);
    console.log(`Invitation Link: ${invitationLink}`);
    console.log('================================');

    // Send actual email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Team <team@mail.neesh.art>',
        to: [application.buyer_email],
        subject: `Welcome to Neesh! Set up your retailer account for ${application.shop_name}`,
        html: `
          <h2>Congratulations! Your retailer application has been approved.</h2>
          <p>Welcome to the Neesh marketplace, ${application.buyer_name}!</p>
          <p>Your application for <strong>${application.shop_name}</strong> has been approved.</p>
          <p><a href="${invitationLink}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Set Up Your Account</a></p>
          <p>This link will allow you to create your login credentials and access your retailer dashboard.</p>
          <p>Application ID: ${application.id}</p>
        `
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send email:', await emailResponse.text());
      return false;
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Email sent successfully:', emailResult.id);

    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

// Email service function for sending publisher invitation emails
const sendPublisherInvitationEmail = async (application) => {
  try {
    // Generate a temporary invitation token
    const invitationToken = Buffer.from(JSON.stringify({
      applicationId: application.id,
      email: application.email,
      businessName: application.business_name,
      timestamp: Date.now()
    })).toString('base64');

    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/publisher-setup?token=${invitationToken}`;

    console.log('=== PUBLISHER INVITATION EMAIL ===');
    console.log(`To: ${application.email}`);
    console.log(`Business: ${application.business_name}`);
    console.log(`Magazine: ${application.magazine_title}`);
    console.log(`Invitation Link: ${invitationLink}`);
    console.log('==================================');

    // Send actual email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Neesh Team <team@mail.neesh.art>',
        to: [application.email],
        subject: `Welcome to Neesh! Set up your publisher account for ${application.business_name}`,
        html: `
          <h2>Congratulations! Your publisher application has been approved.</h2>
          <p>Welcome to the Neesh marketplace, ${application.first_name} ${application.last_name}!</p>
          <p>Your application for <strong>${application.business_name}</strong> and your magazine <strong>${application.magazine_title}</strong> has been approved.</p>
          <p><a href="${invitationLink}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Set Up Your Account</a></p>
          <p>This link will allow you to create your login credentials and access your publisher dashboard.</p>
          <p>Application ID: ${application.id}</p>
        `
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send publisher email:', await emailResponse.text());
      return false;
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Publisher email sent successfully:', emailResult.id);

    return true;
  } catch (error) {
    console.error('Error sending publisher invitation email:', error);
    return false;
  }
};

// Simple admin authentication middleware (for development)
const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
      // Decode the simple token (base64 encoded JSON)
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());

      if (decoded.role === 'admin' || decoded.role === 'owner') {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({ message: 'Admin access required' });
      }
    } catch (decodeError) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// GET /api/admin/applications - Get all applications (publisher and retailer)
router.get('/applications', requireAdmin, async (req, res) => {
  try {
    // Fetch both publisher and retailer applications
    const [publisherResult, retailerResult] = await Promise.all([
      supabase
        .from('publisher_applications')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('retailer_applications')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    if (publisherResult.error) {
      console.error('Error fetching publisher applications:', publisherResult.error);
      return res.status(500).json({ message: 'Failed to fetch publisher applications' });
    }

    if (retailerResult.error) {
      console.error('Error fetching retailer applications:', retailerResult.error);
      return res.status(500).json({ message: 'Failed to fetch retailer applications' });
    }

    // Transform publisher applications
    const transformedPublisherApps = publisherResult.data.map(app => ({
      id: app.id,
      type: 'publisher',
      applicantName: `${app.first_name || 'Unknown'} ${app.last_name || 'User'}`,
      businessName: app.business_name || 'Unknown Business',
      email: app.email || 'No email',
      status: app.status,
      submittedAt: app.created_at,
      magazineTitle: app.magazine_title,
      applicationData: app
    }));

    // Transform retailer applications
    const transformedRetailerApps = retailerResult.data.map(app => ({
      id: app.id,
      type: 'retailer',
      applicantName: app.buyer_name || 'Unknown Buyer',
      businessName: app.shop_name || 'Unknown Shop',
      email: app.buyer_email || 'No email',
      status: app.status || 'pending',
      submittedAt: app.created_at,
      storeLocation: `${app.business_city || ''}, ${app.business_state || ''}`.trim().replace(/^,|,$/, ''),
      applicationData: app
    }));

    // Combine and sort by submission date
    const allApplications = [...transformedPublisherApps, ...transformedRetailerApps]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    res.json(allApplications);
  } catch (error) {
    console.error('Admin applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/applications/:id/approve - Approve application
router.put('/applications/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'publisher' or 'retailer'
    const reviewedBy = req.user?.userId || 'admin';

    // Get application data first
    const tableName = type === 'retailer' ? 'retailer_applications' : 'publisher_applications';
    const { data: application, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    const updateData = {
      status: 'approved',
      reviewed_at: new Date().toISOString()
    };

    // Only add reviewed_by if it's a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(reviewedBy)) {
      updateData.reviewed_by = reviewedBy;
    }

    const { error: updateError } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return res.status(500).json({ message: 'Failed to update application status' });
    }

    // Send approval email using Edge Function
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const edgeFunctionResponse = await fetch(`${SUPABASE_URL}/functions/v1/application-decision`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId: id,
        applicationType: type || 'publisher',
        decision: 'approved',
        reviewedBy: reviewedBy
      }),
    });

    let emailResult = { success: false, emailId: null };
    if (edgeFunctionResponse.ok) {
      emailResult = await edgeFunctionResponse.json();
    } else {
      const errorText = await edgeFunctionResponse.text();
      console.error('Edge function error:', errorText);
    }

    res.json({
      message: 'Application approved successfully',
      emailSent: emailResult.success,
      emailId: emailResult.emailId || null
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/applications/:id/deny - Deny application
router.put('/applications/:id/deny', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, type } = req.body; // 'publisher' or 'retailer'
    const reviewedBy = req.user?.userId || 'admin'; // Get from authenticated user

    // Call the application-decision edge function
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const edgeFunctionResponse = await fetch(`${SUPABASE_URL}/functions/v1/application-decision`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId: id,
        applicationType: type || 'publisher',
        decision: 'denied',
        reviewedBy: reviewedBy,
        denialReason: reason
      }),
    });

    if (!edgeFunctionResponse.ok) {
      const errorText = await edgeFunctionResponse.text();
      console.error('Edge function error:', errorText);
      return res.status(500).json({ message: 'Failed to process denial' });
    }

    const result = await edgeFunctionResponse.json();

    res.json({
      message: 'Application denied successfully',
      emailSent: result.success,
      emailId: result.emailId
    });
  } catch (error) {
    console.error('Deny application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/applications/:id - Get detailed application data
router.get('/applications/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'publisher' or 'retailer'

    let application, error;

    if (type === 'retailer') {
      const result = await supabase
        .from('retailer_applications')
        .select('*')
        .eq('id', id)
        .single();

      application = result.data;
      error = result.error;
    } else {
      // Default to publisher
      const result = await supabase
        .from('publisher_applications')
        .select('*')
        .eq('id', id)
        .single();

      application = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching application:', error);
      return res.status(500).json({ message: 'Failed to fetch application' });
    }

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      ...application,
      type: type || 'publisher'
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/reports - Get reported publishers (mock for now)
router.get('/reports', requireAdmin, async (req, res) => {
  try {
    // Mock data for now - you can implement actual reports table later
    const mockReports = [
      {
        id: '1',
        publisherName: 'Alex Thompson',
        businessName: 'Fake Magazine Co',
        reportReason: 'Fraudulent business practices',
        reportedAt: '2024-01-12T16:45:00Z',
        reportedBy: 'retailer@example.com',
        status: 'under_review'
      },
      {
        id: '2',
        publisherName: 'Lisa Brown',
        businessName: 'Scam Publications',
        reportReason: 'Inappropriate messaging to retailers',
        reportedAt: '2024-01-11T11:30:00Z',
        reportedBy: 'store@example.com',
        status: 'under_review'
      }
    ];

    res.json(mockReports);
  } catch (error) {
    console.error('Admin reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/messages - Get messages from hi@neesh.art (mock for now)
router.get('/messages', requireAdmin, async (req, res) => {
  try {
    // Mock data for now - you can implement actual email integration later
    const mockMessages = [
      {
        id: '1',
        from: 'publisher@example.com',
        subject: 'Question about application process',
        body: 'Hi, I submitted my application last week and wanted to check on the status. Could you please provide an update?',
        receivedAt: '2024-01-15T08:30:00Z',
        isRead: false,
        isReplied: false
      },
      {
        id: '2',
        from: 'retailer@bookstore.com',
        subject: 'Partnership inquiry',
        body: 'We are interested in becoming a retail partner and would like to know more about the process.',
        receivedAt: '2024-01-14T15:20:00Z',
        isRead: true,
        isReplied: false
      }
    ];

    res.json(mockMessages);
  } catch (error) {
    console.error('Admin messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/stats - Get admin dashboard statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Get application counts from both tables
    const [publisherResult, retailerResult] = await Promise.all([
      supabase.from('publisher_applications').select('status'),
      supabase.from('retailer_applications').select('status')
    ]);

    if (publisherResult.error) {
      console.error('Error fetching publisher application stats:', publisherResult.error);
      return res.status(500).json({ message: 'Failed to fetch publisher statistics' });
    }

    if (retailerResult.error) {
      console.error('Error fetching retailer application stats:', retailerResult.error);
      return res.status(500).json({ message: 'Failed to fetch retailer statistics' });
    }

    // Combine all applications
    const allApplications = [
      ...(publisherResult.data || []),
      ...(retailerResult.data || [])
    ];

    const stats = {
      totalApplications: allApplications.length,
      pendingApplications: allApplications.filter(app => (app.status || 'pending') === 'pending').length,
      approvedApplications: allApplications.filter(app => app.status === 'approved').length,
      deniedApplications: allApplications.filter(app => app.status === 'denied').length,
      totalReports: 2, // Mock for now
      unreadMessages: 1, // Mock for now
      pendingReplyMessages: 2 // Mock for now
    };

    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
