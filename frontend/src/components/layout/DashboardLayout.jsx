import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, user }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/publisher-dashboard' },
    { icon: '📦', label: 'Products', path: '/products' },
    { icon: '👥', label: 'Customers', path: '/customers' },
    { icon: '📈', label: 'Analytics', path: '/analytics' },
    { icon: '🔧', label: 'Widgets', path: '/widgets' },
    { icon: '📋', label: 'Reports', path: '/reports' },
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>NEESH</h2>
        </div>
        
        <nav className={styles.navigation}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <Link 
                to={item.path}
                className={`${styles.menuLink} ${isActive(item.path) ? styles.active : ''}`}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
