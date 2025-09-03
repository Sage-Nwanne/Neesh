import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import styles from './Home.module.css';

const DashboardComingSoonPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Navbar />

      {/* Dashboard Coming Soon Content */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '2rem', color: '#000' }}>
              Publisher Dashboard
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1.5rem' }}>
              Your application has been submitted successfully!
            </p>
            <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem' }}>
              We'll review your application and get back to you within <strong>5-7 business days</strong>. 
              In the meantime, keep an eye on your inbox for updates.
            </p>
            <Link 
              to="/" 
              style={{
                background: '#000',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
                borderRadius: '4px'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardComingSoonPage;
