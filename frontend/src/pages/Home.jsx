import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackendTest from '../components/common/BackendTest';
import { magazineData } from '../data/dummyData';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'fashion', 'lifestyle', 'tech', 'food', 'travel'];
  
  const filteredMagazines = selectedCategory === 'all' 
    ? magazineData 
    : magazineData.filter(mag => mag.category === selectedCategory);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1>The Next Generation.</h1>
            <p>Empowering businesses and individuals with cutting-edge magazine distribution solutions.</p>
            <Button size="large" variant="secondary">
              Join Here
            </Button>
          </div>
        </div>
      </section>
      
      {/* Developer Tools - Only in Development */}
      {process.env.NODE_ENV === 'development' && (
        <section className="container">
          <div className={styles.developerSection}>
            <h2>Developer Tools</h2>
            <BackendTest />
          </div>
        </section>
      )}
      
      {/* Featured Magazines Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Featured Magazines</h2>
            <p>Discover amazing publications from publishers around the world</p>
          </div>
          
          <div className={styles.categoryFilter}>
            {categories.map(category => (
              <button 
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className={styles.magazineGrid}>
            {filteredMagazines.map(magazine => (
              <Card key={magazine.id} className={styles.magazineCard}>
                <img 
                  src={magazine.coverImage} 
                  alt={magazine.title} 
                  className={styles.magazineCover} 
                />
                <h3>{magazine.title}</h3>
                <p className={styles.publisher}>by {magazine.publisher}</p>
                <p className={styles.price}>${magazine.price.toFixed(2)}</p>
                <Button variant="outline" size="small">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.ctaContainer}>
            <div className={styles.ctaCard}>
              <h2>For Publishers</h2>
              <p>Reach more retailers and grow your distribution network with our cutting-edge platform.</p>
              <Button variant="outline" size="medium">
                Join as Publisher
              </Button>
            </div>
            
            <div className={styles.ctaCard}>
              <h2>For Retailers</h2>
              <p>Discover unique magazines and expand your inventory with exclusive publishing partnerships.</p>
              <Button variant="primary" size="medium">
                Join as Retailer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
