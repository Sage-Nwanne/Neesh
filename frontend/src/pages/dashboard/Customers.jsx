import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { customersData } from '../../data/dummyData';
import styles from './Customers.module.css';

const Customers = ({ user }) => {
  const [customers, setCustomers] = useState(customersData);
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || customer.type.toLowerCase().includes(filterType.toLowerCase());
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'orders') return b.total_orders - a.total_orders;
      if (sortBy === 'spent') return b.total_spent - a.total_spent;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <DashboardLayout user={user}>
      <div className={styles.customersPage}>
        <div className={styles.header}>
          <h1>Customers</h1>
          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name">Sort by Name</option>
              <option value="orders">Sort by Orders</option>
              <option value="spent">Sort by Spending</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <button className={styles.exportBtn}>Export</button>
          </div>
        </div>

        <div className={styles.filters}>
          <button 
            className={filterType === 'all' ? styles.active : ''}
            onClick={() => setFilterType('all')}
          >
            All Customers ({customers.length})
          </button>
          <button 
            className={filterType === 'bookstore' ? styles.active : ''}
            onClick={() => setFilterType('bookstore')}
          >
            Bookstores ({customers.filter(c => c.type.includes('Bookstore')).length})
          </button>
          <button 
            className={filterType === 'retailer' ? styles.active : ''}
            onClick={() => setFilterType('retailer')}
          >
            Retailers ({customers.filter(c => c.type.includes('Retailer')).length})
          </button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Customers</h3>
            <div className={styles.statValue}>{customers.length}</div>
            <div className={styles.statChange}>+3 this month</div>
          </div>
          <div className={styles.statCard}>
            <h3>Average Order Value</h3>
            <div className={styles.statValue}>
              ${(customers.reduce((sum, c) => sum + c.avg_order_value, 0) / customers.length).toFixed(2)}
            </div>
            <div className={styles.statChange}>+5.2% from last month</div>
          </div>
          <div className={styles.statCard}>
            <h3>Total Revenue</h3>
            <div className={styles.statValue}>
              ${customers.reduce((sum, c) => sum + c.total_spent, 0).toLocaleString()}
            </div>
            <div className={styles.statChange}>+12.8% from last month</div>
          </div>
          <div className={styles.statCard}>
            <h3>Average Rating</h3>
            <div className={styles.statValue}>
              {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
            </div>
            <div className={styles.statChange}>+0.2 from last month</div>
          </div>
        </div>

        <div className={styles.customersTable}>
          <div className={styles.tableHeader}>
            <span>Customer</span>
            <span>Type</span>
            <span>Location</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Avg Order</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filteredAndSortedCustomers.map(customer => (
            <div key={customer.id} className={styles.tableRow}>
              <div className={styles.customerInfo}>
                <div className={styles.customerName}>{customer.name}</div>
                <div className={styles.customerEmail}>{customer.email}</div>
              </div>
              <span className={styles.customerType}>{customer.type}</span>
              <span>{customer.location}</span>
              <span>{customer.total_orders}</span>
              <span>${customer.total_spent.toFixed(2)}</span>
              <span>${customer.avg_order_value.toFixed(2)}</span>
              <div className={styles.rating}>
                <span>⭐ {customer.rating}</span>
              </div>
              <span className={`${styles.status} ${styles[customer.status.toLowerCase()]}`}>
                {customer.status}
              </span>
              <div className={styles.actions}>
                <button className={styles.viewBtn}>View</button>
                <button className={styles.contactBtn}>Contact</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.customerInsights}>
          <div className={styles.insightCard}>
            <h3>Top Customers</h3>
            <div className={styles.topCustomers}>
              {customers
                .sort((a, b) => b.total_spent - a.total_spent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className={styles.topCustomerItem}>
                    <div className={styles.rank}>#{index + 1}</div>
                    <div className={styles.customerDetails}>
                      <strong>{customer.name}</strong>
                      <span>${customer.total_spent.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.insightCard}>
            <h3>Customer Distribution</h3>
            <div className={styles.distribution}>
              <div className={styles.distributionItem}>
                <span>Independent Bookstores</span>
                <div className={styles.distributionBar}>
                  <div className={styles.distributionProgress} style={{ width: '60%' }}></div>
                </div>
                <span>60%</span>
              </div>
              <div className={styles.distributionItem}>
                <span>Magazine Retailers</span>
                <div className={styles.distributionBar}>
                  <div className={styles.distributionProgress} style={{ width: '25%' }}></div>
                </div>
                <span>25%</span>
              </div>
              <div className={styles.distributionItem}>
                <span>Chain Stores</span>
                <div className={styles.distributionBar}>
                  <div className={styles.distributionProgress} style={{ width: '15%' }}></div>
                </div>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
