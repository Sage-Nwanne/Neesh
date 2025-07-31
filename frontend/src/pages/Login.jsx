import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { login } from '../api';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Make API call to login
      const response = await login(formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user in state
      const userData = response.data.user;
      setUser(userData);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect based on user role
      if (userData.role === 'publisher') {
        navigate('/publisher-dashboard');
      } else if (userData.role === 'retailer') {
        navigate('/retailer-dashboard');
      } else {
        navigate('/'); // Fallback
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with an error
        setError(err.response.data.message || 'Invalid email or password');
      } else if (err.request) {
        // No response received
        setError('Server not responding. Please try again later.');
      } else {
        // Something else went wrong
        setError('An error occurred. Please try again.');
      }
      
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
