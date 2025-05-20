import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Signup.module.css';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'retailer'
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
    
    // Simulate API call
    setTimeout(() => {
      // Demo signup logic
      setUser({
        id: Math.floor(Math.random() * 1000),
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
      
      if (formData.role === 'publisher') {
        navigate('/publisher-dashboard');
      } else {
        navigate('/retailer-dashboard');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.signupPage}>
      <Card className={styles.signupCard}>
        <h1>Join Neesh</h1>
        <p className={styles.subheading}>Create your account to get started</p>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
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
              { value: 'retailer', label: 'Retailer' },
              { value: 'publisher', label: 'Publisher' }
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
