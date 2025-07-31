import { useState, useEffect } from 'react';
import styles from './Marketplace.module.css';

const Marketplace = () => {
  const [products, setProducts] = useState([]);

  return (
    <div className={styles.marketplace}>
      <div className="container">
        <h1>Marketplace</h1>
        <div className={styles.productGrid}>
          {/* Product cards will go here */}
          <p>No products available</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;