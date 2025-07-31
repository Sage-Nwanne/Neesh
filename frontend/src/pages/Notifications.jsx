import { useState, useEffect } from 'react';
import styles from './Notifications.module.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className={styles.notifications}>
      <div className="container">
        <h1>Notifications</h1>
        <div className={styles.notificationList}>
          {/* Notifications will go here */}
          <p>No notifications</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;