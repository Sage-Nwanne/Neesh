import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // Create checkout session for magazine purchases
  async createCheckoutSession({ items, customerId, metadata = {} }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer: customerId,
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images || [],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        metadata: {
          ...metadata,
          order_type: 'magazine_purchase'
        },
        payment_intent_data: {
          metadata: metadata
        }
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Create or retrieve customer
  async createCustomer({ email, name, metadata = {} }) {
    try {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Process refund
  async createRefund({ paymentIntentId, amount, reason = 'requested_by_customer' }) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        reason
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  // Get checkout session details
  async getCheckoutSession(sessionId) {
    try {
      return await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer']
      });
    } catch (error) {
      console.error('Error retrieving checkout session:', error);
      throw error;
    }
  }
}

export default new StripeService();
