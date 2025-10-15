import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

interface NavbarProps {
  showMobileMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showMobileMenu = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <a href="/">
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logoImage} />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to="/publisher-application" className={styles.navLink}>For Publishers</Link>
          <Link to="/retailer-application" className={styles.navLink}>For Retailers</Link>
          <Link to="/faq" className={styles.navLink}>FAQ</Link>
          <Link to="/why-neesh" className={styles.navLink}>Why Neesh</Link>
        </nav>

        {/* Mobile Hamburger Button */}
        {showMobileMenu && (
          <button
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/publisher-application" className={styles.mobileNavLink} onClick={toggleMobileMenu}>For Publishers</Link>
          <Link to="/retailer-application" className={styles.mobileNavLink} onClick={toggleMobileMenu}>For Retailers</Link>
          <Link to="/faq" className={styles.mobileNavLink} onClick={toggleMobileMenu}>FAQ</Link>
          <Link to="/why-neesh" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Why Neesh</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
