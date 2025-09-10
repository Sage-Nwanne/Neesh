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
          <Link to="/">
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logoImage} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to="/publisher-application" className={styles.navLink}>Apply to List a Magazine</Link>
          <Link to="/retailer-application" className={styles.navLink}>Request Access for Your Shop</Link>
          <Link to="/faq" className={styles.navLink}>FAQ</Link>
          <a href="mailto:hi@neesh.art" className={styles.navLink}>Talk to the Team</a>
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
          <Link to="/publisher-application" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Apply to List a Magazine</Link>
          <Link to="/retailer-application" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Request Access for Your Shop</Link>
          <Link to="/faq" className={styles.mobileNavLink} onClick={toggleMobileMenu}>FAQ</Link>
          <a href="mailto:hi@neesh.art" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Talk to the Team</a>
          <Link to="/why-neesh" className={styles.mobileNavLink} onClick={toggleMobileMenu}>Why Neesh</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
