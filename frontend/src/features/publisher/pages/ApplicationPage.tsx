import React from 'react';
import { Link } from 'react-router-dom';
import PublisherApplicationForm from '@/components/application/PublisherApplicationForm';

const ApplicationPage: React.FC = () => {
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

  return (
    <div>
      {/* Header - Styled exactly like home page */}
      <header style={headerStyles}>
        <div style={containerStyles}>
          <div style={logoStyles}>NEESH</div>
          <nav style={navStyles}>
            <Link to="/" style={navLinkStyles}>Home</Link>
            <Link to="/faq" style={navLinkStyles}>FAQ</Link>
            <a href="mailto:hi@neesh.art" style={navLinkStyles}>Talk to the Team</a>
            <Link to="/why-neesh" style={navLinkStyles}>Why Neesh</Link>
          </nav>
        </div>
      </header>

      <PublisherApplicationForm />
    </div>
  );
};

export default ApplicationPage;
