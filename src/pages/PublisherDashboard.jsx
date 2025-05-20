import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PublisherDashboard.module.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { publisherMagazines, publisherSales } from '../data/dummyData';

const PublisherDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('magazines');
  const [magazines, setMagazines] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    // Redirect if not logged in or not a publisher
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'publisher') {
      navigate('/');
      return;
    }
    
    // Load data
    setMagazines(publisherMagazines);
    setSales(publisherSales);
  }, [user, navigate]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Publisher Dashboard</h1>
        <p>Welcome back, {user?.name || 'Publisher'}!</p>
      </div>
      
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <h3>Total Magazines</h3>
          <p className={styles.statValue}>{magazines.length}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Total Sales</h3>
          <p className={styles.statValue}>${sales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}</p>
        </Card>
        
        <Card className={styles.statCard}>
          <h3>Retailers</h3>
          <p className={styles.statValue}>
            {new Set(sales.map(sale => sale.retailerId)).size}
          </p>
        </Card>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'magazines' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('magazines')}
        >
          My Magazines
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'sales' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          Sales History
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'payouts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('payouts')}
        >
          Payouts
        </button>
      </div>
      
      {activeTab === 'magazines' && (
        <div className={styles.tabContent}>
          <div className={styles.tabHeader}>
            <h2>My Magazines</h2>
            <Button>Add New Magazine</Button>
          </div>
          
          <div className={styles.magazineList}>
            {magazines.map(magazine => (
              <Card key={magazine.id} className={styles.magazineItem}>
                <div className={styles.magazineDetails}>
                  <img src={magazine.coverImage} alt={magazine.title} className={styles.magazineCover} />
                  <div>
                    <h3>{magazine.title}</h3>
                    <p>Category: {magazine.category}</p>
                    <p>Price: ${magazine.price.toFixed(2)}</p>
                    <p>Status: <span className={styles.status}>{magazine.status}</span></p>
                  </div>
                </div>
                <div className={styles.magazineActions}>
                  <Button variant="outline" size="small">Edit</Button>
                  <Button variant="secondary" size="small">View Stats</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'sales' && (
        <div className={styles.tabContent}>
          <h2>Sales History</h2>
          <div className={styles.salesTable}>
            <div className={styles.tableHeader}>
              <div>Date</div>
              <div>Magazine</div>
              <div>Retailer</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {sales.map(sale => (
              <div key={sale.id} className={styles.tableRow}>
                <div>{new Date(sale.date).toLocaleDateString()}</div>
                <div>{sale.magazineTitle}</div>
                <div>{sale.retailerName}</div>
                <div>{sale.quantity}</div>
                <div>${sale.amount.toFixed(2)}</div>
                <div>
                  <span className={`${styles.status} ${styles[sale.status.toLowerCase()]}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'payouts' && (
        <div className={styles.tabContent}>
          <h2>Payouts</h2>
          <Card className={styles.payoutSummary}>
            <h3>Available for Payout</h3>
            <p className={styles.payoutAmount}>$1,245.80</p>
            <Button>Request Payout</Button>
          </Card>
          
          <h3>Payout History</h3>
          <div className={styles.payoutTable}>
            <div className={styles.tableHeader}>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            <div className={styles.tableRow}>
              <div>05/15/2023</div>
              <div>$980.50</div>
              <div><span className={`${styles.status} ${styles.completed}`}>Completed</span></div>
            </div>
            <div className={styles.tableRow}>
              <div>04/12/2023</div>
              <div>$1,245.75</div>
              <div><span className={`${styles.status} ${styles.completed}`}>Completed</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublisherDashboard;