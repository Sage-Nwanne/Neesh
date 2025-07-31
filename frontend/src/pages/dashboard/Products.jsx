import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { productsData } from '../../data/dummyData';
import styles from './Products.module.css';

const Products = ({ user }) => {
  const [products, setProducts] = useState(productsData);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredProducts = products.filter(product => 
    filter === 'all' || product.status.toLowerCase() === filter
  );

  const addProduct = (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      created_at: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      sold: 0,
      revenue: 0
    };
    setProducts([newProduct, ...products]);
    setShowAddForm(false);
  };

  return (
    <DashboardLayout user={user}>
      <div className={styles.productsPage}>
        <div className={styles.header}>
          <h1>Products</h1>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            + Add Product
          </button>
        </div>

        <div className={styles.filters}>
          <button 
            className={filter === 'all' ? styles.active : ''}
            onClick={() => setFilter('all')}
          >
            All ({products.length})
          </button>
          <button 
            className={filter === 'active' ? styles.active : ''}
            onClick={() => setFilter('active')}
          >
            Active ({products.filter(p => p.status === 'Active').length})
          </button>
          <button 
            className={filter === 'draft' ? styles.active : ''}
            onClick={() => setFilter('draft')}
          >
            Draft ({products.filter(p => p.status === 'Draft').length})
          </button>
        </div>

        <div className={styles.productsGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={product.coverImage} alt={product.title} />
                <div className={styles.statusBadge}>
                  <span className={`${styles.status} ${styles[product.status.toLowerCase()]}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.productStats}>
                  <div className={styles.stat}>
                    <span>Price</span>
                    <strong>${product.price}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>Stock</span>
                    <strong>{product.stock}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>Sold</span>
                    <strong>{product.sold}</strong>
                  </div>
                  <div className={styles.stat}>
                    <span>Revenue</span>
                    <strong>${product.revenue.toFixed(2)}</strong>
                  </div>
                </div>
                <div className={styles.productActions}>
                  <button className={styles.editBtn}>Edit</button>
                  <button className={styles.viewBtn}>View</button>
                  <button className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Add New Product</h2>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setShowAddForm(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addProduct({
                  title: formData.get('title'),
                  category: formData.get('category'),
                  price: parseFloat(formData.get('price')),
                  stock: parseInt(formData.get('stock')),
                  description: formData.get('description'),
                  coverImage: formData.get('coverImage') || 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
                  status: formData.get('status')
                });
              }}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input type="text" name="title" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select name="category" required>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Price</label>
                    <input type="number" name="price" step="0.01" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Stock</label>
                    <input type="number" name="stock" required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea name="description" rows="3" required></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label>Cover Image URL</label>
                  <input type="url" name="coverImage" />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select name="status" required>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
