import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../../api/payments';
import Button from '../common/Button';
import styles from './CheckoutForm.module.css';

const CheckoutForm = ({ items, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet');
      setLoading(false);
      return;
    }

    try {
      // Create checkout session
      const { sessionId, url } = await createCheckoutSession({ items });
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment failed');
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className={styles.checkoutForm}>
      <div className={styles.orderSummary}>
        <h3>Order Summary</h3>
        {items.map((item, index) => (
          <div key={index} className={styles.orderItem}>
            <div className={styles.itemDetails}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
            </div>
            <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className={styles.orderTotal}>
          <strong>Total: ${calculateTotal().toFixed(2)}</strong>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={!stripe || loading}
          className={styles.payButton}
        >
          {loading ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
