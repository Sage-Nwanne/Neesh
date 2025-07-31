import styles from './PaymentOptions.module.css';
import Button from '../common/Button';

const PaymentOptions = () => {
  return (
    <div className={styles.paymentContainer}>
      {/* Header */}
      <div className={styles.header}>
        <Button variant="primary" size="large" className={styles.checkoutBtn}>
          Continue to Checkout →
        </Button>
      </div>

      {/* Navigation Icons */}
      <div className={styles.navIcons}>
        <div className={styles.navItem}>
          <span className={styles.icon}>🏠</span>
          <span>Home</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>🔍</span>
          <span>Search</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>❤️</span>
          <span>Favorites</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>🛒</span>
          <span>Cart</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.icon}>⚙️</span>
          <span>Settings</span>
        </div>
      </div>

      {/* Payment Section */}
      <div className={styles.paymentSection}>
        <div className={styles.paymentIcon}>💳</div>
        <h2>Pay in full or pay over time. Your choice.</h2>
        <p>Choose your next product in a guided, one-way.</p>
      </div>
    </div>
  );
};

export default PaymentOptions;