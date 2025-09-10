import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/retailer/application - Submit retailer application
router.post('/application', async (req, res) => {
  try {
    console.log('📝 Received retailer application:', req.body);

    const applicationData = req.body;

    // Insert application into Supabase
    const { data: result, error } = await supabase
      .from('retailer_applications')
      .insert([applicationData])
      .select('id, shop_name, buyer_email')
      .single();

    if (error) {
      console.error('❌ Error inserting retailer application:', error);
      return res.status(500).json({
        message: 'Failed to submit application',
        error: error.message
      });
    }

    console.log('✅ Retailer application submitted successfully:', result);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: result.id,
      shopName: result.shop_name,
      email: result.buyer_email
    });
  } catch (error) {
    console.error('❌ Retailer application error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/retailer/magazines - Get all available magazines
router.get('/magazines', async (req, res) => {
  try {
    const { category, search, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('magazines')
      .select(`
        *,
        publishers!inner(company_name, user_id),
        users!publishers_user_id_fkey(username)
      `)
      .eq('is_active', true);

    // Add filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add pagination
    query = query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      .order('created_at', { ascending: false });

    const { data: magazines, error } = await query;

    if (error) {
      console.error('Error fetching magazines:', error);
      return res.status(500).json({ message: 'Failed to fetch magazines' });
    }

    res.json(magazines || []);
  } catch (error) {
    console.error('Retailer magazines error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/retailer/orders - Get retailer's orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        magazines(title, price, cover_image_url),
        publishers!magazines_publisher_id_fkey(company_name),
        users!publishers_user_id_fkey(username)
      `)
      .eq('retailer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }

    res.json(orders || []);
  } catch (error) {
    console.error('Retailer orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/retailer/orders - Create new order
router.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { magazine_id, quantity = 1 } = req.body;
    
    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Get magazine details
    const { data: magazine, error: magazineError } = await supabase
      .from('magazines')
      .select('id, title, price, is_active')
      .eq('id', magazine_id)
      .eq('is_active', true)
      .single();

    if (magazineError || !magazine) {
      return res.status(404).json({ message: 'Magazine not found or not available' });
    }

    // Calculate total price
    const totalPrice = parseFloat(magazine.price) * parseInt(quantity);

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          retailer_id: userId,
          magazine_id: magazine_id,
          quantity: parseInt(quantity),
          total_price: totalPrice,
          status: 'pending'
        }
      ])
      .select(`
        *,
        magazines(title, price, cover_image_url)
      `)
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Failed to create order' });
    }

    res.status(201).json({
      ...order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/retailer/orders/:id - Update order status (cancel only)
router.put('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { status } = req.body;
    
    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Only allow retailers to cancel their own pending orders
    if (status !== 'cancelled') {
      return res.status(400).json({ message: 'Retailers can only cancel orders' });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('retailer_id', userId)
      .eq('status', 'pending') // Only allow cancelling pending orders
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Failed to update order' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    res.json({
      ...order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/retailer/inventory - Get retailer's inventory summary
router.get('/inventory', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    
    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Get inventory summary from delivered orders
    const { data: inventory, error } = await supabase
      .from('orders')
      .select(`
        magazine_id,
        quantity,
        magazines(title, price, cover_image_url, category)
      `)
      .eq('retailer_id', userId)
      .eq('status', 'delivered');

    if (error) {
      console.error('Error fetching inventory:', error);
      return res.status(500).json({ message: 'Failed to fetch inventory' });
    }

    // Group by magazine and sum quantities
    const inventoryMap = {};
    inventory?.forEach(item => {
      const magazineId = item.magazine_id;
      if (inventoryMap[magazineId]) {
        inventoryMap[magazineId].quantity += item.quantity;
      } else {
        inventoryMap[magazineId] = {
          id: magazineId,
          magazineId: magazineId,
          quantity: item.quantity,
          status: 'in_stock',
          magazine: item.magazines
        };
      }
    });

    res.json(Object.values(inventoryMap));
  } catch (error) {
    console.error('Retailer inventory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/retailer/dashboard/analytics - Get retailer dashboard analytics
router.get('/dashboard/analytics', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Get orders for analytics
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        magazines(title, price, category)
      `)
      .eq('retailer_id', userId);

    if (error) {
      console.error('Error fetching analytics data:', error);
      return res.status(500).json({ message: 'Failed to fetch analytics data' });
    }

    // Calculate analytics
    const totalOrders = orders?.length || 0;
    const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;
    const deliveredOrders = orders?.filter(order => order.status === 'delivered') || [];
    const pendingOrders = orders?.filter(order => order.status === 'pending') || [];
    const returnedOrders = orders?.filter(order => order.status === 'returned') || [];

    // Calculate sales by time period (mock data for now)
    const salesData = [
      { period: 'D', value: totalSales * 0.1 },
      { period: 'W', value: totalSales * 0.3 },
      { period: 'M', value: totalSales * 0.6 },
      { period: 'Q', value: totalSales * 0.8 },
      { period: 'YTD', value: totalSales * 0.9 },
      { period: 'Y', value: totalSales },
      { period: 'ALL', value: totalSales }
    ];

    // Calculate growth percentage (mock for now)
    const growthPercentage = 12.30;

    res.json({
      totalSales,
      totalOrders,
      deliveredCount: deliveredOrders.length,
      pendingCount: pendingOrders.length,
      returnedCount: returnedOrders.length,
      salesData,
      growthPercentage,
      orders: orders || []
    });
  } catch (error) {
    console.error('Retailer analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/retailer/dashboard/magazines - Get magazines with inventory data
router.get('/dashboard/magazines', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Get all magazines with inventory data
    const { data: magazines, error: magazinesError } = await supabase
      .from('magazines')
      .select(`
        *,
        publishers!inner(company_name, user_id),
        users!publishers_user_id_fkey(username)
      `)
      .eq('is_active', true);

    if (magazinesError) {
      console.error('Error fetching magazines:', magazinesError);
      return res.status(500).json({ message: 'Failed to fetch magazines' });
    }

    // Get inventory data for this retailer
    const { data: inventory, error: inventoryError } = await supabase
      .from('orders')
      .select(`
        magazine_id,
        quantity,
        status
      `)
      .eq('retailer_id', userId)
      .eq('status', 'delivered');

    if (inventoryError) {
      console.error('Error fetching inventory:', inventoryError);
      return res.status(500).json({ message: 'Failed to fetch inventory' });
    }

    // Create inventory map
    const inventoryMap = {};
    inventory?.forEach(item => {
      const magazineId = item.magazine_id;
      if (inventoryMap[magazineId]) {
        inventoryMap[magazineId] += item.quantity;
      } else {
        inventoryMap[magazineId] = item.quantity;
      }
    });

    // Combine magazines with inventory data
    const magazinesWithInventory = magazines?.map(magazine => ({
      ...magazine,
      inventory: inventoryMap[magazine.id] || 0,
      status: inventoryMap[magazine.id] ? 'in_stock' : 'out_of_stock'
    })) || [];

    res.json(magazinesWithInventory);
  } catch (error) {
    console.error('Retailer magazines error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/retailer/magazine/:id/analytics - Get analytics for specific magazine
router.get('/magazine/:id/analytics', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.user;
    const { id: magazineId } = req.params;

    if (role !== 'retailer') {
      return res.status(403).json({ message: 'Access denied. Retailer role required.' });
    }

    // Get magazine details
    const { data: magazine, error: magazineError } = await supabase
      .from('magazines')
      .select(`
        *,
        publishers!inner(company_name, user_id),
        users!publishers_user_id_fkey(username, email)
      `)
      .eq('id', magazineId)
      .eq('is_active', true)
      .single();

    if (magazineError || !magazine) {
      return res.status(404).json({ message: 'Magazine not found' });
    }

    // Get orders for this magazine
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('retailer_id', userId)
      .eq('magazine_id', magazineId);

    if (ordersError) {
      console.error('Error fetching magazine orders:', ordersError);
      return res.status(500).json({ message: 'Failed to fetch magazine orders' });
    }

    // Calculate analytics
    const totalOrders = orders?.length || 0;
    const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;
    const deliveredOrders = orders?.filter(order => order.status === 'delivered') || [];
    const returnedOrders = orders?.filter(order => order.status === 'returned') || [];
    const totalSold = deliveredOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalReturned = returnedOrders.reduce((sum, order) => sum + order.quantity, 0);

    // Mock inventory by location
    const inventoryByLocation = [
      { location: 'New York', current: Math.floor(totalSold * 0.3), total: Math.floor(totalSold * 0.4) },
      { location: 'Arizona', current: Math.floor(totalSold * 0.5), total: Math.floor(totalSold * 0.6) }
    ];

    // Mock sales data over time
    const salesData = [
      { period: 'D', value: totalSales * 0.1 },
      { period: 'W', value: totalSales * 0.3 },
      { period: 'M', value: totalSales * 0.6 },
      { period: 'Q', value: totalSales * 0.8 },
      { period: 'YTD', value: totalSales * 0.9 },
      { period: 'Y', value: totalSales },
      { period: 'ALL', value: totalSales }
    ];

    res.json({
      magazine,
      analytics: {
        totalSales,
        totalSold,
        totalReturned,
        totalOrders,
        growthPercentage: 12.30, // Mock
        salesData,
        inventoryByLocation
      },
      orders: orders || [],
      publisher: {
        name: magazine.publishers?.company_name,
        username: magazine.users?.username,
        email: magazine.users?.email
      }
    });
  } catch (error) {
    console.error('Magazine analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
