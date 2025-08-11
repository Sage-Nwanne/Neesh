import express from 'express';
import stripeService from '../services/stripeService.js';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, metadata = {} } = req.body;

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create or get Stripe customer
    const customer = await stripeService.createCustomer({
      email: user.email,
      name: user.business_name || user.full_name,
      metadata: { user_id: userId }
    });

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      items,
      customerId: customer.id,
      metadata: {
        user_id: userId,
        ...metadata
      }
    });

    // Store session in database
    const { error: sessionError } = await supabase
      .from('payment_sessions')
      .insert([
        {
          session_id: session.id,
          user_id: userId,
          amount: session.amount_total,
          status: 'pending',
          metadata: metadata
        }
      ]);

    if (sessionError) {
      console.error('Error storing session:', sessionError);
    }

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// Handle successful payment
router.get('/checkout/success', async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID required' });
    }

    const session = await stripeService.getCheckoutSession(session_id);

    // Update payment session status
    const { error: updateError } = await supabase
      .from('payment_sessions')
      .update({ 
        status: 'completed',
        payment_intent_id: session.payment_intent.id
      })
      .eq('session_id', session_id);

    if (updateError) {
      console.error('Error updating session:', updateError);
    }

    res.json({ 
      success: true, 
      session: {
        id: session.id,
        amount_total: session.amount_total,
        customer_email: session.customer_details?.email
      }
    });
  } catch (error) {
    console.error('Success handler error:', error);
    res.status(500).json({ message: 'Failed to process successful payment' });
  }
});

// Create refund
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { paymentIntentId, amount, reason } = req.body;

    // Verify user has permission to refund this payment
    const { data: session, error: sessionError } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Only allow refunds by the original purchaser or admin
    if (session.user_id !== userId && role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to refund this payment' });
    }

    // Create refund
    const refund = await stripeService.createRefund({
      paymentIntentId,
      amount,
      reason
    });

    // Update session status
    const { error: updateError } = await supabase
      .from('payment_sessions')
      .update({ 
        status: 'refunded',
        refund_id: refund.id
      })
      .eq('payment_intent_id', paymentIntentId);

    if (updateError) {
      console.error('Error updating refund status:', updateError);
    }

    res.json({ 
      success: true, 
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Failed to process refund' });
  }
});

export default router;
