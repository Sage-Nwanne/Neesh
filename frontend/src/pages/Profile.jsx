import { useState } from 'react';
import styles from './Profile.module.css';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={styles.profile}>
      <div className="container">
        <h1>Profile</h1>
        <div className={styles.profileContent}>
          <div className={styles.profileInfo}>
            <h3>{user?.username || 'Guest'}</h3>
            <p>{user?.email || 'No email'}</p>
            <p>Role: {user?.role || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;