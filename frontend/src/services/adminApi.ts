// Admin API Service for NEESH Admin Panel
// This service handles all admin-related API calls

import { config } from '@/lib/config';
import { createClient } from '@supabase/supabase-js';

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

export interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  deniedApplications: number;
  totalReports: number;
  unreadMessages: number;
  pendingReplyMessages: number;
}

class AdminApiService {
  // Use Supabase URL for Edge Functions
  private baseUrl = `${config.supabase.url}/functions/v1`;
  private supabase = createClient(config.supabase.url, config.supabase.anonKey);

  private async getAuthHeaders() {
    // Get the current user's access token from Supabase
    const { data: { session } } = await this.supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Applications Management
  async getApplications(): Promise<Application[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/admin`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  async getApplicationDetails(id: string, type: 'publisher' | 'retailer'): Promise<Application> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/admin/applications/${id}?type=${type}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch application details');
      }

      const data = await response.json();

      // Transform the raw data into Application format
      return {
        id: data.id,
        type: data.type,
        applicantName: type === 'publisher'
          ? `${data.first_name || ''} ${data.last_name || ''}`.trim()
          : data.buyer_name || '',
        businessName: type === 'publisher'
          ? data.business_name || ''
          : data.shop_name || '',
        email: type === 'publisher' ? data.email : data.buyer_email,
        status: data.status || 'pending',
        submittedAt: data.submitted_at || data.created_at,
        magazineTitle: data.magazine_title,
        storeLocation: type === 'retailer' && data.business_city && data.business_state
          ? `${data.business_city}, ${data.business_state}`
          : undefined,
        applicationData: data // Store the full raw data for detailed view
      };
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  }

  async approveApplication(applicationId: string, applicationType: 'publisher' | 'retailer' = 'publisher'): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/admin/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ type: applicationType })
      });

      if (!response.ok) {
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
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/admin/applications/${applicationId}/deny`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ reason, type: applicationType })
      });

      if (!response.ok) {
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

  // Admin Statistics
  async getAdminStats(): Promise<AdminStats> {
    try {
      // Mock data for now - replace with actual API call
      return {
        totalApplications: 15,
        pendingApplications: 5,
        approvedApplications: 8,
        deniedApplications: 2,
        totalReports: 3,
        unreadMessages: 2,
        pendingReplyMessages: 4
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }
}

export const adminApi = new AdminApiService();
