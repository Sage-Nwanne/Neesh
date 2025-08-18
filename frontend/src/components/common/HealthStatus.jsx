import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './HealthStatus.module.css';

const API_URL = 'https://neesh-backend-8378fc8ecdf9.herokuapp.com/api';

const HealthStatus = () => {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const checkBackendHealth = async () => {
    setStatus('checking');
    try {
      const response = await axios.get(`${API_URL}/health`);
      setDetails(response.data);
      setStatus('connected');
      setLastChecked(new Date());
      console.log('Health check response:', response.data);
    } catch (error) {
      console.error('Health check error:', error);
      setStatus('error');
      setDetails({ 
        error: error.message,
        response: error.response?.data
      });
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    if (isVisible) {
      checkBackendHealth();
      const interval = setInterval(checkBackendHealth, 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div className={styles.healthContainer}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsVisible(!isVisible)}
      >
        Health Check
      </button>
      
      {isVisible && (
        <div className={styles.healthStatus}>
          <div className={`${styles.indicator} ${styles[status]}`}></div>
          <div className={styles.details}>
            <span className={styles.label}>Backend:</span>
            <span className={styles.value}>
              {status === 'checking' ? 'Checking...' : 
               status === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
            {details && details.timestamp && (
              <span className={styles.timestamp}>
                Server time: {new Date(details.timestamp).toLocaleTimeString()}
              </span>
            )}
            {lastChecked && (
              <span className={styles.timestamp}>
                Checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
            <button 
              className={styles.refreshButton} 
              onClick={checkBackendHealth}
              disabled={status === 'checking'}
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
