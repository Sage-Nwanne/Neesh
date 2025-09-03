import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';

const WhyNeeshPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Navbar />

      {/* Why Neesh Content */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '2rem', color: '#000' }}>
              Why Neesh?
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
              Coming soon - Learn more about our mission and story.
            </p>
            <Link 
              to="/" 
              style={{
                background: '#000',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WhyNeeshPage;
