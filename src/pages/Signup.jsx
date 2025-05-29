import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { signup } from '../api';

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Retailer'
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
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
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
      if (newUser.role === 'Publisher') {
        navigate('/publisher-dashboard');
      } else {
        navigate('/retailer-dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with an error
        setError(err.response.data.message || 'Error creating account');
      } else if (err.request) {
        // No response received
        setError('Server not responding. Please try again later.');
      } else {
        // Something else went wrong
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <Card className={styles.signupCard}>
        <h1>Join Neesh</h1>
        <p className={styles.subheading}>Create your account to get started</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Your username"
          />
          
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
            placeholder="Create a password"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
          
          <Select
            label="I am a"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: 'Retailer', label: 'Retailer' },
              { value: 'Publisher', label: 'Publisher' }
            ]}
          />
          
          <Button type="submit" disabled={loading} className={styles.signupButton}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        
        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
