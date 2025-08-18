import { useState, useEffect } from 'react';
import { adminFlaggedContentData } from '../../data/dummyData.jsx';
import styles from './Moderation.module.css';

const Moderation = ({ onUpdate }) => {
  const [flaggedContent, setFlaggedContent] = useState(adminFlaggedContentData);
  const [loading, setLoading] = useState(false);

  const handleResolve = (id, action) => {
    setFlaggedContent(flaggedContent.map(item => 
      item.id === id ? { ...item, status: action } : item
    ));
    onUpdate?.();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.moderation}>
      <div className={styles.header}>
        <h2>Content Moderation</h2>
        <div className={styles.stats}>
          <span>{flaggedContent.filter(item => item.status === 'pending' || item.status === 'under_review').length} items need attention</span>
        </div>
      </div>
      
      {flaggedContent.length === 0 ? (
        <p>No flagged content to review.</p>
      ) : (
        <div className={styles.flaggedList}>
          {flaggedContent.map(item => (
            <div key={item.id} className={styles.flaggedCard}>
              <div className={styles.flaggedHeader}>
                <div className={styles.flaggedInfo}>
                  <h3>{item.title}</h3>
                  <p className={styles.type}>Type: {item.type}</p>
                  {item.publisher && <p className={styles.publisher}>Publisher: {item.publisher}</p>}
                </div>
                <div className={styles.flaggedMeta}>
                  <span className={`${styles.severity} ${styles[item.severity]}`}>
                    {item.severity} priority
                  </span>
                  <span className={`${styles.status} ${styles[item.status.replace('_', '')]}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className={styles.flaggedDetails}>
                <p><strong>Reason:</strong> {item.reason}</p>
                <p><strong>Flagged by:</strong> {item.flagged_by}</p>
                <p><strong>Date:</strong> {new Date(item.flagged_at).toLocaleDateString()}</p>
              </div>

              {(item.status === 'pending' || item.status === 'under_review') && (
                <div className={styles.actions}>
                  <button 
                    className={styles.approveBtn}
                    onClick={() => handleResolve(item.id, 'approved')}
                  >
                    Approve Content
                  </button>
                  <button 
                    className={styles.removeBtn}
                    onClick={() => handleResolve(item.id, 'removed')}
                  >
                    Remove Content
                  </button>
                  <button 
                    className={styles.investigateBtn}
                    onClick={() => handleResolve(item.id, 'investigating')}
                  >
                    Investigate Further
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Moderation;
