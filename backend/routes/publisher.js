import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/publisher/application - Submit publisher application
router.post('/application', async (req, res) => {
  try {
    const applicationData = req.body;

    // Insert application into Supabase (matching existing table structure)
    const insertData = {
      email: applicationData.email,
      first_name: applicationData.first_name,
      last_name: applicationData.last_name,
      business_name: applicationData.business_name,
      magazine_title: applicationData.magazine_title,
      description: applicationData.description,
      status: 'pending'
    };

    // Add optional fields only if they exist in the form data
    if (applicationData.publication_type) insertData.publication_type = applicationData.publication_type;
    if (applicationData.issue_number) insertData.issue_number = applicationData.issue_number;
    if (applicationData.issue_frequency) insertData.issue_frequency = applicationData.issue_frequency;
    if (applicationData.social_website_link) insertData.social_website_link = applicationData.social_website_link;
    if (applicationData.print_run) insertData.print_run = parseInt(applicationData.print_run);
    if (applicationData.available_quantity) insertData.available_quantity = parseInt(applicationData.available_quantity);
    if (applicationData.wholesale_price) insertData.wholesale_price = parseFloat(applicationData.wholesale_price);
    if (applicationData.suggested_retail_price) insertData.suggested_retail_price = parseFloat(applicationData.suggested_retail_price);
    if (applicationData.specs) insertData.specs = applicationData.specs;
    if (applicationData.volume_pricing) insertData.volume_pricing_tiers = applicationData.volume_pricing;
    if (applicationData.cover_image_url) insertData.cover_image_url = applicationData.cover_image_url;
    if (applicationData.has_sold_before) insertData.has_sold_before = applicationData.has_sold_before === 'yes';
    if (applicationData.distribution_channels) insertData.distribution_channels = applicationData.distribution_channels;
    if (applicationData.estimated_copies_sold) insertData.copies_sold_estimate = parseInt(applicationData.estimated_copies_sold);
    if (applicationData.sales_feedback) insertData.quotes_feedback = applicationData.sales_feedback;
    if (applicationData.fulfillment_method) insertData.fulfillment_method = applicationData.fulfillment_method;
    if (applicationData.shipping_city) insertData.shipping_city = applicationData.shipping_city;
    if (applicationData.shipping_state) insertData.shipping_state = applicationData.shipping_state;
    if (applicationData.shipping_country) insertData.shipping_country = applicationData.shipping_country;
    if (applicationData.return_policy) insertData.accepts_returns = applicationData.return_policy;

    const { data: application, error } = await supabase
      .from('publisher_applications')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error submitting application:', error);
      return res.status(500).json({ message: 'Failed to submit application' });
    }

    res.status(201).json({
      applicationId: application.id,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/publisher/application/status - Get application status (for applicants)
router.get('/application/status', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const { data: application, error } = await supabase
      .from('publisher_applications')
      .select('id, status, submitted_at')
      .eq('email', email)
      .order('submitted_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching application status:', error);
      return res.status(500).json({ message: 'Failed to fetch application status' });
    }

    if (!application) {
      return res.status(404).json({ message: 'No application found' });
    }

    res.json({
      applicationId: application.id,
      status: application.status,
      submittedAt: application.submitted_at
    });
  } catch (error) {
    console.error('Application status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/publisher/magazines - Get publisher's magazines
router.get('/magazines', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    if (role !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher role required.' });
    }

    // Get publisher ID first
    const { data: publisher, error: publisherError } = await supabase
      .from('publishers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (publisherError || !publisher) {
      return res.status(404).json({ message: 'Publisher profile not found' });
    }

    // Get magazines
    const { data: magazines, error } = await supabase
      .from('magazines')
      .select('*')
      .eq('publisher_id', publisher.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching magazines:', error);
      return res.status(500).json({ message: 'Failed to fetch magazines' });
    }

    res.json(magazines || []);
  } catch (error) {
    console.error('Publisher magazines error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/publisher/magazines - Create new magazine
router.post('/magazines', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { title, description, price, category, cover_image_url } = req.body;
    
    if (role !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher role required.' });
    }

    // Get or create publisher profile
    let { data: publisher, error: publisherError } = await supabase
      .from('publishers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (publisherError && publisherError.code === 'PGRST116') {
      // Publisher doesn't exist, create one
      const { data: newPublisher, error: createError } = await supabase
        .from('publishers')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating publisher:', createError);
        return res.status(500).json({ message: 'Failed to create publisher profile' });
      }
      publisher = newPublisher;
    } else if (publisherError) {
      console.error('Error fetching publisher:', publisherError);
      return res.status(500).json({ message: 'Failed to fetch publisher profile' });
    }

    // Create magazine
    const { data: magazine, error } = await supabase
      .from('magazines')
      .insert([
        {
          publisher_id: publisher.id,
          title,
          description,
          price: parseFloat(price),
          category,
          cover_image_url,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating magazine:', error);
      return res.status(500).json({ message: 'Failed to create magazine' });
    }

    res.status(201).json({
      ...magazine,
      message: 'Magazine created successfully'
    });
  } catch (error) {
    console.error('Create magazine error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/publisher/magazines/:id - Update magazine
router.put('/magazines/:id', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { title, description, price, category, cover_image_url, is_active } = req.body;
    
    if (role !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher role required.' });
    }

    // Get publisher ID
    const { data: publisher, error: publisherError } = await supabase
      .from('publishers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (publisherError || !publisher) {
      return res.status(404).json({ message: 'Publisher profile not found' });
    }

    // Update magazine (only if owned by this publisher)
    const { data: magazine, error } = await supabase
      .from('magazines')
      .update({
        title,
        description,
        price: parseFloat(price),
        category,
        cover_image_url,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('publisher_id', publisher.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating magazine:', error);
      return res.status(500).json({ message: 'Failed to update magazine' });
    }

    if (!magazine) {
      return res.status(404).json({ message: 'Magazine not found or access denied' });
    }

    res.json({
      ...magazine,
      message: 'Magazine updated successfully'
    });
  } catch (error) {
    console.error('Update magazine error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/publisher/magazines/:id - Delete magazine
router.delete('/magazines/:id', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    
    if (role !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher role required.' });
    }

    // Get publisher ID
    const { data: publisher, error: publisherError } = await supabase
      .from('publishers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (publisherError || !publisher) {
      return res.status(404).json({ message: 'Publisher profile not found' });
    }

    // Delete magazine (only if owned by this publisher)
    const { error } = await supabase
      .from('magazines')
      .delete()
      .eq('id', id)
      .eq('publisher_id', publisher.id);

    if (error) {
      console.error('Error deleting magazine:', error);
      return res.status(500).json({ message: 'Failed to delete magazine' });
    }

    res.json({ message: `Magazine ${id} deleted successfully` });
  } catch (error) {
    console.error('Delete magazine error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/publisher/orders - Get orders for publisher's magazines
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    if (role !== 'publisher') {
      return res.status(403).json({ message: 'Access denied. Publisher role required.' });
    }

    // Get publisher ID
    const { data: publisher, error: publisherError } = await supabase
      .from('publishers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (publisherError || !publisher) {
      return res.status(404).json({ message: 'Publisher profile not found' });
    }

    // Get orders for this publisher's magazines
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        magazines!inner(title, price, publisher_id),
        users!retailer_id(username, email)
      `)
      .eq('magazines.publisher_id', publisher.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }

    res.json(orders || []);
  } catch (error) {
    console.error('Publisher orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
