import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import styles from './Navbar.module.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
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
              {user.role === 'publisher' ? (
                <Link to="/publisher-dashboard" className={styles.navLink}>Dashboard</Link>
              ) : (
                <Link to="/retailer-dashboard" className={styles.navLink}>Dashboard</Link>
              )}
              <span className={styles.welcome}>Welcome, {user.name}</span>
              <Button onClick={handleLogout} variant="outline" size="small">Logout</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
