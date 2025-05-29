import { Link, useNavigate } from 'react-router-dom'; // Fix the import path
import Button from '../../components/common/Button';
import styles from '../../components/layout/Navbar.module.css';
import { logout } from '../../api'; // Fix the import path

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout API
      await logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setUser(null);
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Neesh
        </Link>
        
        <div className={styles.navLinks}>
          {!user ? (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Button onClick={() => navigate('/signup')} size="small">Sign Up</Button>
            </>
          ) : (
            <>
              {user.role === 'Publisher' ? (
                <Link to="/publisher-dashboard" className={styles.navLink}>Dashboard</Link>
              ) : (
                <Link to="/retailer-dashboard" className={styles.navLink}>Dashboard</Link>
              )}
              <span className={styles.welcome}>Welcome, {user.username}</span>
              <Button onClick={handleLogout} variant="outline" size="small">Logout</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
