
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getAvailableMagazines, getRetailerOrders, createOrder, getRetailerInventory } from '../api';
import { retailerOrdersData, retailerInventoryData, availableMagazinesData } from '../data/dummyData';
import CheckoutForm from '../components/checkout/CheckoutForm';
import styles from './RetailerDashboard.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const RetailerDashboard = ({ user }) => {
  const [magazines, setMagazines] = useState(availableMagazinesData);
  const [orders, setOrders] = useState(retailerOrdersData);
  const [inventory, setInventory] = useState(retailerInventoryData);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Use dummy data instead of API calls for now
    setLoading(false);
  }, []);

  useEffect(() => {
    filterMagazines();
  }, [selectedCategory, searchTerm]);

  const filterMagazines = () => {
    let filtered = availableMagazinesData;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mag => mag.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(mag => 
        mag.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mag.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setMagazines(filtered);
  };

  const addToCart = (magazine, quantity = 1) => {
    const existingItem = cart.find(item => item.id === magazine.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === magazine.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        id: magazine.id,
        name: magazine.title,
        price: magazine.price,
        quantity: quantity,
        description: magazine.description,
        images: [magazine.cover_image_url]
      }]);
    }
    
    alert(`${magazine.title} added to cart!`);
  };

  const removeFromCart = (magazineId) => {
    setCart(cart.filter(item => item.id !== magazineId));
  };

  const updateCartQuantity = (magazineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(magazineId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === magazineId 
        ? { ...item, quantity }
        : item
    ));
  };

  const handleCheckoutSuccess = (session) => {
    // Clear cart and add orders
    const newOrders = cart.map(item => ({
      id: `ord_${Date.now()}_${item.id}`,
      magazine_id: item.id,
      magazines: {
        title: item.name,
        cover_image_url: item.images[0]
      },
      quantity: item.quantity,
      total_price: (item.price * item.quantity).toFixed(2),
      status: 'completed',
      created_at: new Date().toISOString(),
      stripe_session_id: session.id
    }));
    
    setOrders([...newOrders, ...orders]);
    setCart([]);
    setShowCheckout(false);
    alert('Order completed successfully!');
  };

  const handleCheckoutError = (error) => {
    console.error('Checkout error:', error);
    setError('Payment failed. Please try again.');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Retailer Dashboard</h1>
        <p>Welcome back, {user?.username || 'Retailer'}!</p>
        
        {cart.length > 0 && (
          <div className={styles.cartSummary}>
            <span>{cart.length} items in cart - ${cartTotal.toFixed(2)}</span>
            <Button onClick={() => setShowCheckout(true)} variant="primary">
              Checkout
            </Button>
          </div>
        )}
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <h3>Total Orders</h3>
          <p className={styles.statValue}>{orders.length}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Total Spent</h3>
          <p className={styles.statValue}>${orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0).toFixed(2)}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Inventory Items</h3>
          <p className={styles.statValue}>{inventory.reduce((sum, item) => sum + item.quantity, 0)}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Pending Orders</h3>
          <p className={styles.statValue}>
            {orders.filter(order => order.status === 'pending').length}
          </p>
        </Card>
      </div>

      <div className={styles.section}>
        <h2>Browse Magazines</h2>
        
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search magazines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categoryFilter}
          >
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="lifestyle">Lifestyle</option>
            <option value="tech">Technology</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        <div className={styles.magazineGrid}>
          {magazines.map(magazine => (
            <Card key={magazine.id} className={styles.magazineCard}>
              {magazine.cover_image_url && (
                <img 
                  src={magazine.cover_image_url} 
                  alt={magazine.title}
                  className={styles.coverImage}
                />
              )}
              <h3>{magazine.title}</h3>
              <p className={styles.price}>${magazine.price}</p>
              <p className={styles.category}>{magazine.category}</p>
              <p className={styles.publisher}>
                by {magazine.users?.username || 'Unknown Publisher'}
              </p>
              <p className={styles.description}>{magazine.description}</p>
              
              <div className={styles.cardActions}>
                <Button 
                  onClick={() => addToCart(magazine)}
                  variant="primary"
                  size="small"
                >
                  Add to Cart
                </Button>
                <Button 
                  onClick={() => addToCart(magazine, 5)}
                  variant="secondary"
                  size="small"
                >
                  Bulk Order (5)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      {cart.length > 0 && (
        <div className={styles.section}>
          <h2>Shopping Cart</h2>
          <div className={styles.cartItems}>
            {cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <span className={styles.itemName}>{item.name}</span>
                <div className={styles.quantityControls}>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className={styles.cartTotal}>
              <strong>Total: ${cartTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className={styles.checkoutModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Checkout</h2>
              <button 
                onClick={() => setShowCheckout(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm
                items={cart}
                onSuccess={handleCheckoutSuccess}
                onError={handleCheckoutError}
              />
            </Elements>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2>My Orders</h2>
        <div className={styles.ordersTable}>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Magazine</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}...</td>
                    <td>{order.magazines?.title}</td>
                    <td>{order.quantity}</td>
                    <td>${order.total_price}</td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2>My Inventory</h2>
        <div className={styles.inventoryGrid}>
          {inventory.length === 0 ? (
            <p>No inventory items yet.</p>
          ) : (
            inventory.map(item => (
              <Card key={item.id} className={styles.inventoryCard}>
                {item.magazine?.cover_image_url && (
                  <img 
                    src={item.magazine.cover_image_url} 
                    alt={item.magazine.title}
                    className={styles.coverImage}
                  />
                )}
                <h4>{item.magazine?.title}</h4>
                <p className={styles.quantity}>Quantity: {item.quantity}</p>
                <p className={styles.category}>{item.magazine?.category}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;
