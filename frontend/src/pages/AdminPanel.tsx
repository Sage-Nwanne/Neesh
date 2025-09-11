import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminPanel.module.css';
import AdminLogin from '../components/AdminLogin';
import ApplicationDetailModal from '../components/admin/ApplicationDetailModal';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminApi, type Application, type ReportedPublisher, type AdminMessage } from '../services/adminApi';
import { useAnalytics } from '../hooks/useAnalytics';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';
import {
  Users,
  FileText,
  AlertTriangle,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  LogOut
} from 'lucide-react';



const AdminPanel: React.FC = () => {
  const { isAuthenticated, adminUser, isLoading, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'reports' | 'messages' | 'chatbot'>('applications');

  console.log('🔍 AdminPanel render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'adminUser:', adminUser);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reportedPublishers, setReportedPublishers] = useState<ReportedPublisher[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAllReports, setShowAllReports] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'bot', message: string}>>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);

  // Analytics tracking
  const { trackDashboardView, trackApplicationApproval, trackApplicationDenial } = useAnalytics();

  // Notification system
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  // Load data from API
  useEffect(() => {
    console.log('🔄 AdminPanel useEffect triggered, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = async () => {
    try {
      console.log('🔄 Loading admin data...');
      const [applicationsData, reportsData, messagesData] = await Promise.all([
        adminApi.getApplications(),
        adminApi.getReportedPublishers(),
        adminApi.getMessages()
      ]);

      console.log('✅ Applications loaded:', applicationsData.length, applicationsData);
      console.log('✅ Reports loaded:', reportsData.length);
      console.log('✅ Messages loaded:', messagesData.length);

      setApplications(applicationsData);
      setReportedPublishers(reportsData);
      setMessages(messagesData);
    } catch (error) {
      console.error('❌ Error loading admin data:', error);
    }
  };

  const handleApproveApplication = async (id: string, type: 'publisher' | 'retailer' = 'publisher') => {
    try {
      await adminApi.approveApplication(id, type);
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'approved' as const } : app
        )
      );

      // Track the approval
      trackApplicationApproval(type, id);

      // Show success message
      showSuccess(
        'Application Approved!',
        `${type.charAt(0).toUpperCase() + type.slice(1)} application approved successfully. Invitation email sent.`
      );
    } catch (error) {
      console.error('Error approving application:', error);
      showError(
        'Approval Failed',
        'Failed to approve application. Please try again.'
      );
    }
  };

  const handleDenyApplication = async (id: string, type: 'publisher' | 'retailer' = 'publisher', reason?: string) => {
    try {
      await adminApi.denyApplication(id, reason, type);
      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'denied' as const } : app
        )
      );

      // Track the denial
      trackApplicationDenial(type, id);

      // Show success message
      showSuccess(
        'Application Denied',
        `${type.charAt(0).toUpperCase() + type.slice(1)} application denied successfully. Notification email sent.`
      );
    } catch (error) {
      console.error('Error denying application:', error);
      showError(
        'Denial Failed',
        'Failed to deny application. Please try again.'
      );
    }
  };

  const handleViewApplicationDetails = async (application: Application) => {
    try {
      // Fetch detailed application data
      const detailedApplication = await adminApi.getApplicationDetails(application.id, application.type);
      setSelectedApplication(detailedApplication);
      setShowApplicationDetail(true);
    } catch (error) {
      console.error('Error fetching application details:', error);
      showError(
        'Loading Failed',
        'Failed to load application details. Please try again.'
      );
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      await adminApi.resolveReport(id);
      setReportedPublishers(prev =>
        prev.map(report =>
          report.id === id ? { ...report, status: 'resolved' as const } : report
        )
      );
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleDismissReport = async (id: string) => {
    try {
      await adminApi.dismissReport(id);
      setReportedPublishers(prev =>
        prev.map(report =>
          report.id === id ? { ...report, status: 'dismissed' as const } : report
        )
      );
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      await adminApi.markMessageAsRead(id);
      setMessages(prev =>
        prev.map(message =>
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatInput('');

    // Simple chatbot responses
    setTimeout(() => {
      let botResponse = '';
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('pending applications') || lowerInput.includes('how many pending')) {
        const pendingCount = applications.filter(app => app.status === 'pending').length;
        botResponse = `There are currently ${pendingCount} pending applications.`;
      } else if (lowerInput.includes('reported publishers') || lowerInput.includes('reports')) {
        botResponse = `There are ${reportedPublishers.length} reported publishers under review.`;
      } else if (lowerInput.includes('unread messages')) {
        const unreadCount = messages.filter(msg => !msg.isRead).length;
        botResponse = `You have ${unreadCount} unread messages.`;
      } else if (lowerInput.includes('approve all pending') || lowerInput.includes('approve pending')) {
        botResponse = 'I can help you approve applications. Please specify which applications you\'d like to approve, or use the Applications tab for individual approvals.';
      } else {
        botResponse = 'I can help you with: checking pending applications, viewing reports, counting unread messages, and basic data queries. What would you like to know?';
      }

      setChatMessages(prev => [...prev, { type: 'bot', message: botResponse }]);
    }, 1000);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const recentReports = reportedPublishers.slice(0, 10);
  const displayedReports = showAllReports ? reportedPublishers : recentReports;

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className={styles.adminPanel}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logoImage} />
            <span className={styles.adminTitle}>Admin Panel</span>
            <span className={styles.welcomeText}>Welcome, {adminUser?.name}</span>
          </div>
          <div className={styles.headerActions}>
            <Link to="/" className={styles.backToSite}>
              Back to Site
            </Link>
            <button onClick={logout} className={styles.logoutButton}>
              <LogOut className={styles.logoutIcon} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'applications' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileText className={styles.tabIcon} />
          Applications
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reports' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <AlertTriangle className={styles.tabIcon} />
          Reports
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'messages' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <Mail className={styles.tabIcon} />
          Messages
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'chatbot' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('chatbot')}
        >
          <MessageCircle className={styles.tabIcon} />
          Assistant
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Applications Management</h2>
              <div className={styles.controls}>
                <div className={styles.searchBox}>
                  <Search className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
            </div>

            <div className={styles.applicationsList}>
              {console.log('🎯 Rendering applications:', filteredApplications.length, filteredApplications)}
              {filteredApplications.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No applications found matching your criteria.</p>
                  <p>Total applications loaded: {applications.length}</p>
                </div>
              ) : (
                filteredApplications.map(application => (
                <div key={application.id} className={styles.applicationCard}>
                  <div className={styles.applicationHeader}>
                    {application.status === 'pending' && (
                      <div className={styles.quickActions}>
                        <button
                          className={styles.quickApproveBtn}
                          onClick={() => handleApproveApplication(application.id, application.type)}
                          title="Quick Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          className={styles.quickDenyBtn}
                          onClick={() => handleDenyApplication(application.id, application.type)}
                          title="Quick Deny"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    )}

                    <div className={styles.applicantInfo}>
                      <h3>
                        {application.type === 'publisher' ? 'Publisher' : 'Retailer'} - {application.applicantName}
                      </h3>
                      <p className={styles.businessName}>{application.businessName}</p>
                      <span className={`${styles.badge} ${styles[application.type]}`}>
                        {application.type}
                      </span>
                    </div>

                    <div className={styles.applicationStatus}>
                      <span className={`${styles.statusBadge} ${styles[application.status]}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  <div className={styles.applicationDetails}>
                    {application.type === 'publisher' ? (
                      // Publisher-specific information (Account Information from form)
                      <>
                        <div className={styles.detailRow}>
                          <strong>Email:</strong> {application.email}
                        </div>
                        <div className={styles.detailRow}>
                          <strong>Business Name:</strong> {application.businessName}
                        </div>
                        {application.magazineTitle && (
                          <div className={styles.detailRow}>
                            <strong>Magazine Title:</strong> {application.magazineTitle}
                          </div>
                        )}
                        {application.applicationData?.publication_type && (
                          <div className={styles.detailRow}>
                            <strong>Type:</strong> {application.applicationData.publication_type}
                          </div>
                        )}
                        {application.applicationData?.description && (
                          <div className={styles.detailRow}>
                            <strong>Description:</strong> {application.applicationData.description.substring(0, 100)}...
                          </div>
                        )}
                      </>
                    ) : (
                      // Retailer-specific information (Contact Information from form)
                      <>
                        <div className={styles.detailRow}>
                          <strong>Buyer Name:</strong> {application.applicantName}
                        </div>
                        <div className={styles.detailRow}>
                          <strong>Email:</strong> {application.email}
                        </div>
                        {application.applicationData?.buyer_phone && (
                          <div className={styles.detailRow}>
                            <strong>Phone:</strong> {application.applicationData.buyer_phone}
                          </div>
                        )}
                        {application.applicationData?.store_type && (
                          <div className={styles.detailRow}>
                            <strong>Store Type:</strong> {application.applicationData.store_type}
                          </div>
                        )}
                        {application.applicationData?.business_city && application.applicationData?.business_state && (
                          <div className={styles.detailRow}>
                            <strong>Location:</strong> {application.applicationData.business_city}, {application.applicationData.business_state}
                          </div>
                        )}
                      </>
                    )}

                    <div className={styles.detailRow}>
                      <strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className={styles.applicationActions}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleViewApplicationDetails(application)}
                    >
                      <Eye className={styles.actionIcon} />
                      View Details
                    </button>

                    {application.status === 'pending' && (
                      <>
                        <button
                          className={styles.approveBtn}
                          onClick={() => handleApproveApplication(application.id, application.type)}
                        >
                          <CheckCircle className={styles.actionIcon} />
                          Accept
                        </button>
                        <button
                          className={styles.denyBtn}
                          onClick={() => handleDenyApplication(application.id, application.type)}
                        >
                          <XCircle className={styles.actionIcon} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Reported Publishers</h2>
              <button
                className={styles.toggleViewBtn}
                onClick={() => setShowAllReports(!showAllReports)}
              >
                {showAllReports ? 'Show Recent (10)' : 'View All Reports'}
              </button>
            </div>

            <div className={styles.reportsList}>
              {displayedReports.map(report => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <div className={styles.publisherInfo}>
                      <h3>{report.publisherName}</h3>
                      <p className={styles.businessName}>{report.businessName}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[report.status]}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className={styles.reportDetails}>
                    <p><strong>Reason:</strong> {report.reportReason}</p>
                    <p><strong>Reported by:</strong> {report.reportedBy}</p>
                    <p><strong>Date:</strong> {new Date(report.reportedAt).toLocaleDateString()}</p>
                  </div>

                  <div className={styles.reportActions}>
                    <button className={styles.viewBtn}>
                      <Eye className={styles.actionIcon} />
                      View Details
                    </button>
                    <button
                      className={styles.resolveBtn}
                      onClick={() => handleResolveReport(report.id)}
                    >
                      <CheckCircle className={styles.actionIcon} />
                      Mark Resolved
                    </button>
                    <button
                      className={styles.dismissBtn}
                      onClick={() => handleDismissReport(report.id)}
                    >
                      <XCircle className={styles.actionIcon} />
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Messages from hi@neesh.art</h2>
              <div className={styles.messageStats}>
                <span className={styles.stat}>
                  {messages.filter(msg => !msg.isRead).length} Unread
                </span>
                <span className={styles.stat}>
                  {messages.filter(msg => !msg.isReplied).length} Pending Reply
                </span>
              </div>
            </div>

            <div className={styles.messagesList}>
              {messages.map(message => (
                <div key={message.id} className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''}`}>
                  <div className={styles.messageHeader}>
                    <div className={styles.messageInfo}>
                      <h3>{message.subject}</h3>
                      <p className={styles.messageFrom}>From: {message.from}</p>
                    </div>
                    <div className={styles.messageStatus}>
                      <span className={styles.messageDate}>
                        {new Date(message.receivedAt).toLocaleDateString()}
                      </span>
                      {!message.isRead && <span className={styles.unreadBadge}>New</span>}
                    </div>
                  </div>

                  <div className={styles.messageBody}>
                    <p>{message.body}</p>
                  </div>

                  <div className={styles.messageActions}>
                    <button className={styles.replyBtn}>
                      <Mail className={styles.actionIcon} />
                      Reply
                    </button>
                    <button
                      className={styles.markReadBtn}
                      onClick={() => handleMarkMessageRead(message.id)}
                    >
                      <CheckCircle className={styles.actionIcon} />
                      Mark as Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Admin Assistant</h2>
              <p className={styles.chatbotDescription}>
                Ask me about pending applications, reports, messages, or request simple data operations.
              </p>
            </div>

            <div className={styles.chatContainer}>
              <div className={styles.chatMessages}>
                {chatMessages.length === 0 && (
                  <div className={styles.chatWelcome}>
                    <MessageCircle className={styles.welcomeIcon} />
                    <p>Hello! I'm your admin assistant. I can help you with:</p>
                    <ul>
                      <li>Checking pending applications count</li>
                      <li>Viewing reported publishers summary</li>
                      <li>Counting unread messages</li>
                      <li>Basic data queries and operations</li>
                    </ul>
                    <p>What would you like to know?</p>
                  </div>
                )}

                {chatMessages.map((msg, index) => (
                  <div key={index} className={`${styles.chatMessage} ${styles[msg.type]}`}>
                    <div className={styles.messageContent}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className={styles.chatForm}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything about your admin data..."
                  className={styles.chatInput}
                />
                <button type="submit" className={styles.chatSubmit}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={showApplicationDetail}
        onClose={() => {
          setShowApplicationDetail(false);
          setSelectedApplication(null);
        }}
        onApprove={handleApproveApplication}
        onDeny={handleDenyApplication}
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default AdminPanel;
