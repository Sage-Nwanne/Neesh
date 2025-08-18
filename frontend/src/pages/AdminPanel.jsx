import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import AdminChatbot from '../components/admin/AdminChatbot';
import SubmissionReview from '../components/admin/SubmissionReview';
import OrderCoordination from '../components/admin/OrderCoordination';
import Moderation from '../components/admin/Moderation';
import styles from './AdminPanel.module.css';

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [stats, setStats] = useState({
    pendingSubmissions: 0,
    activeOrders: 0,
    flaggedListings: 0
  });

  useEffect(() => {
    // Remove the role check redirect for now to allow access
    // if (user?.role !== 'admin') {
    //   window.location.href = '/';
    //   return;
    // }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [submissions, orders, flagged] = await Promise.all([
        supabase.from('magazines').select('count').eq('status', 'pending'),
        supabase.from('orders').select('count').in('status', ['pending', 'processing']),
        supabase.from('magazines').select('count').eq('is_flagged', true)
      ]);

      setStats({
        pendingSubmissions: submissions.count || 0,
        activeOrders: orders.count || 0,
        flaggedListings: flagged.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'submissions', label: 'Submissions', count: stats.pendingSubmissions },
    { id: 'orders', label: 'Orders', count: stats.activeOrders },
    { id: 'moderation', label: 'Moderation', count: stats.flaggedListings }
  ];

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Admin Panel</h1>
          <Link to="/" className={styles.homeButton}>
            ← Back to Home
          </Link>
        </div>
        <div className={styles.stats}>
          {tabs.map(tab => (
            <div key={tab.id} className={styles.statCard}>
              <span className={styles.statNumber}>{tab.count}</span>
              <span className={styles.statLabel}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && <span className={styles.badge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'submissions' && <SubmissionReview onUpdate={fetchStats} />}
        {activeTab === 'orders' && <OrderCoordination onUpdate={fetchStats} />}
        {activeTab === 'moderation' && <Moderation onUpdate={fetchStats} />}
      </div>

      <AdminChatbot user={user} />
    </div>
  );
};

export default AdminPanel;
