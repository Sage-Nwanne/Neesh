import { useState, useEffect } from 'react';
import styles from './Orders.module.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  return (
    <div className={styles.orders}>
      <div className="container">
        <h1>Orders</h1>
        <div className={styles.orderList}>
          {/* Order list will go here */}
          <p>No orders found</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;