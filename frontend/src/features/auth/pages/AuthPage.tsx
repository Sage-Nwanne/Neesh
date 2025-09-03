import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/shared/Navbar';
import Footer from '../../../components/shared/Footer';
import styles from '../../../pages/Home.module.css';

const AuthPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Navbar />

      {/* Auth Content */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '2rem', color: '#000' }}>
              Request Access for Your Shop
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '3rem' }}>
              Coming soon - We're building the retailer access portal.
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

export default AuthPage;
