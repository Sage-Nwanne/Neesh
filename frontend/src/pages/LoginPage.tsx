import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import styles from './LoginPage.module.css';
import { ChevronRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        {/* NEESH Logo */}
        <Link to="/" className={styles.logoLink}>
          <img src="/NEESH-logo-transparent.png.png" alt="NEESH" className={styles.logo} />
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>OR</span>
          <span className={styles.dividerLine}></span>
        </div>

        {/* Sign Up Section */}
        <div className={styles.signupSection}>
          <span className={styles.signupText}>New to Neesh?</span>
          <a
            href="https://app.neesh.art"
            className={styles.signupLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply <ChevronRight size={16} className={styles.chevron} />
          </a>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
        </div>

        {/* Talk to Team */}
        <div className={styles.talkToTeam}>
          <span className={styles.questionText}>Have any questions?</span>
          <Link to="/faq" className={styles.teamLink}>
            Talk to the team <ChevronRight size={16} className={styles.chevron} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
