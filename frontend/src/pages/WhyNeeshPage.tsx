import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const WhyNeeshPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logoImage} />
          </div>
          <nav className={styles.nav}>
            <Link to="/publisher-application" className={styles.navLink}>Apply to List a Magazine</Link>
            <Link to="/auth" className={styles.navLink}>Request Access for Your Shop</Link>
            <Link to="/faq" className={styles.navLink}>FAQ</Link>
            <a href="mailto:hi@neesh.art" className={styles.navLink}>Talk to the Team</a>
            <Link to="/why-neesh" className={styles.navLink}>Why Neesh</Link>
          </nav>
        </div>
      </header>

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
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerLogo}>
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.footerLogoImage} />
          </div>
        </div>
        <div className={styles.socialLinks}>
          <a href="https://www.instagram.com/neeshprint?igsh=M2o0MmpxY3hnejZ2" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            Instagram
          </a>
          <a href="mailto:hi@neesh.art" className={styles.socialLink}>
            Contact
          </a>
          <a href="https://casesensitive.co.uk" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <img src="/casesensitive favicon.webp" alt="Casesensitive" className={styles.faviconIcon} />
            Casesensitive
          </a>
        </div>
      </footer>
    </div>
  );
};

export default WhyNeeshPage;
