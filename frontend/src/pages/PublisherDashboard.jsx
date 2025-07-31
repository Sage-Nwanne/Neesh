import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PaymentOptions from '../components/checkout/PaymentOptions';
import styles from './PublisherDashboard.module.css';

// Inline dummy data to avoid import issues
const publisherMagazines = [
  {
    id: 1,
    title: "Modern Living",
    category: "lifestyle",
    price: 8.99,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Home Design Quarterly",
    category: "lifestyle", 
    price: 9.99,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Outdoor Living",
    category: "lifestyle",
    price: 7.99,
    status: "Draft",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  }
];

const publisherSales = [
  {
    id: 1,
    date: "2023-06-15",
    magazineTitle: "Modern Living",
    retailerId: 101,
    retailerName: "City Books",
    quantity: 25,
    amount: 224.75,
    status: "completed"
  },
  {
    id: 2,
    date: "2023-06-10", 
    magazineTitle: "Home Design Quarterly",
    retailerId: 102,
    retailerName: "Magazine World",
    quantity: 15,
    amount: 149.85,
    status: "completed"
  }
];

const PublisherDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    totalMagazines: 3,
    totalRevenue: 2847.50,
    completedSales: 12,
    pendingOrders: 4,
    magazines: publisherMagazines,
    recentOrders: publisherSales
  });

  return (
    <DashboardLayout user={user}>
      <div className={styles.dashboardGrid}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Publisher Dashboard</h1>
            <p>Welcome back, {user?.username || 'Publisher'}!</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <h3>Total Magazines</h3>
              <div className={styles.statValue}>{dashboardData.totalMagazines}</div>
              <div className={styles.statChange}>+2 this month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <h3>Total Revenue</h3>
              <div className={styles.statValue}>${dashboardData.totalRevenue.toLocaleString()}</div>
              <div className={styles.statChange}>+15% from last month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <h3>Completed Sales</h3>
              <div className={styles.statValue}>{dashboardData.completedSales}</div>
              <div className={styles.statChange}>+3 this week</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏳</div>
              <h3>Pending Orders</h3>
              <div className={styles.statValue}>{dashboardData.pendingOrders}</div>
              <div className={styles.statChange}>2 need attention</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>My Magazines</h2>
              <button className={styles.addButton}>+ Add Magazine</button>
            </div>
            <div className={styles.magazineGrid}>
              {dashboardData.magazines.map(magazine => (
                <div key={magazine.id} className={styles.magazineCard}>
                  <div className={styles.magazineCover}>
                    <img src={magazine.coverImage} alt={magazine.title} />
                    <div className={styles.statusBadge}>
                      <span className={`${styles.status} ${styles[magazine.status.toLowerCase()]}`}>
                        {magazine.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.magazineInfo}>
                    <h4>{magazine.title}</h4>
                    <p className={styles.category}>{magazine.category}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>${magazine.price}</span>
                      <button className={styles.editBtn}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Recent Orders</h2>
              <button className={styles.viewAllBtn}>View All</button>
            </div>
            <div className={styles.ordersTable}>
              <div className={styles.tableHeader}>
                <span>Date</span>
                <span>Magazine</span>
                <span>Retailer</span>
                <span>Quantity</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {dashboardData.recentOrders.map(order => (
                <div key={order.id} className={styles.tableRow}>
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                  <span>{order.magazineTitle}</span>
                  <span>{order.retailerName}</span>
                  <span>{order.quantity}</span>
                  <span>${order.amount}</span>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <PaymentOptions />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PublisherDashboard;
