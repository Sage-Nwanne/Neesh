import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api';
import styles from './Signup.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'retailer'
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare data for API (exclude confirmPassword)
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      
      // Make API call to signup
      const response = await signup(userData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set user in state
      const newUser = response.data.user;
      setUser(newUser);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Redirect based on user role
      if (newUser.role === 'publisher') {
        navigate('/publisher-dashboard');
      } else if (newUser.role === 'retailer') {
        navigate('/retailer-dashboard');
      } else {
        navigate('/'); // Fallback
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <Card className={styles.signupCard}>
        <h2>Join NEESH</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          
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
              placeholder="Create a password (min 6 characters)"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="retailer">Retailer</option>
              <option value="publisher">Publisher</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            size="large" 
            variant="primary" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
