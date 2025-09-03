// Admin API Service for NEESH Admin Panel
// This service handles all admin-related API calls

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

import { config } from '@/lib/config';

class AdminApiService {
  private baseUrl = config.api.baseUrl;

  // Applications Management
  async getApplications(): Promise<Application[]> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async approveApplication(applicationId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/applications/${applicationId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
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

  async denyApplication(applicationId: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/applications/${applicationId}/deny`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
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
      throw error;
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
      throw error;
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
