import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContentManagement } from '../hooks/useContentManagement';
import { useCMSAuth } from '../hooks/useCMSAuth';
import CMSLogin from '../components/CMSLogin';
import CMSNavigation from '../components/CMSNavigation';
import styles from './CMSDashboard.module.css';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string;
  features: string[];
}

const CMSDashboard: React.FC = () => {
  const { isAuthenticated, login, logout } = useCMSAuth();
  const { siteContent, loading } = useContentManagement();
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'analytics'>('overview');

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <CMSLogin onLogin={login} />;
  }

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Visual CMS',
      description: 'Edit your website with live preview and drag-and-drop functionality',
      icon: '🎨',
      path: '/visual-cms',
      color: '#007bff',
      features: [
        'Click-to-edit elements',
        'Drag and drop positioning',
        'Real-time preview',
        'Undo/Redo functionality',
        'Mobile responsive preview'
      ]
    },
    {
      title: 'Live Page Editor',
      description: 'Side-by-side editing with instant preview',
      icon: '📝',
      path: '/live-editor',
      color: '#28a745',
      features: [
        'Split-panel interface',
        'Batch editing',
        'Pending changes system',
        'Google Sheets sync',
        'Content location mapping'
      ]
    },
    {
      title: 'Admin Content',
      description: 'Traditional form-based content management',
      icon: '⚙️',
      path: '/admin-content',
      color: '#6f42c1',
      features: [
        'Tabbed interface',
        'Direct database editing',
        'Navigation management',
        'FAQ management',
        'Landing page content'
      ]
    },
    {
      title: 'Database Viewer',
      description: 'View and manage all content in table format',
      icon: '📊',
      path: '/admin-panel',
      color: '#fd7e14',
      features: [
        'Table view of all data',
        'Publisher applications',
        'Retailer applications',
        'Mailing list subscribers',
        'Export functionality'
      ]
    }
  ];

  const getContentStats = () => {
    const totalContent = siteContent.length;
    const activeContent = siteContent.filter(item => item.is_active).length;
    const recentlyUpdated = siteContent.filter(item => {
      const updatedAt = new Date(item.updated_at || item.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return updatedAt > dayAgo;
    }).length;

    return { totalContent, activeContent, recentlyUpdated };
  };

  const stats = getContentStats();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading CMS Dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CMSNavigation onLogout={logout} />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>NEESH Content Management System</h1>
          <p>Manage your website content with powerful visual tools</p>
        </div>
        
        <div className={styles.quickStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.totalContent}</span>
            <span className={styles.statLabel}>Total Content Items</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.activeContent}</span>
            <span className={styles.statLabel}>Active Items</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{stats.recentlyUpdated}</span>
            <span className={styles.statLabel}>Updated Today</span>
          </div>
        </div>
      </header>

      <nav className={styles.tabNav}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'tools' ? styles.active : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          🛠️ Tools
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            <section className={styles.quickActions}>
              <h2>Quick Actions</h2>
              <div className={styles.actionGrid}>
                <Link to="/visual-cms" className={styles.quickAction}>
                  <span className={styles.actionIcon}>🚀</span>
                  <span>Start Visual Editing</span>
                </Link>
                <Link to="/live-editor" className={styles.quickAction}>
                  <span className={styles.actionIcon}>✏️</span>
                  <span>Edit Content</span>
                </Link>
                <Link to="/admin-content" className={styles.quickAction}>
                  <span className={styles.actionIcon}>⚙️</span>
                  <span>Manage Settings</span>
                </Link>
                <Link to="/" className={styles.quickAction}>
                  <span className={styles.actionIcon}>👁️</span>
                  <span>View Live Site</span>
                </Link>
              </div>
            </section>

            <section className={styles.recentContent}>
              <h2>Recent Content Updates</h2>
              <div className={styles.contentList}>
                {siteContent
                  .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.id} className={styles.contentItem}>
                      <div className={styles.contentInfo}>
                        <h4>{item.title || item.key}</h4>
                        <p>{item.content.substring(0, 100)}...</p>
                        <span className={styles.contentMeta}>
                          Updated {new Date(item.updated_at || item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.contentActions}>
                        <Link to={`/visual-cms?edit=${item.key}`} className={styles.editBtn}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className={styles.tools}>
            <h2>Content Management Tools</h2>
            <div className={styles.toolsGrid}>
              {dashboardCards.map(card => (
                <div key={card.path} className={styles.toolCard}>
                  <div className={styles.cardHeader} style={{ borderTopColor: card.color }}>
                    <span className={styles.cardIcon}>{card.icon}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <div className={styles.cardContent}>
                    <p>{card.description}</p>
                    <ul className={styles.featureList}>
                      {card.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.cardFooter}>
                    <Link to={card.path} className={styles.cardButton} style={{ backgroundColor: card.color }}>
                      Open Tool
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.analytics}>
            <h2>Content Analytics</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h3>Content Distribution</h3>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.pieChart}>
                    <div className={styles.pieSlice} style={{ '--percentage': '60%', '--color': '#007bff' } as any}>
                      Homepage Content (60%)
                    </div>
                    <div className={styles.pieSlice} style={{ '--percentage': '25%', '--color': '#28a745' } as any}>
                      Navigation (25%)
                    </div>
                    <div className={styles.pieSlice} style={{ '--percentage': '15%', '--color': '#ffc107' } as any}>
                      Other (15%)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.analyticsCard}>
                <h3>Recent Activity</h3>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <span className={styles.activityIcon}>✏️</span>
                    <span>Hero title updated</span>
                    <span className={styles.activityTime}>2 hours ago</span>
                  </div>
                  <div className={styles.activityItem}>
                    <span className={styles.activityIcon}>📝</span>
                    <span>Publisher description edited</span>
                    <span className={styles.activityTime}>1 day ago</span>
                  </div>
                  <div className={styles.activityItem}>
                    <span className={styles.activityIcon}>🔄</span>
                    <span>Content synced to Google Sheets</span>
                    <span className={styles.activityTime}>2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CMSDashboard;
