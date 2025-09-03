import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

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
      const decoded = JSON.parse(atob(token));

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

// GET /api/admin/applications - Get all publisher applications
router.get('/applications', requireAdmin, async (req, res) => {
  try {
    const { data: applications, error } = await supabase
      .from('publisher_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ message: 'Failed to fetch applications' });
    }

    // Transform data to match admin panel interface
    const transformedApplications = applications.map(app => ({
      id: app.id,
      type: 'publisher',
      applicantName: `${app.first_name || 'Unknown'} ${app.last_name || 'User'}`,
      businessName: app.business_name || 'Unknown Business',
      email: app.email || 'No email',
      status: app.status,
      submittedAt: app.created_at, // Use created_at instead of submitted_at
      magazineTitle: app.magazine_title,
      applicationData: app
    }));

    res.json(transformedApplications);
  } catch (error) {
    console.error('Admin applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/applications/:id/approve - Approve application
router.put('/applications/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: application, error } = await supabase
      .from('publisher_applications')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
        // Skip reviewed_by for now since it expects UUID
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error approving application:', error);
      return res.status(500).json({ message: 'Failed to approve application' });
    }

    res.json({
      message: 'Application approved successfully',
      application
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
    const { reason } = req.body;

    const { data: application, error } = await supabase
      .from('publisher_applications')
      .update({
        status: 'denied',
        reviewer_notes: reason,
        reviewed_at: new Date().toISOString()
        // Skip reviewed_by for now since it expects UUID
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error denying application:', error);
      return res.status(500).json({ message: 'Failed to deny application' });
    }

    res.json({
      message: 'Application denied successfully',
      application
    });
  } catch (error) {
    console.error('Deny application error:', error);
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
    // Get application counts
    const { data: applications, error: appError } = await supabase
      .from('publisher_applications')
      .select('status');

    if (appError) {
      console.error('Error fetching application stats:', error);
      return res.status(500).json({ message: 'Failed to fetch statistics' });
    }

    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      approvedApplications: applications.filter(app => app.status === 'approved').length,
      deniedApplications: applications.filter(app => app.status === 'denied').length,
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
