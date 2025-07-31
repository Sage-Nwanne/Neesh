import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Get stored user data from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(u => u.email === formData.email);
    
    setTimeout(() => {
      // Check if user exists and password matches
      if (user && user.password === formData.password) {
        // Create a user object without the password for security
        const loggedInUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        setUser(loggedInUser);
        
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        
        if (user.role === 'publisher') {
          navigate('/publisher-dashboard');
        } else {
          navigate('/retailer-dashboard');
        }
      } else {
        // Fallback to demo accounts for testing
        if (formData.email === 'publisher@example.com' && formData.password === 'password') {
          setUser({
            id: 1,
            name: 'John Publisher',
            email: 'publisher@example.com',
            role: 'publisher'
          });
          navigate('/publisher-dashboard');
        } else if (formData.email === 'retailer@example.com' && formData.password === 'password') {
          setUser({
            id: 2,
            name: 'Jane Retailer',
            email: 'retailer@example.com',
            role: 'retailer'
          });
          navigate('/retailer-dashboard');
        } else {
          setError('Invalid email or password');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <Card className={styles.loginCard}>
        <h1>Login to Neesh</h1>
        <p className={styles.subheading}>Enter your credentials to access your account</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Your password"
          />
          
          <Button type="submit" disabled={loading} className={styles.loginButton}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className={styles.signupText}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;