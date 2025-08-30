import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublisherApplicationForm from '@/components/application/PublisherApplicationForm';

const ApplicationPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const headerStyles = {
    background: 'white',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    padding: '15px 0',
    borderBottom: '1px solid #f0f0f0'
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 40px',
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const
  };

  const logoStyles = {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#000'
  };

  const navStyles = {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '2rem'
  };

  const navLinkStyles = {
    textDecoration: 'none',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.3s ease',
    whiteSpace: 'nowrap' as const
  };

  const mobileMenuBtnStyles = {
    display: window.innerWidth <= 768 ? 'flex' : 'none',
    flexDirection: 'column' as const,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    gap: '4px'
  };

  const hamburgerStyles = {
    width: '20px',
    height: '2px',
    background: '#000',
    transition: 'all 0.3s ease'
  };

  const desktopNavStyles = {
    ...navStyles,
    display: window.innerWidth <= 768 ? 'none' : 'flex'
  };

  const mobileMenuStyles = {
    display: mobileMenuOpen ? 'block' : 'none',
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    borderBottom: '1px solid #f0f0f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 99
  };

  const mobileNavLinkStyles = {
    display: 'block',
    padding: '15px 20px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: 500,
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div>
      {/* Header - Styled exactly like home page */}
      <header style={headerStyles}>
        <div style={containerStyles}>
          <div style={logoStyles}>
            <img src="/NEESH-logo-transparent.png.png" alt="NEESH" style={{ height: '32px', width: 'auto' }} />
          </div>

          {/* Desktop Navigation */}
          <nav style={desktopNavStyles}>
            <Link to="/" style={navLinkStyles}>Home</Link>
            <Link to="/faq" style={navLinkStyles}>FAQ</Link>
            <a href="mailto:hi@neesh.art" style={navLinkStyles}>Talk to the Team</a>
            <Link to="/why-neesh" style={navLinkStyles}>Why Neesh</Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            style={mobileMenuBtnStyles}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span style={hamburgerStyles}></span>
            <span style={hamburgerStyles}></span>
            <span style={hamburgerStyles}></span>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div style={mobileMenuStyles}>
          <Link to="/" style={mobileNavLinkStyles} onClick={toggleMobileMenu}>Home</Link>
          <Link to="/faq" style={mobileNavLinkStyles} onClick={toggleMobileMenu}>FAQ</Link>
          <a href="mailto:hi@neesh.art" style={mobileNavLinkStyles} onClick={toggleMobileMenu}>Talk to the Team</a>
          <Link to="/why-neesh" style={mobileNavLinkStyles} onClick={toggleMobileMenu}>Why Neesh</Link>
        </div>
      </header>

      <PublisherApplicationForm />
    </div>
  );
};

export default ApplicationPage;
