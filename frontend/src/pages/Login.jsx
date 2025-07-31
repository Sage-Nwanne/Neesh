import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import styles from './Login.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set user in state
      setUser(response.data.user);
      
      // Redirect based on user role
      if (response.data.user.role === 'publisher') {
        navigate('/publisher-dashboard');
      } else if (response.data.user.role === 'retailer') {
        navigate('/retailer-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      
      // Fallback to demo accounts for testing/development
      if (process.env.NODE_ENV === 'development') {
        if (formData.email === 'publisher@example.com' && formData.password === 'password') {
          const demoUser = {
            id: 1,
            username: 'JohnPublisher',
            email: 'publisher@example.com',
            role: 'publisher'
          };
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          navigate('/publisher-dashboard');
          setError('');
        } else if (formData.email === 'retailer@example.com' && formData.password === 'password') {
          const demoUser = {
            id: 2,
            username: 'JaneRetailer',
            email: 'retailer@example.com',
            role: 'retailer'
          };
          setUser(demoUser);
          localStorage.setItem('user', JSON.stringify(demoUser));
          navigate('/retailer-dashboard');
          setError('');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <h2>Login to NEESH</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <Button 
            type="submit" 
            size="large" 
            variant="primary" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className={styles.signupLink}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className={styles.demoAccounts}>
            <h4>Demo Accounts:</h4>
            <p>Publisher: publisher@example.com / password</p>
            <p>Retailer: retailer@example.com / password</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
