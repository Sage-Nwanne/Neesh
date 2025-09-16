// Admin API Service for NEESH Admin Panel
// This service handles all admin-related API calls

import { config } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';

export interface Application {
  id: string;
  type: 'publisher' | 'retailer';
  applicantName: string;
  businessName: string;
  email: string;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: string;
  magazineTitle?: string;
  storeLocation?: string;
  applicationData?: any;
}

export interface ReportedPublisher {
  id: string;
  publisherName: string;
  businessName: string;
  reportReason: string;
  reportedAt: string;
  reportedBy: string;
  status: 'under_review' | 'resolved' | 'dismissed';
  details?: string;
}

export interface AdminMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
  isReplied: boolean;
  attachments?: string[];
}

export interface MailingListSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  deniedApplications: number;
  totalReports: number;
  unreadMessages: number;
  pendingReplyMessages: number;
  totalSubscribers: number;
  activeSubscribers: number;
}

class AdminApiService {
  // Use Supabase directly - no need for Express backend for data fetching

  private async checkAdminAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No authentication session');
    }

    const userRole = session.user.app_metadata?.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      throw new Error('Admin access required');
    }

    return session.user;
  }

  // Applications Management
  async getApplications(): Promise<Application[]> {
    try {
      await this.checkAdminAuth();

      // Fetch both publisher and retailer applications from Supabase
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
        throw new Error('Failed to fetch publisher applications');
      }

      if (retailerResult.error) {
        console.error('Error fetching retailer applications:', retailerResult.error);
        throw new Error('Failed to fetch retailer applications');
      }

      // Transform and combine the data
      const publisherApplications = (publisherResult.data || []).map(app => ({
        id: app.id,
        type: 'publisher' as const,
        applicantName: `${app.first_name} ${app.last_name}`,
        businessName: app.magazine_title,
        email: app.email,
        status: app.status || 'pending',
        submittedAt: app.created_at,
        magazineTitle: app.magazine_title,
        applicationData: app
      }));

      const retailerApplications = (retailerResult.data || []).map(app => ({
        id: app.id,
        type: 'retailer' as const,
        applicantName: app.buyer_name,
        businessName: app.shop_name,
        email: app.buyer_email,
        status: app.status || 'pending',
        submittedAt: app.created_at,
        storeLocation: app.shop_location,
        applicationData: app
      }));

      // Combine and sort by submission date
      const allApplications = [...publisherApplications, ...retailerApplications]
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      return allApplications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  async getApplicationDetails(id: string, type: 'publisher' | 'retailer'): Promise<Application> {
    try {
      await this.checkAdminAuth();

      const tableName = type === 'publisher' ? 'publisher_applications' : 'retailer_applications';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching application details:', error);
        throw new Error('Failed to fetch application details');
      }

      if (!data) {
        throw new Error('Application not found');
      }

      // Transform the raw data into Application format
      return {
        id: data.id,
        type: type,
        applicantName: type === 'publisher'
          ? `${data.first_name || ''} ${data.last_name || ''}`.trim()
          : data.buyer_name || '',
        businessName: type === 'publisher'
          ? data.magazine_title || ''
          : data.shop_name || '',
        email: type === 'publisher' ? data.email : data.buyer_email,
        status: data.status || 'pending',
        submittedAt: data.created_at,
        magazineTitle: data.magazine_title,
        storeLocation: type === 'retailer' ? data.shop_location : undefined,
        applicationData: data // Store the full raw data for detailed view
      };
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  }

  async approveApplication(applicationId: string, applicationType: 'publisher' | 'retailer' = 'publisher'): Promise<boolean> {
    try {
      await this.checkAdminAuth();

      const tableName = applicationType === 'publisher' ? 'publisher_applications' : 'retailer_applications';
      const { error } = await supabase
        .from(tableName)
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (error) {
        console.error('Error approving application:', error);
        throw new Error('Failed to approve application');
      }

      return true;
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  }

  async denyApplication(applicationId: string, reason?: string, applicationType: 'publisher' | 'retailer' = 'publisher'): Promise<boolean> {
    try {
      await this.checkAdminAuth();

      const tableName = applicationType === 'publisher' ? 'publisher_applications' : 'retailer_applications';
      const { error } = await supabase
        .from(tableName)
        .update({
          status: 'denied',
          denial_reason: reason
        })
        .eq('id', applicationId);

      if (error) {
        console.error('Error denying application:', error);
        throw new Error('Failed to deny application');
      }

      return true;
    } catch (error) {
      console.error('Error denying application:', error);
      throw error;
    }
  }

  // Reports Management
  async getReportedPublishers(): Promise<ReportedPublisher[]> {
    try {
      // Mock data for now - replace with actual API call
      return [
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
        },
        {
          id: '3',
          publisherName: 'David Miller',
          businessName: 'Questionable Press',
          reportReason: 'Poor quality products',
          reportedAt: '2024-01-10T09:15:00Z',
          reportedBy: 'bookstore@example.com',
          status: 'resolved'
        }
      ];
    } catch (error) {
      console.error('Error fetching reported publishers:', error);
      return [];
    }
  }

  async resolveReport(reportId: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Resolving report ${reportId}`);
      return true;
    } catch (error) {
      console.error('Error resolving report:', error);
      throw error;
    }
  }

  async dismissReport(reportId: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Dismissing report ${reportId}`);
      return true;
    } catch (error) {
      console.error('Error dismissing report:', error);
      throw error;
    }
  }

  // Messages Management
  async getMessages(): Promise<AdminMessage[]> {
    try {
      // Mock data for now - replace with actual API call
      return [
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
        },
        {
          id: '3',
          from: 'support@magazine.com',
          subject: 'Technical issue with platform',
          body: 'We are experiencing some technical difficulties with the publisher dashboard. Can you help?',
          receivedAt: '2024-01-13T12:10:00Z',
          isRead: true,
          isReplied: true
        }
      ];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Marking message ${messageId} as read`);
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  async replyToMessage(messageId: string, replyBody: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Replying to message ${messageId}:`, replyBody);
      return true;
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  }

  // Mailing List Management
  async getMailingListSubscribers(): Promise<MailingListSubscriber[]> {
    try {
      await this.checkAdminAuth();

      const { data, error } = await supabase
        .from('mailing_list_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) {
        console.error('Error fetching mailing list:', error);
        throw new Error('Failed to fetch mailing list');
      }

      return (data || []).map(entry => ({
        id: entry.id,
        email: entry.email,
        status: entry.status || 'active',
        source: entry.source || 'website',
        subscribed_at: entry.subscribed_at,
        unsubscribed_at: entry.unsubscribed_at,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }));
    } catch (error) {
      console.error('Error fetching mailing list subscribers:', error);
      return [];
    }
  }

  // Admin Statistics
  async getAdminStats(): Promise<AdminStats> {
    try {
      await this.checkAdminAuth();

      // Get counts from both application tables
      const [publisherStats, retailerStats, mailingListStats] = await Promise.all([
        supabase
          .from('publisher_applications')
          .select('status', { count: 'exact' }),
        supabase
          .from('retailer_applications')
          .select('status', { count: 'exact' }),
        supabase
          .from('mailing_list_subscribers')
          .select('*', { count: 'exact' })
      ]);

      // Count applications by status
      const publisherApps = publisherStats.data || [];
      const retailerApps = retailerStats.data || [];
      const allApps = [...publisherApps, ...retailerApps];

      const totalApplications = allApps.length;
      const pendingApplications = allApps.filter(app => app.status === 'pending' || !app.status).length;
      const approvedApplications = allApps.filter(app => app.status === 'approved').length;
      const deniedApplications = allApps.filter(app => app.status === 'rejected' || app.status === 'denied').length;
      const totalSubscribers = mailingListStats.count || 0;

      return {
        totalApplications,
        pendingApplications,
        approvedApplications,
        deniedApplications,
        totalReports: 0, // TODO: Implement reports tracking
        unreadMessages: 0, // TODO: Implement message tracking
        pendingReplyMessages: 0, // TODO: Implement message tracking
        totalSubscribers,
        activeSubscribers: totalSubscribers // Assuming all are active for now
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
}

export const adminApi = new AdminApiService();
