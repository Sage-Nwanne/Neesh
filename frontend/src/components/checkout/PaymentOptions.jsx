import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './PaymentOptions.module.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentOptions = ({ user }) => {
  const [earnings, setEarnings] = useState({
    available: 1247.50,
    pending: 324.75,
    total: 2847.50
  });

  const [payoutSchedule, setPayoutSchedule] = useState('weekly');

  const handleInstantPayout = async () => {
    try {
      // TODO: Implement instant payout via Stripe Connect
      alert('Instant payout initiated! Funds will arrive in 1-2 business days.');
    } catch (error) {
      console.error('Payout error:', error);
      alert('Failed to process payout. Please try again.');
    }
  };

  return (
    <div className={styles.paymentOptions}>
      <div className={styles.section}>
        <h3>Earnings Overview</h3>
        <div className={styles.earningsCard}>
          <div className={styles.earningItem}>
            <span className={styles.label}>Available</span>
            <span className={styles.amount}>${earnings.available}</span>
          </div>
          <div className={styles.earningItem}>
            <span className={styles.label}>Pending</span>
            <span className={styles.amount}>${earnings.pending}</span>
          </div>
          <div className={styles.earningItem}>
            <span className={styles.label}>Total Earned</span>
            <span className={styles.amount}>${earnings.total}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Payout Settings</h3>
        <div className={styles.payoutSettings}>
          <label>
            Payout Schedule:
            <select 
              value={payoutSchedule} 
              onChange={(e) => setPayoutSchedule(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="manual">Manual</option>
            </select>
          </label>
          
          <button 
            className={styles.payoutBtn}
            onClick={handleInstantPayout}
            disabled={earnings.available < 1}
          >
            Instant Payout (${earnings.available})
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Payment Methods</h3>
        <div className={styles.paymentMethods}>
          <div className={styles.methodCard}>
            <span>Bank Account: ****1234</span>
            <button className={styles.editBtn}>Edit</button>
          </div>
          <button className={styles.addMethodBtn}>+ Add Payment Method</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
