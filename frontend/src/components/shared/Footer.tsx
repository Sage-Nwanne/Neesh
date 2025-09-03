import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
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
        <a href="https://casesensitive.show/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <img src="/casesensitive favicon.webp" alt="Casesensitive" className={styles.faviconIcon} />
          Casesensitive
        </a>
      </div>
    </footer>
  );
};

export default Footer;
