import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface CMSNavigationProps {
  onLogout: () => void;
}

const CMSNavigation: React.FC<CMSNavigationProps> = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/cms-dashboard', label: 'CMS Dashboard', icon: '🏠' },
    { path: '/page-editor', label: 'Page Editor', icon: '📝' },
    { path: '/admin-panel', label: 'Admin Panel', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem',
      borderBottom: '3px solid #3498db',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <h2 style={{
            color: 'white',
            margin: 0,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            NEESH CMS
          </h2>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isActive(item.path) ? '#3498db' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  transition: 'background-color 0.2s',
                  border: isActive(item.path) ? 'none' : '1px solid rgba(255,255,255,0.2)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c0392b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e74c3c';
          }}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default CMSNavigation;
