import { useState, useEffect } from 'react';
import { adminOrdersData } from '../../data/dummyData';
import styles from './OrderCoordination.module.css';

const OrderCoordination = ({ onUpdate }) => {
  const [orders, setOrders] = useState(adminOrdersData);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    onUpdate?.();
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.orderCoordination}>
      <div className={styles.header}>
        <h2>Order Coordination</h2>
        <div className={styles.filters}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className={styles.ordersList}>
          {filteredOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3>Order #{order.id}</h3>
                  <p className={styles.magazine}>{order.magazine_title}</p>
                  <p className={styles.parties}>
                    {order.publisher_name} → {order.retailer_name}
                  </p>
                </div>
                <div className={styles.orderDetails}>
                  <p className={styles.quantity}>Qty: {order.quantity}</p>
                  <p className={styles.amount}>${order.total_amount}</p>
                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.orderMeta}>
                <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                <p>Expected Delivery: {order.expected_delivery}</p>
                {order.tracking_number && (
                  <p>Tracking: {order.tracking_number}</p>
                )}
              </div>

              <div className={styles.actions}>
                {order.status === 'pending' && (
                  <button 
                    className={styles.processBtn}
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                  >
                    Start Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button 
                    className={styles.shipBtn}
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                  >
                    Mark as Shipped
                  </button>
                )}
                <button className={styles.contactBtn}>Contact Parties</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCoordination;
