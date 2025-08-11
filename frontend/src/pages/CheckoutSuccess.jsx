import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getCheckoutSuccess } from '../api/payments';
import styles from './CheckoutSuccess.module.css';
import Button from '../components/common/Button';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const sessionData = await getCheckoutSuccess(sessionId);
      setSession(sessionData.session);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading payment details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✅</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        
        {session && (
          <div className={styles.orderDetails}>
            <h3>Order Details</h3>
            <div className={styles.detail}>
              <span>Order ID:</span>
              <span>{session.id}</span>
            </div>
            <div className={styles.detail}>
              <span>Amount:</span>
              <span>${(session.amount_total / 100).toFixed(2)}</span>
            </div>
            <div className={styles.detail}>
              <span>Email:</span>
              <span>{session.customer_email}</span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Link to="/orders">
            <Button variant="primary">View Orders</Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;