import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RetailerDashboard.module.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { retailerOrders, retailerInventory, magazineData } from '../data/dummyData';

const RetailerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [availableMagazines, setAvailableMagazines] = useState([]);

  useEffect(() => {
    // Redirect if not logged in or not a retailer
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'retailer') {
      navigate('/');
      return;
    }
    
    // Load data
    setInventory(retailerInventory);
    setOrders(retailerOrders);
    setAvailableMagazines(magazineData);
  }, [user, navigate]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Retailer Dashboard</h1>
        <p>Welcome back, {user?.name || 'Retailer'}!</p>
      </div>
      
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <h3>Inventory Items</h3>
          <p className={styles.statValue}>{inventory.length}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Total Orders</h3>
          <p className={styles.statValue}>{orders.length}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Total Sales</h3>
          <p className={styles.statValue}>
            ${inventory.reduce((sum, item) => sum + (item.sold * item.price), 0).toFixed(2)}
          </p>
        </Card>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          My Inventory
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'browse' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Magazines
        </button>
      </div>
      
      {activeTab === 'inventory' && (
        <div className={styles.tabContent}>
          <h2>My Inventory</h2>
          <div className={styles.inventoryList}>
            {inventory.map(item => (
              <Card key={item.id} className={styles.inventoryItem}>
                <div className={styles.inventoryDetails}>
                  <img src={item.coverImage} alt={item.title} className={styles.magazineCover} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>Publisher: {item.publisher}</p>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <p>In Stock: {item.inStock}</p>
                    <p>Sold: {item.sold}</p>
                  </div>
                </div>
                <div className={styles.inventoryActions}>
                  <Button variant="outline" size="small">Order More</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className={styles.tabContent}>
          <h2>Orders</h2>
          <div className={styles.ordersTable}>
            <div className={styles.tableHeader}>
              <div>Date</div>
              <div>Magazine</div>
              <div>Publisher</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {orders.map(order => (
              <div key={order.id} className={styles.tableRow}>
                <div>{new Date(order.date).toLocaleDateString()}</div>
                <div>{order.magazineTitle}</div>
                <div>{order.publisherName}</div>
                <div>{order.quantity}</div>
                <div>${order.amount.toFixed(2)}</div>
                <div>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'browse' && (
        <div className={styles.tabContent}>
          <h2>Browse Magazines</h2>
          <div className={styles.magazineGrid}>
            {availableMagazines.map(magazine => (
              <Card key={magazine.id} className={styles.magazineCard}>
                <img src={magazine.coverImage} alt={magazine.title} className={styles.magazineCover} />
                <h3>{magazine.title}</h3>
                <p>Publisher: {magazine.publisher}</p>
                <p>Category: {magazine.category}</p>
                <p className={styles.price}>${magazine.price.toFixed(2)}</p>
                <Button>Order</Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerDashboard;
