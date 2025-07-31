import { useState, useEffect } from 'react';
import styles from './Partners.module.css';

const Partners = () => {
  const [partners, setPartners] = useState([]);

  return (
    <div className={styles.partners}>
      <div className="container">
        <h1>Partners</h1>
        <div className={styles.partnerGrid}>
          {/* Partner cards will go here */}
          <p>No partners found</p>
        </div>
      </div>
    </div>
  );
};

export default Partners;