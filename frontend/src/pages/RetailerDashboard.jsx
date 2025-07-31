
import { useState, useEffect } from 'react';
import { getAvailableMagazines, getRetailerOrders, createOrder, getRetailerInventory } from '../api';
import { retailerOrdersData, retailerInventoryData, availableMagazinesData } from '../data/dummyData';
import styles from './RetailerDashboard.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const RetailerDashboard = ({ user }) => {
  const [magazines, setMagazines] = useState(availableMagazinesData);
  const [orders, setOrders] = useState(retailerOrdersData);
  const [inventory, setInventory] = useState(retailerInventoryData);
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

  const handleOrder = async (magazineId, quantity = 1) => {
    try {
      const magazine = availableMagazinesData.find(m => m.id === magazineId);
      const newOrder = {
        id: `ord_${Date.now()}`,
        magazine_id: magazineId,
        magazines: {
          title: magazine.title,
          cover_image_url: magazine.cover_image_url
        },
        quantity,
        total_price: (magazine.price * quantity).toFixed(2),
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      setOrders([newOrder, ...orders]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order');
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
  const totalOrders = orders.length;
  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Retailer Dashboard</h1>
        <p>Welcome back, {user?.username || 'Retailer'}!</p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <h3>Total Orders</h3>
          <p className={styles.statValue}>{totalOrders}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Total Spent</h3>
          <p className={styles.statValue}>${totalSpent.toFixed(2)}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Inventory Items</h3>
          <p className={styles.statValue}>{totalInventory}</p>
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
              <Button 
                onClick={() => handleOrder(magazine.id)}
                variant="primary"
                size="small"
              >
                Order Now
              </Button>
            </Card>
          ))}
        </div>
      </div>

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
